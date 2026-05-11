#!/usr/bin/env bash
# zitadel/setup.sh — one-time bootstrap for the Treasure Hunt platform
#
# Run ONCE after the first `docker compose up`:
#
#   1. Visit http://localhost:8180
#   2. Sign in as admin@localhost:8180 (password from ZITADEL_ADMIN_PASSWORD, default: Admin1234!)
#   3. Click your avatar (top-right) → "Personal Access Tokens" → "+ New"
#      - No expiry is fine for local dev
#      - Copy the token
#   4. Run: ZITADEL_SA_PAT=<paste-token> bash zitadel/setup.sh
#   5. Copy the printed VITE_OIDC_CLIENT_ID into your .env file
#
# Run this against a fresh local Zitadel project. If you already created apps,
# either update them in the Zitadel console or reset the local dev volumes first.

set -euo pipefail

BASE="${ZITADEL_URL:-http://localhost:8180}"
PAT="${ZITADEL_SA_PAT:-}"

if [[ -z "$PAT" ]]; then
  echo "ERROR: Set ZITADEL_SA_PAT to a Personal Access Token."
  echo "       See step-by-step instructions at the top of this script."
  exit 1
fi

H_AUTH="Authorization: Bearer $PAT"
H_CT="Content-Type: application/json"

# ── JSON helper ───────────────────────────────────────────────────
jq_field() { python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('$1') or d.get('details',{}).get('id',''))" 2>/dev/null; }

api() {
  local method="$1" path="$2" body="${3:-}"
  if [[ -n "$body" ]]; then
    curl -sf -X "$method" "$BASE$path" -H "$H_AUTH" -H "$H_CT" -d "$body"
  else
    curl -sf -X "$method" "$BASE$path" -H "$H_AUTH"
  fi
}

echo "→ Connecting to $BASE …"
curl -sf "$BASE/debug/healthz" > /dev/null || { echo "Zitadel not reachable at $BASE"; exit 1; }

# ── Project ───────────────────────────────────────────────────────
echo "→ Creating TreasureHunt project …"
PROJECT_ID=$(api POST /management/v1/projects \
  '{"name":"TreasureHunt","projectRoleAssertion":true,"projectRoleCheck":false}' | jq_field id)
echo "  Project ID: $PROJECT_ID"

# ── Roles ─────────────────────────────────────────────────────────
echo "→ Creating roles …"
for role in creator observer player; do
  display=$(python3 -c "print('$role'.capitalize())")
  api POST "/management/v1/projects/$PROJECT_ID/roles" \
    "{\"roleKey\":\"$role\",\"displayName\":\"$display\"}" > /dev/null
done

# ── Web OIDC app (PKCE) ───────────────────────────────────────────
echo "→ Creating web-dashboard OIDC app …"
WEB_CLIENT_ID=$(api POST "/management/v1/projects/$PROJECT_ID/apps/oidc" \
  "{
    \"name\": \"web-dashboard\",
    \"redirectUris\": [
      \"http://localhost:5173/callback\",
      \"http://localhost:5173/\"
    ],
    \"responseTypes\": [\"OIDC_RESPONSE_TYPE_CODE\"],
    \"grantTypes\": [\"OIDC_GRANT_TYPE_AUTHORIZATION_CODE\"],
    \"appType\": \"OIDC_APP_TYPE_USER_AGENT\",
    \"authMethodType\": \"OIDC_AUTH_METHOD_TYPE_NONE\",
    \"postLogoutRedirectUris\": [\"http://localhost:5173/\"],
    \"devMode\": true,
    \"accessTokenType\": \"OIDC_TOKEN_TYPE_JWT\",
    \"accessTokenRoleAssertion\": true,
    \"idTokenRoleAssertion\": true
  }" | jq_field clientId)

# ── Mobile OIDC app ───────────────────────────────────────────────
echo "→ Creating mobile-app OIDC app …"
MOBILE_CLIENT_ID=$(api POST "/management/v1/projects/$PROJECT_ID/apps/oidc" \
  "{
    \"name\": \"mobile-app\",
    \"redirectUris\": [\"treasurehunt://oauth/callback\"],
    \"responseTypes\": [\"OIDC_RESPONSE_TYPE_CODE\"],
    \"grantTypes\": [\"OIDC_GRANT_TYPE_AUTHORIZATION_CODE\"],
    \"appType\": \"OIDC_APP_TYPE_NATIVE\",
    \"authMethodType\": \"OIDC_AUTH_METHOD_TYPE_NONE\",
    \"devMode\": true,
    \"accessTokenType\": \"OIDC_TOKEN_TYPE_JWT\",
    \"accessTokenRoleAssertion\": true
  }" | jq_field clientId)

# ── Dev users ─────────────────────────────────────────────────────
echo "→ Creating dev users (password: 'password') …"
EMAILS=(creator@example.com observer@example.com player@example.com)
ROLES=(creator observer player)

for i in "${!EMAILS[@]}"; do
  email="${EMAILS[$i]}"
  role="${ROLES[$i]}"
  name=$(python3 -c "print('${email%%@*}'.capitalize())")

  USER_ID=$(api POST /management/v1/users/human/_import \
    "{
      \"userName\": \"$email\",
      \"profile\": {\"firstName\": \"$name\", \"lastName\": \".\"},
      \"email\": {\"email\": \"$email\", \"isEmailVerified\": true},
      \"password\": \"Password1!\",
      \"passwordChangeRequired\": false
    }" | jq_field userId)

  api POST "/management/v1/users/$USER_ID/grants" \
    "{\"projectId\": \"$PROJECT_ID\", \"roleKeys\": [\"$role\"]}" > /dev/null
done

# ── Done ──────────────────────────────────────────────────────────
echo ""
echo "✓ Setup complete."
echo ""
echo "Add to .env (or .env.local):"
echo ""
echo "  VITE_OIDC_CLIENT_ID=$WEB_CLIENT_ID"
echo "  VITE_OIDC_ISSUER=http://localhost:8180"
echo "  OIDC_CLIENT_ID=$MOBILE_CLIENT_ID"
echo "  OIDC_ISSUER=http://localhost:8180"
echo ""
echo "Dev accounts — all use password: 'Password1!'"
echo "  creator@example.com  → creator role"
echo "  observer@example.com → observer role"
echo "  player@example.com   → player role"
