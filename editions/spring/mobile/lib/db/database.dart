import 'dart:io';
import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';

part 'database.g.dart';

// ── Tables ────────────────────────────────────────────────────

/// Cached active sessions — survives app restart.
class CachedSessions extends Table {
  TextColumn get id          => text()();
  TextColumn get huntId      => text()();
  TextColumn get status      => text().withDefault(const Constant('active'))();
  DateTimeColumn get startedAt => dateTime()();

  @override
  Set<Column> get primaryKey => {id};
}

/// Current clue for each session — allows offline display if connectivity drops.
class CachedClues extends Table {
  TextColumn get sessionId  => text()();
  TextColumn get clueId     => text()();
  IntColumn  get sequence   => integer()();
  TextColumn get title      => text()();
  TextColumn get body       => text()();
  TextColumn get answerType => text()();
  TextColumn get mediaUrl   => text().nullable()();
  DateTimeColumn get cachedAt => dateTime()();

  @override
  Set<Column> get primaryKey => {sessionId};
}

/// Hints unlocked during a session — so they persist if the app is backgrounded.
class CachedHints extends Table {
  IntColumn  get id         => integer().autoIncrement()();
  TextColumn get sessionId  => text()();
  TextColumn get clueId     => text()();
  IntColumn  get sequence   => integer()();
  TextColumn get body       => text()();

  @override
  List<Set<Column>> get uniqueKeys => [
    {sessionId, clueId, sequence},
  ];
}

/// Pending answer submissions (queued when offline, flushed on reconnect).
class PendingAnswers extends Table {
  IntColumn  get id        => integer().autoIncrement()();
  TextColumn get sessionId => text()();
  TextColumn get value     => text()();
  RealColumn get lat       => real().nullable()();
  RealColumn get lon       => real().nullable()();
  TextColumn get photoB64  => text().nullable()();
  DateTimeColumn get queuedAt => dateTime()();
}

// ── Database ──────────────────────────────────────────────────

@DriftDatabase(tables: [CachedSessions, CachedClues, CachedHints, PendingAnswers])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  // ── Session helpers ───────────────────────────────────────

  Future<void> upsertSession(CachedSessionsCompanion row) =>
      into(cachedSessions).insertOnConflictUpdate(row);

  Future<CachedSession?> getSession(String id) =>
      (select(cachedSessions)..where((t) => t.id.equals(id))).getSingleOrNull();

  // ── Clue helpers ──────────────────────────────────────────

  Future<void> upsertClue(CachedCluesCompanion row) =>
      into(cachedClues).insertOnConflictUpdate(row);

  Future<CachedClue?> getClue(String sessionId) =>
      (select(cachedClues)..where((t) => t.sessionId.equals(sessionId))).getSingleOrNull();

  // ── Hint helpers ──────────────────────────────────────────

  Future<void> saveHint(CachedHintsCompanion row) =>
      into(cachedHints).insertOnConflictUpdate(row);

  Future<List<CachedHint>> getHints(String sessionId, String clueId) =>
      (select(cachedHints)
        ..where((t) => t.sessionId.equals(sessionId) & t.clueId.equals(clueId))
        ..orderBy([(t) => OrderingTerm.asc(t.sequence)]))
          .get();

  // ── Pending answer helpers ────────────────────────────────

  Future<int> queueAnswer(PendingAnswersCompanion row) =>
      into(pendingAnswers).insert(row);

  Future<List<PendingAnswer>> getPendingAnswers() =>
      (select(pendingAnswers)..orderBy([(t) => OrderingTerm.asc(t.queuedAt)])).get();

  Future<void> deletePendingAnswer(int id) =>
      (delete(pendingAnswers)..where((t) => t.id.equals(id))).go();
}

// ── Connection ────────────────────────────────────────────────

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dir  = await getApplicationDocumentsDirectory();
    final file = File(p.join(dir.path, 'treasure_hunt.db'));
    return NativeDatabase.createInBackground(file);
  });
}

// ── Provider ──────────────────────────────────────────────────

final dbProvider = Provider<AppDatabase>((_) => AppDatabase());
