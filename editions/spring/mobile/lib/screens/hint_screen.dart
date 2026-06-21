import 'package:flutter/material.dart';

class HintScreen extends StatelessWidget {
  final String sessionId;
  const HintScreen({super.key, required this.sessionId});

  @override
  Widget build(BuildContext context) {
    // Hints are delivered inline on ClueScreen via dialog.
    // This route exists as a deep-link target for push notifications.
    return Scaffold(
      appBar: AppBar(title: const Text('Hint')),
      body: const Center(child: Text('Return to the clue screen to see your hints.')),
    );
  }
}
