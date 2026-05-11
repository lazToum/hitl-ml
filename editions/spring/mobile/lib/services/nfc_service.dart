import 'dart:convert';
import 'package:flutter_nfc_kit/flutter_nfc_kit.dart';

class NfcService {
  /// Returns the URL encoded in the NFC tag, or null if unsupported / failed.
  /// The URL format is: https://host/scan/{token}
  static Future<String?> readTag() async {
    try {
      final avail = await FlutterNfcKit.nfcAvailability;
      if (avail != NFCAvailability.available) return null;

      final tag = await FlutterNfcKit.poll(
        timeout: const Duration(seconds: 15),
        iosMultipleTagMessage: 'Multiple tags found!',
        iosAlertMessage: 'Hold your phone near the tag',
      );

      // Read NDEF records
      final records = await FlutterNfcKit.readNDEFRecords();
      await FlutterNfcKit.finish(iosAlertMessage: 'Tag read!');

      for (final r in records) {
        if (r.payload == null) continue;
        // NDEF URI records prefix the payload with a 1-byte identifier code;
        // skip that byte (0x04 = "https://") and decode the rest as UTF-8.
        final bytes = r.payload!;
        final text = bytes.isNotEmpty
            ? utf8.decode(bytes.sublist(bytes[0] < 0x20 ? 1 : 0), allowMalformed: true)
            : '';
        if (text.startsWith('https')) return text;
      }
      return null;
    } catch (_) {
      await FlutterNfcKit.finish(iosErrorMessage: 'Read failed').catchError((_) {});
      return null;
    }
  }

  /// Extracts the clue token from a /scan/{token} URL.
  static String? tokenFromUrl(String url) {
    final uri = Uri.tryParse(url);
    if (uri == null) return null;
    final segments = uri.pathSegments;
    final idx = segments.indexOf('scan');
    if (idx >= 0 && idx + 1 < segments.length) {
      return segments[idx + 1];
    }
    return null;
  }
}
