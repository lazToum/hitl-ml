import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

const _issuer       = String.fromEnvironment('OIDC_ISSUER',      defaultValue: 'http://localhost:8180');
const _clientId     = String.fromEnvironment('OIDC_CLIENT_ID',   defaultValue: 'mobile-app');
const _redirectUri  = String.fromEnvironment('OIDC_REDIRECT_URI', defaultValue: 'treasurehunt://oauth/callback');
const _scopes       = ['openid', 'profile', 'email', 'offline_access'];

const _accessTokenKey  = 'access_token';
const _refreshTokenKey = 'refresh_token';

class AuthService {
  static final _appAuth  = FlutterAppAuth();
  static final _storage  = FlutterSecureStorage();

  // ── Login (PKCE code flow) ─────────────────────────────────

  static Future<String> login() async {
    final result = await _appAuth.authorizeAndExchangeCode(
      AuthorizationTokenRequest(
        _clientId,
        _redirectUri,
        issuer:             _issuer,
        scopes:             _scopes,
        preferEphemeralSession: false,
      ),
    );

    await _storage.write(key: _accessTokenKey,  value: result.accessToken);
    await _storage.write(key: _refreshTokenKey, value: result.refreshToken);

    return result.accessToken!;
  }

  // ── Silent refresh ─────────────────────────────────────────

  static Future<String?> refresh() async {
    final refreshToken = await _storage.read(key: _refreshTokenKey);
    if (refreshToken == null) return null;

    try {
      final result = await _appAuth.token(
        TokenRequest(
          _clientId,
          _redirectUri,
          issuer:       _issuer,
          refreshToken: refreshToken,
          scopes:       _scopes,
        ),
      );
      await _storage.write(key: _accessTokenKey,  value: result.accessToken);
      await _storage.write(key: _refreshTokenKey, value: result.refreshToken);
      return result.accessToken;
    } catch (_) {
      await logout();
      return null;
    }
  }

  // ── Token accessors ───────────────────────────────────────

  static Future<String?> accessToken() => _storage.read(key: _accessTokenKey);

  static Future<bool> isLoggedIn() async => (await accessToken()) != null;

  // ── Logout ────────────────────────────────────────────────

  static Future<void> logout() async {
    await _storage.delete(key: _accessTokenKey);
    await _storage.delete(key: _refreshTokenKey);
  }
}
