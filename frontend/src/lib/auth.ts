const COGNITO_DOMAIN =
  "https://ap-south-1hxzzzzdlv.auth.ap-south-1.amazoncognito.com"

const CLIENT_ID = "rbnvl3mghkjetfqjfpjj69l26"

const REDIRECT_URI = `${window.location.origin}/callback`

const CODE_VERIFIER_KEY = "flatflow_code_verifier"
const STATE_KEY = "flatflow_auth_state"

function generateRandomString(length = 64) {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)

  return Array.from(array, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("")
}

async function createCodeChallenge(verifier: string) {
  const data = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest("SHA-256", data)

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

export async function login() {
  const codeVerifier = generateRandomString()
  const state = generateRandomString(32)

  const codeChallenge = await createCodeChallenge(codeVerifier)

  localStorage.setItem(CODE_VERIFIER_KEY, codeVerifier)
  localStorage.setItem(STATE_KEY, state)

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    scope: "openid email phone",
    redirect_uri: REDIRECT_URI,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    state,
  })

  window.location.href =
    `${COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`
}

export async function handleAuthCallback() {
  const params = new URLSearchParams(window.location.search)

  const code = params.get("code")
  const returnedState = params.get("state")
  const error = params.get("error")
  const errorDescription = params.get("error_description")

  if (error) {
    throw new Error(errorDescription || error)
  }

  if (!code) {
    return false
  }

  const savedState = localStorage.getItem(STATE_KEY)
  const codeVerifier = localStorage.getItem(CODE_VERIFIER_KEY)

  if (!savedState || returnedState !== savedState) {
    throw new Error("Invalid authentication state")
  }

  if (!codeVerifier) {
    throw new Error("Missing PKCE code verifier")
  }

  const response = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Token exchange failed: ${message}`)
  }

  const tokens = await response.json()

  if (!tokens.id_token) {
    throw new Error("Cognito did not return an ID token")
  }

  localStorage.setItem("id_token", tokens.id_token)

  if (tokens.access_token) {
    localStorage.setItem("access_token", tokens.access_token)
  }

  if (tokens.refresh_token) {
    localStorage.setItem("refresh_token", tokens.refresh_token)
  }

  localStorage.removeItem(CODE_VERIFIER_KEY)
  localStorage.removeItem(STATE_KEY)

  window.history.replaceState(
    {},
    document.title,
    window.location.origin + "/resident"
  )

  return true
}

export function getStoredToken() {
  return localStorage.getItem("id_token")
}

export function isAuthenticated() {
  return Boolean(getStoredToken())
}

export function logout() {
  localStorage.removeItem("id_token")
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem(CODE_VERIFIER_KEY)
  localStorage.removeItem(STATE_KEY)

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    logout_uri: `${window.location.origin}/`,
  })

  window.location.href =
    `${COGNITO_DOMAIN}/logout?${params.toString()}`
}