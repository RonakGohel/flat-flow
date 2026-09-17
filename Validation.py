"""
AuditMySociety — input validation layer.
Runs against the monthly expense submission before it ever reaches Bedrock.
Catches the edge cases baked into sample_data.json:
  - duplicate bills
  - amount typos / outliers
  - reconciliation mismatch (collected != spent)
  - missing expected categories
  - non-paying / vacant flat handling
"""

import json
from collections import defaultdict
from statistics import mean, pstdev

# Categories the society normally bills for. In a real system this comes
# from the society's historical data (last 6 months); hardcoded here for MVP.
EXPECTED_CATEGORIES = {
    "Security", "Housekeeping", "Water", "Common Electricity",
    "Lift AMC", "Reserve Fund", "Generator Diesel"
}

# How far an expense can deviate from its category's typical value before
# it's flagged as a likely typo. 3x is deliberately loose — tune per category
# once you have real historical data instead of one month of fake data.
OUTLIER_MULTIPLIER = 3


def check_duplicates(expenses):
    """Flag expenses that share category + vendor + amount + month.
    Catches E004/E005 in the sample data (same electricity bill twice)."""
    seen = defaultdict(list)
    for e in expenses:
        key = (e["category"], e["vendor"], e["amount"], e["date"][:7])  # YYYY-MM
        seen[key].append(e["id"])

    flags = []
    for key, ids in seen.items():
        if len(ids) > 1:
            flags.append({
                "type": "DUPLICATE_ENTRY",
                "category": key[0],
                "vendor": key[1],
                "amount": key[2],
                "expense_ids": ids,
                "message": f"{len(ids)} entries for the same {key[0]} bill from "
                           f"{key[1]} at ₹{key[2]} — likely a duplicate upload."
            })
    return flags


def check_outliers(expenses, history=None):
    """Flag expenses that are way above their category's typical value.
    Without real history, this falls back to comparing against the current
    month's other categories, which is weak — replace `history` with actual
    past-month data as soon as you have more than one month of it.
    Catches E003 (₹50,000 water bill instead of ₹5,000)."""
    flags = []

    if history:
        by_cat = defaultdict(list)
        for e in history:
            by_cat[e["category"]].append(e["amount"])

        for e in expenses:
            past = by_cat.get(e["category"])
            if past and len(past) >= 2:
                avg = mean(past)
                if e["amount"] > avg * OUTLIER_MULTIPLIER:
                    flags.append({
                        "type": "AMOUNT_OUTLIER",
                        "expense_id": e["id"],
                        "category": e["category"],
                        "amount": e["amount"],
                        "typical_amount": round(avg, 2),
                        "message": f"{e['category']} is ₹{e['amount']}, "
                                   f"vs a typical ₹{round(avg, 2)} — check for a typo."
                    })
    else:
        # Fallback for MVP demo: flag anything that's a suspiciously round
        # number an order of magnitude above the cheapest categories.
        amounts = [e["amount"] for e in expenses]
        if amounts:
            baseline = min(amounts)
            for e in expenses:
                if e["amount"] >= baseline * 10 and e["amount"] % 10000 == 0:
                    flags.append({
                        "type": "AMOUNT_OUTLIER",
                        "expense_id": e["id"],
                        "category": e["category"],
                        "amount": e["amount"],
                        "message": f"{e['category']} at ₹{e['amount']} looks unusually "
                                   f"high and suspiciously round — possible typo "
                                   f"(e.g. an extra zero)."
                    })
    return flags


def check_missing_categories(expenses, expected=EXPECTED_CATEGORIES):
    """Flag categories that are normally billed but absent this month.
    Catches Generator Diesel being missing entirely."""
    present = {e["category"] for e in expenses}
    missing = expected - present
    if not missing:
        return []
    return [{
        "type": "MISSING_CATEGORY",
        "categories": sorted(missing),
        "message": f"Expected categories not found in this month's submission: "
                    f"{', '.join(sorted(missing))}. If these genuinely had no "
                    f"cost this month, confirm — otherwise data may be incomplete."
    }]


def check_reconciliation(expenses, total_collected, duplicate_flags):
    """Flag when total expenses don't match total collected.
    Nets out amounts already caught as duplicates so the mismatch reported
    here isn't double-counting an error you already flagged separately."""
    duplicate_ids = {eid for f in duplicate_flags for eid in f["expense_ids"][1:]}
    net_expenses = sum(e["amount"] for e in expenses if e["id"] not in duplicate_ids)

    delta = net_expenses - total_collected
    if abs(delta) < 1:  # rounding tolerance
        return []

    return [{
        "type": "RECONCILIATION_MISMATCH",
        "total_collected": total_collected,
        "net_expenses": net_expenses,
        "delta": delta,
        "message": (
            f"Total expenses (₹{net_expenses}, after removing likely duplicates) "
            f"{'exceed' if delta > 0 else 'fall short of'} total collected "
            f"(₹{total_collected}) by ₹{abs(delta)}. "
            f"{'Check for a data-entry typo or missing income.' if delta > 0 else 'Funds may be unaccounted for.'}"
        )
    }]


def check_flat_status(flats):
    """Tag flats that need special handling on their receipt:
    non-paying (arrears) and vacant (still billed, flagged as such)."""
    flags = []
    for f in flats:
        if not f.get("paid", True):
            flags.append({
                "type": "ARREARS",
                "flatNo": f["flatNo"],
                "message": f"Flat {f['flatNo']} has not paid this month's dues — "
                           f"receipt should show pending/arrears status, not a normal breakdown."
            })
        if not f.get("occupied", True):
            flags.append({
                "type": "VACANT_FLAT",
                "flatNo": f["flatNo"],
                "message": f"Flat {f['flatNo']} is vacant but still billed at full rate "
                           f"per current split logic — confirm this is intended."
            })
    return flags


def validate_submission(data, history=None):
    """Run all checks and return one consolidated report.
    This is the function Lambda calls before anything goes to Bedrock —
    the report gets attached to the receipt context so the AI can reference
    known issues instead of guessing or hallucinating explanations."""
    expenses = data["expenses"]
    flats = data["flats"]
    total_collected = data["totalCollected"]

    duplicate_flags = check_duplicates(expenses)
    outlier_flags = check_outliers(expenses, history)
    missing_flags = check_missing_categories(expenses)
    reconciliation_flags = check_reconciliation(expenses, total_collected, duplicate_flags)
    flat_flags = check_flat_status(flats)

    all_flags = duplicate_flags + outlier_flags + missing_flags + reconciliation_flags + flat_flags

    return {
        "is_clean": len(all_flags) == 0,
        "flag_count": len(all_flags),
        "flags": all_flags
    }


if __name__ == "__main__":
    with open("sample_data.json") as f:
        data = json.load(f)

    report = validate_submission(data)

    print(f"Clean submission: {report['is_clean']}")
    print(f"Flags raised: {report['flag_count']}\n")
    for flag in report["flags"]:
        print(f"[{flag['type']}] {flag['message']}")
