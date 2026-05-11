import { UserManager, WebStorageStateStore } from 'oidc-client-ts'
import { setToken } from './api'

const oidcIssuer = import.meta.env.VITE_OIDC_ISSUER ?? 'http://localhost:8180'
const oidcClientId = import.meta.env.VITE_OIDC_CLIENT_ID

const mgr = new UserManager({
  authority:              oidcIssuer,
  client_id:              oidcClientId ?? 'missing-zitadel-client-id',
  redirect_uri:           import.meta.env.VITE_OIDC_REDIRECT_URI ?? `${window.location.origin}/callback`,
  post_logout_redirect_uri: `${window.location.origin}/`,
  response_type:          'code',
  scope:                  'openid profile email offline_access',
  userStore:              new WebStorageStateStore({ store: localStorage }),
  automaticSilentRenew:   true,
})

// Keep the API client in sync when the token renews automatically
mgr.events.addAccessTokenExpiring(async () => {
  const user = await mgr.signinSilent().catch(() => null)
  if (user) setToken(user.access_token)
})

// ── Public helpers ────────────────────────────────────────────

export async function login() {
  if (!oidcClientId) {
    throw new Error('Missing VITE_OIDC_CLIENT_ID. Run zitadel/setup.sh and add the printed web client ID to editions/spring/.env.')
  }
  await mgr.signinRedirect()
}

export async function handleCallback(): Promise<string> {
  const user = await mgr.signinRedirectCallback()
  setToken(user.access_token)
  return user.access_token
}

export async function logout() {
  await mgr.signoutRedirect()
}

export async function getToken(): Promise<string | null> {
  const user = await mgr.getUser()
  if (!user || user.expired) return null
  setToken(user.access_token)
  return user.access_token
}

export async function isLoggedIn(): Promise<boolean> {
  return (await getToken()) !== null
}
