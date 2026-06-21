import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

const _baseUrl = String.fromEnvironment('API_URL', defaultValue: 'http://localhost:8080');

final apiProvider = Provider<ApiService>((_) => ApiService());

class ApiService {
  final Dio _dio;

  ApiService()
      : _dio = Dio(BaseOptions(
          baseUrl:        _baseUrl,
          connectTimeout: const Duration(seconds: 10),
          receiveTimeout: const Duration(seconds: 15),
        ));

  void setToken(String token) {
    _dio.options.headers['Authorization'] = 'Bearer $token';
  }

  // ── Sessions ──────────────────────────────────────────────

  Future<Map<String, dynamic>> startSession(String huntId, {String? teamId}) async {
    final r = await _dio.post<Map<String, dynamic>>('/sessions', data: {
      'hunt_id': huntId,
      if (teamId != null) 'team_id': teamId,
    });
    return r.data!;
  }

  Future<Map<String, dynamic>> getCurrentClue(String sessionId) async {
    final r = await _dio.get<Map<String, dynamic>>('/sessions/$sessionId/clue');
    return r.data!;
  }

  Future<Map<String, dynamic>> submitAnswer(
    String sessionId, {
    required String value,
    double? lat,
    double? lon,
    String? photoB64,
  }) async {
    final r = await _dio.post<Map<String, dynamic>>(
      '/sessions/$sessionId/answer',
      data: {
        'value': value,
        if (lat != null) 'lat': lat,
        if (lon != null) 'lon': lon,
        if (photoB64 != null) 'photo_b64': photoB64,
      },
    );
    return r.data!;
  }

  Future<Map<String, dynamic>> requestHint(String sessionId) async {
    final r = await _dio.post<Map<String, dynamic>>('/sessions/$sessionId/hint');
    return r.data!;
  }

  Future<Map<String, dynamic>> resolveScan(
    String token, {
    String? sessionId,
    String source = 'qr',
  }) async {
    final r = await _dio.get<Map<String, dynamic>>(
      '/scan/$token',
      queryParameters: {
        if (sessionId != null) 'session_id': sessionId,
        'source': source,
      },
    );
    return r.data!;
  }
}
