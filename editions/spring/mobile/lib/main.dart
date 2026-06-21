import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'screens/home_screen.dart';
import 'screens/clue_screen.dart';
import 'screens/scan_screen.dart';
import 'screens/hint_screen.dart';
import 'screens/complete_screen.dart';

void main() {
  runApp(const ProviderScope(child: TreasureHuntApp()));
}

final _router = GoRouter(
  routes: [
    GoRoute(path: '/',          builder: (_, __) => const HomeScreen()),
    GoRoute(path: '/clue',      builder: (_, s)  => ClueScreen(sessionId: s.uri.queryParameters['session'] ?? '')),
    GoRoute(path: '/scan',      builder: (_, __)  => const ScanScreen()),
    GoRoute(path: '/hint',      builder: (_, s)  => HintScreen(sessionId: s.uri.queryParameters['session'] ?? '')),
    GoRoute(path: '/complete',  builder: (_, __)  => const CompleteScreen()),
  ],
);

class TreasureHuntApp extends StatelessWidget {
  const TreasureHuntApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title:         'Treasure Hunt',
      routerConfig:  _router,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2B6CB0)),
        useMaterial3: true,
      ),
    );
  }
}
