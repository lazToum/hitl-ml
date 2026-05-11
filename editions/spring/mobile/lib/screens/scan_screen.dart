import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

import '../services/nfc_service.dart';

/// Unified QR + NFC scanner. Returns the raw token string via Navigator.pop().
class ScanScreen extends StatefulWidget {
  const ScanScreen({super.key});

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> {
  bool _scanning = true;

  @override
  void initState() {
    super.initState();
    _tryNfc();
  }

  Future<void> _tryNfc() async {
    final url = await NfcService.readTag();
    if (url != null && mounted) {
      final token = NfcService.tokenFromUrl(url);
      if (token != null) _done(token);
    }
  }

  void _done(String token) {
    if (!_scanning) return;
    setState(() { _scanning = false; });
    Navigator.pop(context, token);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Scan QR or tap NFC')),
      body: Stack(
        children: [
          MobileScanner(
            onDetect: (capture) {
              final barcode = capture.barcodes.firstOrNull;
              final url = barcode?.rawValue;
              if (url == null) return;
              final token = NfcService.tokenFromUrl(url);
              if (token != null) _done(token);
            },
          ),
          Positioned(
            bottom: 32,
            left: 0,
            right: 0,
            child: Center(
              child: Text(
                'Point at QR code — or tap an NFC tag',
                style: TextStyle(color: Colors.white, shadows: [Shadow(blurRadius: 4, color: Colors.black)]),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
