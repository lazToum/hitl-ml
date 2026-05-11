import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../services/api_service.dart';
import '../services/auth_service.dart';

// Decode the "name" or "email" claim from a JWT without a library
String? _jwtClaim(String token, String key) {
  try {
    final parts = token.split('.');
    if (parts.length < 2) return null;
    final payload = utf8.decode(
      base64Url.decode(base64Url.normalize(parts[1])),
    );
    final map = jsonDecode(payload) as Map<String, dynamic>;
    return map[key]?.toString();
  } catch (_) {
    return null;
  }
}

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  final _huntCtrl = TextEditingController();
  bool    _loading     = false;
  bool    _loggedIn    = false;
  String? _displayName;
  String? _error;

  static const _primary     = Color(0xFF2B3A8F);
  static const _teal        = Color(0xFF0D9E8E);
  static const _primaryDark = Color(0xFF1a2560);

  @override
  void initState() {
    super.initState();
    _restoreSession();
  }

  Future<void> _restoreSession() async {
    final token = await AuthService.accessToken();
    if (token != null) {
      ref.read(apiProvider).setToken(token);
      _setLoggedIn(token);
    }
  }

  void _setLoggedIn(String token) {
    final name  = _jwtClaim(token, 'name')
                ?? _jwtClaim(token, 'email')
                ?? 'Player';
    setState(() {
      _loggedIn    = true;
      _displayName = name;
    });
  }

  Future<void> _login() async {
    setState(() { _loading = true; _error = null; });
    try {
      final token = await AuthService.login();
      ref.read(apiProvider).setToken(token);
      _setLoggedIn(token);
    } catch (e) {
      setState(() { _error = 'Login failed — make sure Zitadel is running at localhost:8180 and the mobile OIDC client ID is configured.'; });
    } finally {
      setState(() { _loading = false; });
    }
  }

  Future<void> _logout() async {
    await AuthService.logout();
    setState(() { _loggedIn = false; _displayName = null; _error = null; });
  }

  Future<void> _joinHunt() async {
    final huntId = _huntCtrl.text.trim();
    if (huntId.isEmpty) {
      setState(() { _error = 'Paste or type a hunt ID.'; });
      return;
    }

    // Ensure fresh token
    String? token = await AuthService.accessToken();
    if (token == null) {
      token = await AuthService.refresh();
      if (token == null) { await _login(); return; }
    }
    ref.read(apiProvider).setToken(token);

    setState(() { _loading = true; _error = null; });
    try {
      final session   = await ref.read(apiProvider).startSession(huntId);
      final sessionId = session['session']['id'] as String;
      if (mounted) context.go('/clue?session=$sessionId');
    } catch (e) {
      final fresh = await AuthService.refresh();
      if (fresh != null) {
        ref.read(apiProvider).setToken(fresh);
        try {
          final session   = await ref.read(apiProvider).startSession(huntId);
          final sessionId = session['session']['id'] as String;
          if (mounted) context.go('/clue?session=$sessionId');
          return;
        } catch (_) {}
      }
      setState(() { _error = 'Could not join hunt. Check the ID and try again.'; });
    } finally {
      if (mounted) setState(() { _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [_primaryDark, _primary, Color(0xFF1e4a8a)],
          ),
        ),
        child: SafeArea(
          child: _loggedIn ? _buildMain() : _buildLogin(),
        ),
      ),
    );
  }

  // ── Login screen ──────────────────────────────────────────────
  Widget _buildLogin() {
    return Center(
      child: Container(
        width: 360,
        padding: const EdgeInsets.all(36),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.25), blurRadius: 40, offset: const Offset(0, 12))],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('🗺', style: TextStyle(fontSize: 48)),
            const SizedBox(height: 12),
            const Text(
              'Treasure Hunt',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: _primary),
            ),
            const SizedBox(height: 6),
            const Text(
              'Sign in to start playing',
              style: TextStyle(fontSize: 14, color: Colors.black54),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: _loading ? null : _login,
                style: ElevatedButton.styleFrom(
                  backgroundColor: _primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                child: _loading
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : const Text('Sign in', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
              ),
            ),
            if (_error != null) ...[
              const SizedBox(height: 14),
              Text(_error!, style: const TextStyle(color: Colors.red, fontSize: 13), textAlign: TextAlign.center),
            ],
          ],
        ),
      ),
    );
  }

  // ── Main screen (logged in) ───────────────────────────────────
  Widget _buildMain() {
    return Column(
      children: [
        // Header bar
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Row(
            children: [
              const Text('🗺', style: TextStyle(fontSize: 24)),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Treasure Hunt', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                    Text(_displayName ?? '', style: const TextStyle(color: Colors.white60, fontSize: 12)),
                  ],
                ),
              ),
              TextButton(
                onPressed: _logout,
                child: const Text('Sign out', style: TextStyle(color: Colors.white54, fontSize: 12)),
              ),
            ],
          ),
        ),

        // Card
        Expanded(
          child: Center(
            child: Container(
              width: 360,
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.25), blurRadius: 40, offset: const Offset(0, 12))],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text('Join a Hunt', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: _primary)),
                  const SizedBox(height: 6),
                  const Text(
                    'Enter the Hunt ID shared by the creator, or scan a QR code.',
                    style: TextStyle(fontSize: 13, color: Colors.black54),
                  ),
                  const SizedBox(height: 24),
                  TextField(
                    controller: _huntCtrl,
                    decoration: InputDecoration(
                      labelText: 'Hunt ID',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: const BorderSide(color: _primary, width: 2),
                      ),
                      prefixIcon: const Icon(Icons.search, color: Colors.black38),
                    ),
                    onSubmitted: (_) => _joinHunt(),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    height: 48,
                    child: ElevatedButton(
                      onPressed: _loading ? null : _joinHunt,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _teal,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      child: _loading
                          ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                          : const Text('Join Hunt', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
                    ),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: _loading ? null : () => context.go('/scan'),
                    icon: const Icon(Icons.qr_code_scanner, size: 18),
                    label: const Text('Scan QR code'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: _primary,
                      side: const BorderSide(color: _primary),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                  if (_error != null) ...[
                    const SizedBox(height: 14),
                    Text(_error!, style: const TextStyle(color: Colors.red, fontSize: 13), textAlign: TextAlign.center),
                  ],
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  @override
  void dispose() {
    _huntCtrl.dispose();
    super.dispose();
  }
}
