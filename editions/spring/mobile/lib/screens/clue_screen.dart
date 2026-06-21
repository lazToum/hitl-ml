import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

import '../services/api_service.dart';
import '../services/location_service.dart';
import 'scan_screen.dart';

class ClueScreen extends ConsumerStatefulWidget {
  final String sessionId;
  const ClueScreen({super.key, required this.sessionId});

  @override
  ConsumerState<ClueScreen> createState() => _ClueScreenState();
}

class _ClueScreenState extends ConsumerState<ClueScreen> {
  Map<String, dynamic>? _clue;
  bool _loading = true;
  bool _submitting = false;
  String? _feedback;
  String? _photoB64;
  final _answerCtrl  = TextEditingController();
  final _imagePicker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _loadClue();
  }

  Future<void> _loadClue() async {
    try {
      final data = await ref.read(apiProvider).getCurrentClue(widget.sessionId);
      setState(() { _clue = data['clue']; _loading = false; });
    } catch (e) {
      setState(() { _feedback = 'Could not load clue.'; _loading = false; });
    }
  }

  Future<void> _submit() async {
    if (_submitting) return;
    final clue = _clue;
    if (clue == null) return;

    setState(() { _submitting = true; _feedback = null; });

    try {
      double? lat, lon;
      if (clue['answer_type'] == 'gps') {
        final pos = await LocationService.current();
        lat = pos?.latitude;
        lon = pos?.longitude;
      }

      final result = await ref.read(apiProvider).submitAnswer(
        widget.sessionId,
        value:    _answerCtrl.text.trim(),
        lat:      lat,
        lon:      lon,
        photoB64: _photoB64,
      );

      if (result['hunt_complete'] == true) {
        if (mounted) context.go('/complete');
        return;
      }

      if (result['passed'] == true) {
        await _loadClue();
        _answerCtrl.clear();
      }

      setState(() { _feedback = result['feedback'] as String?; });
    } catch (e) {
      setState(() { _feedback = 'Submission failed. Please try again.'; });
    } finally {
      setState(() { _submitting = false; });
    }
  }

  Future<void> _requestHint() async {
    final result = await ref.read(apiProvider).requestHint(widget.sessionId);
    final hint = result['hint'];
    if (hint != null && mounted) {
      showDialog(
        context: context,
        builder: (_) => AlertDialog(
          title: const Text('Hint'),
          content: Text(hint['body'] as String),
          actions: [TextButton(onPressed: () => Navigator.pop(context), child: const Text('Got it'))],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Scaffold(body: Center(child: CircularProgressIndicator()));

    final clue = _clue;
    final answerType = clue?['answer_type'] as String? ?? 'text';

    return Scaffold(
      appBar: AppBar(title: Text(clue?['title'] as String? ?? 'Clue')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(clue?['body'] as String? ?? '', style: Theme.of(context).textTheme.bodyLarge),
            const SizedBox(height: 24),

            if (answerType == 'text') ...[
              TextField(
                controller: _answerCtrl,
                decoration: const InputDecoration(labelText: 'Your answer', border: OutlineInputBorder()),
                onSubmitted: (_) => _submit(),
              ),
              const SizedBox(height: 12),
              ElevatedButton(onPressed: _submit, child: Text(_submitting ? 'Checking…' : 'Submit')),
            ],

            if (answerType == 'qr' || answerType == 'nfc')
              ElevatedButton.icon(
                icon: const Icon(Icons.qr_code_scanner),
                label: const Text('Scan QR / Tap NFC'),
                onPressed: () async {
                  final token = await Navigator.push<String>(
                    context,
                    MaterialPageRoute(builder: (_) => const ScanScreen()),
                  );
                  if (token != null) {
                    _answerCtrl.text = token;
                    await _submit();
                  }
                },
              ),

            if (answerType == 'gps')
              ElevatedButton.icon(
                icon: const Icon(Icons.location_on),
                label: Text(_submitting ? 'Checking location…' : 'I am here!'),
                onPressed: _submit,
              ),

            if (answerType == 'photo') ...[
              if (_photoB64 != null) ...[
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.memory(
                    base64Decode(_photoB64!),
                    height: 180,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                ),
                TextButton(
                  onPressed: () => setState(() => _photoB64 = null),
                  child: const Text('Remove photo'),
                ),
              ] else
                OutlinedButton.icon(
                  icon: const Icon(Icons.camera_alt),
                  label: const Text('Take photo'),
                  onPressed: _pickPhoto,
                ),
              const SizedBox(height: 12),
              ElevatedButton(
                onPressed: _photoB64 != null && !_submitting ? _submit : null,
                child: Text(_submitting ? 'Verifying…' : 'Submit photo'),
              ),
            ],

            if (_feedback != null) ...[
              const SizedBox(height: 16),
              Text(_feedback!, style: TextStyle(
                color: _feedback!.startsWith('Correct') ? Colors.green : Colors.red,
                fontWeight: FontWeight.bold,
              )),
            ],

            const Spacer(),
            TextButton.icon(
              icon: const Icon(Icons.lightbulb_outline),
              label: const Text('Request a hint'),
              onPressed: _requestHint,
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _pickPhoto() async {
    final xfile = await _imagePicker.pickImage(
      source:     ImageSource.camera,
      imageQuality: 70,
      maxWidth:   1280,
    );
    if (xfile == null) return;
    final bytes = await xfile.readAsBytes();
    setState(() => _photoB64 = base64Encode(bytes));
  }

  @override
  void dispose() {
    _answerCtrl.dispose();
    super.dispose();
  }
}
