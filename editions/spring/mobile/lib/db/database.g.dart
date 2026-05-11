// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'database.dart';

// ignore_for_file: type=lint
class $CachedSessionsTable extends CachedSessions
    with TableInfo<$CachedSessionsTable, CachedSession> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $CachedSessionsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _huntIdMeta = const VerificationMeta('huntId');
  @override
  late final GeneratedColumn<String> huntId = GeneratedColumn<String>(
      'hunt_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _statusMeta = const VerificationMeta('status');
  @override
  late final GeneratedColumn<String> status = GeneratedColumn<String>(
      'status', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: false,
      defaultValue: const Constant('active'));
  static const VerificationMeta _startedAtMeta =
      const VerificationMeta('startedAt');
  @override
  late final GeneratedColumn<DateTime> startedAt = GeneratedColumn<DateTime>(
      'started_at', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  @override
  List<GeneratedColumn> get $columns => [id, huntId, status, startedAt];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'cached_sessions';
  @override
  VerificationContext validateIntegrity(Insertable<CachedSession> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('hunt_id')) {
      context.handle(_huntIdMeta,
          huntId.isAcceptableOrUnknown(data['hunt_id']!, _huntIdMeta));
    } else if (isInserting) {
      context.missing(_huntIdMeta);
    }
    if (data.containsKey('status')) {
      context.handle(_statusMeta,
          status.isAcceptableOrUnknown(data['status']!, _statusMeta));
    }
    if (data.containsKey('started_at')) {
      context.handle(_startedAtMeta,
          startedAt.isAcceptableOrUnknown(data['started_at']!, _startedAtMeta));
    } else if (isInserting) {
      context.missing(_startedAtMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  CachedSession map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return CachedSession(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      huntId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}hunt_id'])!,
      status: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}status'])!,
      startedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}started_at'])!,
    );
  }

  @override
  $CachedSessionsTable createAlias(String alias) {
    return $CachedSessionsTable(attachedDatabase, alias);
  }
}

class CachedSession extends DataClass implements Insertable<CachedSession> {
  final String id;
  final String huntId;
  final String status;
  final DateTime startedAt;
  const CachedSession(
      {required this.id,
      required this.huntId,
      required this.status,
      required this.startedAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['hunt_id'] = Variable<String>(huntId);
    map['status'] = Variable<String>(status);
    map['started_at'] = Variable<DateTime>(startedAt);
    return map;
  }

  CachedSessionsCompanion toCompanion(bool nullToAbsent) {
    return CachedSessionsCompanion(
      id: Value(id),
      huntId: Value(huntId),
      status: Value(status),
      startedAt: Value(startedAt),
    );
  }

  factory CachedSession.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return CachedSession(
      id: serializer.fromJson<String>(json['id']),
      huntId: serializer.fromJson<String>(json['huntId']),
      status: serializer.fromJson<String>(json['status']),
      startedAt: serializer.fromJson<DateTime>(json['startedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'huntId': serializer.toJson<String>(huntId),
      'status': serializer.toJson<String>(status),
      'startedAt': serializer.toJson<DateTime>(startedAt),
    };
  }

  CachedSession copyWith(
          {String? id, String? huntId, String? status, DateTime? startedAt}) =>
      CachedSession(
        id: id ?? this.id,
        huntId: huntId ?? this.huntId,
        status: status ?? this.status,
        startedAt: startedAt ?? this.startedAt,
      );
  CachedSession copyWithCompanion(CachedSessionsCompanion data) {
    return CachedSession(
      id: data.id.present ? data.id.value : this.id,
      huntId: data.huntId.present ? data.huntId.value : this.huntId,
      status: data.status.present ? data.status.value : this.status,
      startedAt: data.startedAt.present ? data.startedAt.value : this.startedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('CachedSession(')
          ..write('id: $id, ')
          ..write('huntId: $huntId, ')
          ..write('status: $status, ')
          ..write('startedAt: $startedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, huntId, status, startedAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is CachedSession &&
          other.id == this.id &&
          other.huntId == this.huntId &&
          other.status == this.status &&
          other.startedAt == this.startedAt);
}

class CachedSessionsCompanion extends UpdateCompanion<CachedSession> {
  final Value<String> id;
  final Value<String> huntId;
  final Value<String> status;
  final Value<DateTime> startedAt;
  final Value<int> rowid;
  const CachedSessionsCompanion({
    this.id = const Value.absent(),
    this.huntId = const Value.absent(),
    this.status = const Value.absent(),
    this.startedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  CachedSessionsCompanion.insert({
    required String id,
    required String huntId,
    this.status = const Value.absent(),
    required DateTime startedAt,
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        huntId = Value(huntId),
        startedAt = Value(startedAt);
  static Insertable<CachedSession> custom({
    Expression<String>? id,
    Expression<String>? huntId,
    Expression<String>? status,
    Expression<DateTime>? startedAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (huntId != null) 'hunt_id': huntId,
      if (status != null) 'status': status,
      if (startedAt != null) 'started_at': startedAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  CachedSessionsCompanion copyWith(
      {Value<String>? id,
      Value<String>? huntId,
      Value<String>? status,
      Value<DateTime>? startedAt,
      Value<int>? rowid}) {
    return CachedSessionsCompanion(
      id: id ?? this.id,
      huntId: huntId ?? this.huntId,
      status: status ?? this.status,
      startedAt: startedAt ?? this.startedAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (huntId.present) {
      map['hunt_id'] = Variable<String>(huntId.value);
    }
    if (status.present) {
      map['status'] = Variable<String>(status.value);
    }
    if (startedAt.present) {
      map['started_at'] = Variable<DateTime>(startedAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('CachedSessionsCompanion(')
          ..write('id: $id, ')
          ..write('huntId: $huntId, ')
          ..write('status: $status, ')
          ..write('startedAt: $startedAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $CachedCluesTable extends CachedClues
    with TableInfo<$CachedCluesTable, CachedClue> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $CachedCluesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _sessionIdMeta =
      const VerificationMeta('sessionId');
  @override
  late final GeneratedColumn<String> sessionId = GeneratedColumn<String>(
      'session_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _clueIdMeta = const VerificationMeta('clueId');
  @override
  late final GeneratedColumn<String> clueId = GeneratedColumn<String>(
      'clue_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _sequenceMeta =
      const VerificationMeta('sequence');
  @override
  late final GeneratedColumn<int> sequence = GeneratedColumn<int>(
      'sequence', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  static const VerificationMeta _titleMeta = const VerificationMeta('title');
  @override
  late final GeneratedColumn<String> title = GeneratedColumn<String>(
      'title', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _bodyMeta = const VerificationMeta('body');
  @override
  late final GeneratedColumn<String> body = GeneratedColumn<String>(
      'body', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _answerTypeMeta =
      const VerificationMeta('answerType');
  @override
  late final GeneratedColumn<String> answerType = GeneratedColumn<String>(
      'answer_type', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _mediaUrlMeta =
      const VerificationMeta('mediaUrl');
  @override
  late final GeneratedColumn<String> mediaUrl = GeneratedColumn<String>(
      'media_url', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _cachedAtMeta =
      const VerificationMeta('cachedAt');
  @override
  late final GeneratedColumn<DateTime> cachedAt = GeneratedColumn<DateTime>(
      'cached_at', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  @override
  List<GeneratedColumn> get $columns => [
        sessionId,
        clueId,
        sequence,
        title,
        body,
        answerType,
        mediaUrl,
        cachedAt
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'cached_clues';
  @override
  VerificationContext validateIntegrity(Insertable<CachedClue> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('session_id')) {
      context.handle(_sessionIdMeta,
          sessionId.isAcceptableOrUnknown(data['session_id']!, _sessionIdMeta));
    } else if (isInserting) {
      context.missing(_sessionIdMeta);
    }
    if (data.containsKey('clue_id')) {
      context.handle(_clueIdMeta,
          clueId.isAcceptableOrUnknown(data['clue_id']!, _clueIdMeta));
    } else if (isInserting) {
      context.missing(_clueIdMeta);
    }
    if (data.containsKey('sequence')) {
      context.handle(_sequenceMeta,
          sequence.isAcceptableOrUnknown(data['sequence']!, _sequenceMeta));
    } else if (isInserting) {
      context.missing(_sequenceMeta);
    }
    if (data.containsKey('title')) {
      context.handle(
          _titleMeta, title.isAcceptableOrUnknown(data['title']!, _titleMeta));
    } else if (isInserting) {
      context.missing(_titleMeta);
    }
    if (data.containsKey('body')) {
      context.handle(
          _bodyMeta, body.isAcceptableOrUnknown(data['body']!, _bodyMeta));
    } else if (isInserting) {
      context.missing(_bodyMeta);
    }
    if (data.containsKey('answer_type')) {
      context.handle(
          _answerTypeMeta,
          answerType.isAcceptableOrUnknown(
              data['answer_type']!, _answerTypeMeta));
    } else if (isInserting) {
      context.missing(_answerTypeMeta);
    }
    if (data.containsKey('media_url')) {
      context.handle(_mediaUrlMeta,
          mediaUrl.isAcceptableOrUnknown(data['media_url']!, _mediaUrlMeta));
    }
    if (data.containsKey('cached_at')) {
      context.handle(_cachedAtMeta,
          cachedAt.isAcceptableOrUnknown(data['cached_at']!, _cachedAtMeta));
    } else if (isInserting) {
      context.missing(_cachedAtMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {sessionId};
  @override
  CachedClue map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return CachedClue(
      sessionId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}session_id'])!,
      clueId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}clue_id'])!,
      sequence: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sequence'])!,
      title: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}title'])!,
      body: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}body'])!,
      answerType: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}answer_type'])!,
      mediaUrl: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}media_url']),
      cachedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}cached_at'])!,
    );
  }

  @override
  $CachedCluesTable createAlias(String alias) {
    return $CachedCluesTable(attachedDatabase, alias);
  }
}

class CachedClue extends DataClass implements Insertable<CachedClue> {
  final String sessionId;
  final String clueId;
  final int sequence;
  final String title;
  final String body;
  final String answerType;
  final String? mediaUrl;
  final DateTime cachedAt;
  const CachedClue(
      {required this.sessionId,
      required this.clueId,
      required this.sequence,
      required this.title,
      required this.body,
      required this.answerType,
      this.mediaUrl,
      required this.cachedAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['session_id'] = Variable<String>(sessionId);
    map['clue_id'] = Variable<String>(clueId);
    map['sequence'] = Variable<int>(sequence);
    map['title'] = Variable<String>(title);
    map['body'] = Variable<String>(body);
    map['answer_type'] = Variable<String>(answerType);
    if (!nullToAbsent || mediaUrl != null) {
      map['media_url'] = Variable<String>(mediaUrl);
    }
    map['cached_at'] = Variable<DateTime>(cachedAt);
    return map;
  }

  CachedCluesCompanion toCompanion(bool nullToAbsent) {
    return CachedCluesCompanion(
      sessionId: Value(sessionId),
      clueId: Value(clueId),
      sequence: Value(sequence),
      title: Value(title),
      body: Value(body),
      answerType: Value(answerType),
      mediaUrl: mediaUrl == null && nullToAbsent
          ? const Value.absent()
          : Value(mediaUrl),
      cachedAt: Value(cachedAt),
    );
  }

  factory CachedClue.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return CachedClue(
      sessionId: serializer.fromJson<String>(json['sessionId']),
      clueId: serializer.fromJson<String>(json['clueId']),
      sequence: serializer.fromJson<int>(json['sequence']),
      title: serializer.fromJson<String>(json['title']),
      body: serializer.fromJson<String>(json['body']),
      answerType: serializer.fromJson<String>(json['answerType']),
      mediaUrl: serializer.fromJson<String?>(json['mediaUrl']),
      cachedAt: serializer.fromJson<DateTime>(json['cachedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'sessionId': serializer.toJson<String>(sessionId),
      'clueId': serializer.toJson<String>(clueId),
      'sequence': serializer.toJson<int>(sequence),
      'title': serializer.toJson<String>(title),
      'body': serializer.toJson<String>(body),
      'answerType': serializer.toJson<String>(answerType),
      'mediaUrl': serializer.toJson<String?>(mediaUrl),
      'cachedAt': serializer.toJson<DateTime>(cachedAt),
    };
  }

  CachedClue copyWith(
          {String? sessionId,
          String? clueId,
          int? sequence,
          String? title,
          String? body,
          String? answerType,
          Value<String?> mediaUrl = const Value.absent(),
          DateTime? cachedAt}) =>
      CachedClue(
        sessionId: sessionId ?? this.sessionId,
        clueId: clueId ?? this.clueId,
        sequence: sequence ?? this.sequence,
        title: title ?? this.title,
        body: body ?? this.body,
        answerType: answerType ?? this.answerType,
        mediaUrl: mediaUrl.present ? mediaUrl.value : this.mediaUrl,
        cachedAt: cachedAt ?? this.cachedAt,
      );
  CachedClue copyWithCompanion(CachedCluesCompanion data) {
    return CachedClue(
      sessionId: data.sessionId.present ? data.sessionId.value : this.sessionId,
      clueId: data.clueId.present ? data.clueId.value : this.clueId,
      sequence: data.sequence.present ? data.sequence.value : this.sequence,
      title: data.title.present ? data.title.value : this.title,
      body: data.body.present ? data.body.value : this.body,
      answerType:
          data.answerType.present ? data.answerType.value : this.answerType,
      mediaUrl: data.mediaUrl.present ? data.mediaUrl.value : this.mediaUrl,
      cachedAt: data.cachedAt.present ? data.cachedAt.value : this.cachedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('CachedClue(')
          ..write('sessionId: $sessionId, ')
          ..write('clueId: $clueId, ')
          ..write('sequence: $sequence, ')
          ..write('title: $title, ')
          ..write('body: $body, ')
          ..write('answerType: $answerType, ')
          ..write('mediaUrl: $mediaUrl, ')
          ..write('cachedAt: $cachedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      sessionId, clueId, sequence, title, body, answerType, mediaUrl, cachedAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is CachedClue &&
          other.sessionId == this.sessionId &&
          other.clueId == this.clueId &&
          other.sequence == this.sequence &&
          other.title == this.title &&
          other.body == this.body &&
          other.answerType == this.answerType &&
          other.mediaUrl == this.mediaUrl &&
          other.cachedAt == this.cachedAt);
}

class CachedCluesCompanion extends UpdateCompanion<CachedClue> {
  final Value<String> sessionId;
  final Value<String> clueId;
  final Value<int> sequence;
  final Value<String> title;
  final Value<String> body;
  final Value<String> answerType;
  final Value<String?> mediaUrl;
  final Value<DateTime> cachedAt;
  final Value<int> rowid;
  const CachedCluesCompanion({
    this.sessionId = const Value.absent(),
    this.clueId = const Value.absent(),
    this.sequence = const Value.absent(),
    this.title = const Value.absent(),
    this.body = const Value.absent(),
    this.answerType = const Value.absent(),
    this.mediaUrl = const Value.absent(),
    this.cachedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  CachedCluesCompanion.insert({
    required String sessionId,
    required String clueId,
    required int sequence,
    required String title,
    required String body,
    required String answerType,
    this.mediaUrl = const Value.absent(),
    required DateTime cachedAt,
    this.rowid = const Value.absent(),
  })  : sessionId = Value(sessionId),
        clueId = Value(clueId),
        sequence = Value(sequence),
        title = Value(title),
        body = Value(body),
        answerType = Value(answerType),
        cachedAt = Value(cachedAt);
  static Insertable<CachedClue> custom({
    Expression<String>? sessionId,
    Expression<String>? clueId,
    Expression<int>? sequence,
    Expression<String>? title,
    Expression<String>? body,
    Expression<String>? answerType,
    Expression<String>? mediaUrl,
    Expression<DateTime>? cachedAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (sessionId != null) 'session_id': sessionId,
      if (clueId != null) 'clue_id': clueId,
      if (sequence != null) 'sequence': sequence,
      if (title != null) 'title': title,
      if (body != null) 'body': body,
      if (answerType != null) 'answer_type': answerType,
      if (mediaUrl != null) 'media_url': mediaUrl,
      if (cachedAt != null) 'cached_at': cachedAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  CachedCluesCompanion copyWith(
      {Value<String>? sessionId,
      Value<String>? clueId,
      Value<int>? sequence,
      Value<String>? title,
      Value<String>? body,
      Value<String>? answerType,
      Value<String?>? mediaUrl,
      Value<DateTime>? cachedAt,
      Value<int>? rowid}) {
    return CachedCluesCompanion(
      sessionId: sessionId ?? this.sessionId,
      clueId: clueId ?? this.clueId,
      sequence: sequence ?? this.sequence,
      title: title ?? this.title,
      body: body ?? this.body,
      answerType: answerType ?? this.answerType,
      mediaUrl: mediaUrl ?? this.mediaUrl,
      cachedAt: cachedAt ?? this.cachedAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (sessionId.present) {
      map['session_id'] = Variable<String>(sessionId.value);
    }
    if (clueId.present) {
      map['clue_id'] = Variable<String>(clueId.value);
    }
    if (sequence.present) {
      map['sequence'] = Variable<int>(sequence.value);
    }
    if (title.present) {
      map['title'] = Variable<String>(title.value);
    }
    if (body.present) {
      map['body'] = Variable<String>(body.value);
    }
    if (answerType.present) {
      map['answer_type'] = Variable<String>(answerType.value);
    }
    if (mediaUrl.present) {
      map['media_url'] = Variable<String>(mediaUrl.value);
    }
    if (cachedAt.present) {
      map['cached_at'] = Variable<DateTime>(cachedAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('CachedCluesCompanion(')
          ..write('sessionId: $sessionId, ')
          ..write('clueId: $clueId, ')
          ..write('sequence: $sequence, ')
          ..write('title: $title, ')
          ..write('body: $body, ')
          ..write('answerType: $answerType, ')
          ..write('mediaUrl: $mediaUrl, ')
          ..write('cachedAt: $cachedAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $CachedHintsTable extends CachedHints
    with TableInfo<$CachedHintsTable, CachedHint> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $CachedHintsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _sessionIdMeta =
      const VerificationMeta('sessionId');
  @override
  late final GeneratedColumn<String> sessionId = GeneratedColumn<String>(
      'session_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _clueIdMeta = const VerificationMeta('clueId');
  @override
  late final GeneratedColumn<String> clueId = GeneratedColumn<String>(
      'clue_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _sequenceMeta =
      const VerificationMeta('sequence');
  @override
  late final GeneratedColumn<int> sequence = GeneratedColumn<int>(
      'sequence', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  static const VerificationMeta _bodyMeta = const VerificationMeta('body');
  @override
  late final GeneratedColumn<String> body = GeneratedColumn<String>(
      'body', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  @override
  List<GeneratedColumn> get $columns => [id, sessionId, clueId, sequence, body];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'cached_hints';
  @override
  VerificationContext validateIntegrity(Insertable<CachedHint> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('session_id')) {
      context.handle(_sessionIdMeta,
          sessionId.isAcceptableOrUnknown(data['session_id']!, _sessionIdMeta));
    } else if (isInserting) {
      context.missing(_sessionIdMeta);
    }
    if (data.containsKey('clue_id')) {
      context.handle(_clueIdMeta,
          clueId.isAcceptableOrUnknown(data['clue_id']!, _clueIdMeta));
    } else if (isInserting) {
      context.missing(_clueIdMeta);
    }
    if (data.containsKey('sequence')) {
      context.handle(_sequenceMeta,
          sequence.isAcceptableOrUnknown(data['sequence']!, _sequenceMeta));
    } else if (isInserting) {
      context.missing(_sequenceMeta);
    }
    if (data.containsKey('body')) {
      context.handle(
          _bodyMeta, body.isAcceptableOrUnknown(data['body']!, _bodyMeta));
    } else if (isInserting) {
      context.missing(_bodyMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  List<Set<GeneratedColumn>> get uniqueKeys => [
        {sessionId, clueId, sequence},
      ];
  @override
  CachedHint map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return CachedHint(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      sessionId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}session_id'])!,
      clueId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}clue_id'])!,
      sequence: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}sequence'])!,
      body: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}body'])!,
    );
  }

  @override
  $CachedHintsTable createAlias(String alias) {
    return $CachedHintsTable(attachedDatabase, alias);
  }
}

class CachedHint extends DataClass implements Insertable<CachedHint> {
  final int id;
  final String sessionId;
  final String clueId;
  final int sequence;
  final String body;
  const CachedHint(
      {required this.id,
      required this.sessionId,
      required this.clueId,
      required this.sequence,
      required this.body});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['session_id'] = Variable<String>(sessionId);
    map['clue_id'] = Variable<String>(clueId);
    map['sequence'] = Variable<int>(sequence);
    map['body'] = Variable<String>(body);
    return map;
  }

  CachedHintsCompanion toCompanion(bool nullToAbsent) {
    return CachedHintsCompanion(
      id: Value(id),
      sessionId: Value(sessionId),
      clueId: Value(clueId),
      sequence: Value(sequence),
      body: Value(body),
    );
  }

  factory CachedHint.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return CachedHint(
      id: serializer.fromJson<int>(json['id']),
      sessionId: serializer.fromJson<String>(json['sessionId']),
      clueId: serializer.fromJson<String>(json['clueId']),
      sequence: serializer.fromJson<int>(json['sequence']),
      body: serializer.fromJson<String>(json['body']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'sessionId': serializer.toJson<String>(sessionId),
      'clueId': serializer.toJson<String>(clueId),
      'sequence': serializer.toJson<int>(sequence),
      'body': serializer.toJson<String>(body),
    };
  }

  CachedHint copyWith(
          {int? id,
          String? sessionId,
          String? clueId,
          int? sequence,
          String? body}) =>
      CachedHint(
        id: id ?? this.id,
        sessionId: sessionId ?? this.sessionId,
        clueId: clueId ?? this.clueId,
        sequence: sequence ?? this.sequence,
        body: body ?? this.body,
      );
  CachedHint copyWithCompanion(CachedHintsCompanion data) {
    return CachedHint(
      id: data.id.present ? data.id.value : this.id,
      sessionId: data.sessionId.present ? data.sessionId.value : this.sessionId,
      clueId: data.clueId.present ? data.clueId.value : this.clueId,
      sequence: data.sequence.present ? data.sequence.value : this.sequence,
      body: data.body.present ? data.body.value : this.body,
    );
  }

  @override
  String toString() {
    return (StringBuffer('CachedHint(')
          ..write('id: $id, ')
          ..write('sessionId: $sessionId, ')
          ..write('clueId: $clueId, ')
          ..write('sequence: $sequence, ')
          ..write('body: $body')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, sessionId, clueId, sequence, body);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is CachedHint &&
          other.id == this.id &&
          other.sessionId == this.sessionId &&
          other.clueId == this.clueId &&
          other.sequence == this.sequence &&
          other.body == this.body);
}

class CachedHintsCompanion extends UpdateCompanion<CachedHint> {
  final Value<int> id;
  final Value<String> sessionId;
  final Value<String> clueId;
  final Value<int> sequence;
  final Value<String> body;
  const CachedHintsCompanion({
    this.id = const Value.absent(),
    this.sessionId = const Value.absent(),
    this.clueId = const Value.absent(),
    this.sequence = const Value.absent(),
    this.body = const Value.absent(),
  });
  CachedHintsCompanion.insert({
    this.id = const Value.absent(),
    required String sessionId,
    required String clueId,
    required int sequence,
    required String body,
  })  : sessionId = Value(sessionId),
        clueId = Value(clueId),
        sequence = Value(sequence),
        body = Value(body);
  static Insertable<CachedHint> custom({
    Expression<int>? id,
    Expression<String>? sessionId,
    Expression<String>? clueId,
    Expression<int>? sequence,
    Expression<String>? body,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (sessionId != null) 'session_id': sessionId,
      if (clueId != null) 'clue_id': clueId,
      if (sequence != null) 'sequence': sequence,
      if (body != null) 'body': body,
    });
  }

  CachedHintsCompanion copyWith(
      {Value<int>? id,
      Value<String>? sessionId,
      Value<String>? clueId,
      Value<int>? sequence,
      Value<String>? body}) {
    return CachedHintsCompanion(
      id: id ?? this.id,
      sessionId: sessionId ?? this.sessionId,
      clueId: clueId ?? this.clueId,
      sequence: sequence ?? this.sequence,
      body: body ?? this.body,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (sessionId.present) {
      map['session_id'] = Variable<String>(sessionId.value);
    }
    if (clueId.present) {
      map['clue_id'] = Variable<String>(clueId.value);
    }
    if (sequence.present) {
      map['sequence'] = Variable<int>(sequence.value);
    }
    if (body.present) {
      map['body'] = Variable<String>(body.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('CachedHintsCompanion(')
          ..write('id: $id, ')
          ..write('sessionId: $sessionId, ')
          ..write('clueId: $clueId, ')
          ..write('sequence: $sequence, ')
          ..write('body: $body')
          ..write(')'))
        .toString();
  }
}

class $PendingAnswersTable extends PendingAnswers
    with TableInfo<$PendingAnswersTable, PendingAnswer> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $PendingAnswersTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _sessionIdMeta =
      const VerificationMeta('sessionId');
  @override
  late final GeneratedColumn<String> sessionId = GeneratedColumn<String>(
      'session_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _valueMeta = const VerificationMeta('value');
  @override
  late final GeneratedColumn<String> value = GeneratedColumn<String>(
      'value', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _latMeta = const VerificationMeta('lat');
  @override
  late final GeneratedColumn<double> lat = GeneratedColumn<double>(
      'lat', aliasedName, true,
      type: DriftSqlType.double, requiredDuringInsert: false);
  static const VerificationMeta _lonMeta = const VerificationMeta('lon');
  @override
  late final GeneratedColumn<double> lon = GeneratedColumn<double>(
      'lon', aliasedName, true,
      type: DriftSqlType.double, requiredDuringInsert: false);
  static const VerificationMeta _photoB64Meta =
      const VerificationMeta('photoB64');
  @override
  late final GeneratedColumn<String> photoB64 = GeneratedColumn<String>(
      'photo_b64', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _queuedAtMeta =
      const VerificationMeta('queuedAt');
  @override
  late final GeneratedColumn<DateTime> queuedAt = GeneratedColumn<DateTime>(
      'queued_at', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  @override
  List<GeneratedColumn> get $columns =>
      [id, sessionId, value, lat, lon, photoB64, queuedAt];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'pending_answers';
  @override
  VerificationContext validateIntegrity(Insertable<PendingAnswer> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('session_id')) {
      context.handle(_sessionIdMeta,
          sessionId.isAcceptableOrUnknown(data['session_id']!, _sessionIdMeta));
    } else if (isInserting) {
      context.missing(_sessionIdMeta);
    }
    if (data.containsKey('value')) {
      context.handle(
          _valueMeta, value.isAcceptableOrUnknown(data['value']!, _valueMeta));
    } else if (isInserting) {
      context.missing(_valueMeta);
    }
    if (data.containsKey('lat')) {
      context.handle(
          _latMeta, lat.isAcceptableOrUnknown(data['lat']!, _latMeta));
    }
    if (data.containsKey('lon')) {
      context.handle(
          _lonMeta, lon.isAcceptableOrUnknown(data['lon']!, _lonMeta));
    }
    if (data.containsKey('photo_b64')) {
      context.handle(_photoB64Meta,
          photoB64.isAcceptableOrUnknown(data['photo_b64']!, _photoB64Meta));
    }
    if (data.containsKey('queued_at')) {
      context.handle(_queuedAtMeta,
          queuedAt.isAcceptableOrUnknown(data['queued_at']!, _queuedAtMeta));
    } else if (isInserting) {
      context.missing(_queuedAtMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  PendingAnswer map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return PendingAnswer(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      sessionId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}session_id'])!,
      value: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}value'])!,
      lat: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}lat']),
      lon: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}lon']),
      photoB64: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}photo_b64']),
      queuedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}queued_at'])!,
    );
  }

  @override
  $PendingAnswersTable createAlias(String alias) {
    return $PendingAnswersTable(attachedDatabase, alias);
  }
}

class PendingAnswer extends DataClass implements Insertable<PendingAnswer> {
  final int id;
  final String sessionId;
  final String value;
  final double? lat;
  final double? lon;
  final String? photoB64;
  final DateTime queuedAt;
  const PendingAnswer(
      {required this.id,
      required this.sessionId,
      required this.value,
      this.lat,
      this.lon,
      this.photoB64,
      required this.queuedAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['session_id'] = Variable<String>(sessionId);
    map['value'] = Variable<String>(value);
    if (!nullToAbsent || lat != null) {
      map['lat'] = Variable<double>(lat);
    }
    if (!nullToAbsent || lon != null) {
      map['lon'] = Variable<double>(lon);
    }
    if (!nullToAbsent || photoB64 != null) {
      map['photo_b64'] = Variable<String>(photoB64);
    }
    map['queued_at'] = Variable<DateTime>(queuedAt);
    return map;
  }

  PendingAnswersCompanion toCompanion(bool nullToAbsent) {
    return PendingAnswersCompanion(
      id: Value(id),
      sessionId: Value(sessionId),
      value: Value(value),
      lat: lat == null && nullToAbsent ? const Value.absent() : Value(lat),
      lon: lon == null && nullToAbsent ? const Value.absent() : Value(lon),
      photoB64: photoB64 == null && nullToAbsent
          ? const Value.absent()
          : Value(photoB64),
      queuedAt: Value(queuedAt),
    );
  }

  factory PendingAnswer.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return PendingAnswer(
      id: serializer.fromJson<int>(json['id']),
      sessionId: serializer.fromJson<String>(json['sessionId']),
      value: serializer.fromJson<String>(json['value']),
      lat: serializer.fromJson<double?>(json['lat']),
      lon: serializer.fromJson<double?>(json['lon']),
      photoB64: serializer.fromJson<String?>(json['photoB64']),
      queuedAt: serializer.fromJson<DateTime>(json['queuedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'sessionId': serializer.toJson<String>(sessionId),
      'value': serializer.toJson<String>(value),
      'lat': serializer.toJson<double?>(lat),
      'lon': serializer.toJson<double?>(lon),
      'photoB64': serializer.toJson<String?>(photoB64),
      'queuedAt': serializer.toJson<DateTime>(queuedAt),
    };
  }

  PendingAnswer copyWith(
          {int? id,
          String? sessionId,
          String? value,
          Value<double?> lat = const Value.absent(),
          Value<double?> lon = const Value.absent(),
          Value<String?> photoB64 = const Value.absent(),
          DateTime? queuedAt}) =>
      PendingAnswer(
        id: id ?? this.id,
        sessionId: sessionId ?? this.sessionId,
        value: value ?? this.value,
        lat: lat.present ? lat.value : this.lat,
        lon: lon.present ? lon.value : this.lon,
        photoB64: photoB64.present ? photoB64.value : this.photoB64,
        queuedAt: queuedAt ?? this.queuedAt,
      );
  PendingAnswer copyWithCompanion(PendingAnswersCompanion data) {
    return PendingAnswer(
      id: data.id.present ? data.id.value : this.id,
      sessionId: data.sessionId.present ? data.sessionId.value : this.sessionId,
      value: data.value.present ? data.value.value : this.value,
      lat: data.lat.present ? data.lat.value : this.lat,
      lon: data.lon.present ? data.lon.value : this.lon,
      photoB64: data.photoB64.present ? data.photoB64.value : this.photoB64,
      queuedAt: data.queuedAt.present ? data.queuedAt.value : this.queuedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('PendingAnswer(')
          ..write('id: $id, ')
          ..write('sessionId: $sessionId, ')
          ..write('value: $value, ')
          ..write('lat: $lat, ')
          ..write('lon: $lon, ')
          ..write('photoB64: $photoB64, ')
          ..write('queuedAt: $queuedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, sessionId, value, lat, lon, photoB64, queuedAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is PendingAnswer &&
          other.id == this.id &&
          other.sessionId == this.sessionId &&
          other.value == this.value &&
          other.lat == this.lat &&
          other.lon == this.lon &&
          other.photoB64 == this.photoB64 &&
          other.queuedAt == this.queuedAt);
}

class PendingAnswersCompanion extends UpdateCompanion<PendingAnswer> {
  final Value<int> id;
  final Value<String> sessionId;
  final Value<String> value;
  final Value<double?> lat;
  final Value<double?> lon;
  final Value<String?> photoB64;
  final Value<DateTime> queuedAt;
  const PendingAnswersCompanion({
    this.id = const Value.absent(),
    this.sessionId = const Value.absent(),
    this.value = const Value.absent(),
    this.lat = const Value.absent(),
    this.lon = const Value.absent(),
    this.photoB64 = const Value.absent(),
    this.queuedAt = const Value.absent(),
  });
  PendingAnswersCompanion.insert({
    this.id = const Value.absent(),
    required String sessionId,
    required String value,
    this.lat = const Value.absent(),
    this.lon = const Value.absent(),
    this.photoB64 = const Value.absent(),
    required DateTime queuedAt,
  })  : sessionId = Value(sessionId),
        value = Value(value),
        queuedAt = Value(queuedAt);
  static Insertable<PendingAnswer> custom({
    Expression<int>? id,
    Expression<String>? sessionId,
    Expression<String>? value,
    Expression<double>? lat,
    Expression<double>? lon,
    Expression<String>? photoB64,
    Expression<DateTime>? queuedAt,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (sessionId != null) 'session_id': sessionId,
      if (value != null) 'value': value,
      if (lat != null) 'lat': lat,
      if (lon != null) 'lon': lon,
      if (photoB64 != null) 'photo_b64': photoB64,
      if (queuedAt != null) 'queued_at': queuedAt,
    });
  }

  PendingAnswersCompanion copyWith(
      {Value<int>? id,
      Value<String>? sessionId,
      Value<String>? value,
      Value<double?>? lat,
      Value<double?>? lon,
      Value<String?>? photoB64,
      Value<DateTime>? queuedAt}) {
    return PendingAnswersCompanion(
      id: id ?? this.id,
      sessionId: sessionId ?? this.sessionId,
      value: value ?? this.value,
      lat: lat ?? this.lat,
      lon: lon ?? this.lon,
      photoB64: photoB64 ?? this.photoB64,
      queuedAt: queuedAt ?? this.queuedAt,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (sessionId.present) {
      map['session_id'] = Variable<String>(sessionId.value);
    }
    if (value.present) {
      map['value'] = Variable<String>(value.value);
    }
    if (lat.present) {
      map['lat'] = Variable<double>(lat.value);
    }
    if (lon.present) {
      map['lon'] = Variable<double>(lon.value);
    }
    if (photoB64.present) {
      map['photo_b64'] = Variable<String>(photoB64.value);
    }
    if (queuedAt.present) {
      map['queued_at'] = Variable<DateTime>(queuedAt.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('PendingAnswersCompanion(')
          ..write('id: $id, ')
          ..write('sessionId: $sessionId, ')
          ..write('value: $value, ')
          ..write('lat: $lat, ')
          ..write('lon: $lon, ')
          ..write('photoB64: $photoB64, ')
          ..write('queuedAt: $queuedAt')
          ..write(')'))
        .toString();
  }
}

abstract class _$AppDatabase extends GeneratedDatabase {
  _$AppDatabase(QueryExecutor e) : super(e);
  $AppDatabaseManager get managers => $AppDatabaseManager(this);
  late final $CachedSessionsTable cachedSessions = $CachedSessionsTable(this);
  late final $CachedCluesTable cachedClues = $CachedCluesTable(this);
  late final $CachedHintsTable cachedHints = $CachedHintsTable(this);
  late final $PendingAnswersTable pendingAnswers = $PendingAnswersTable(this);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities =>
      [cachedSessions, cachedClues, cachedHints, pendingAnswers];
}

typedef $$CachedSessionsTableCreateCompanionBuilder = CachedSessionsCompanion
    Function({
  required String id,
  required String huntId,
  Value<String> status,
  required DateTime startedAt,
  Value<int> rowid,
});
typedef $$CachedSessionsTableUpdateCompanionBuilder = CachedSessionsCompanion
    Function({
  Value<String> id,
  Value<String> huntId,
  Value<String> status,
  Value<DateTime> startedAt,
  Value<int> rowid,
});

class $$CachedSessionsTableTableManager extends RootTableManager<
    _$AppDatabase,
    $CachedSessionsTable,
    CachedSession,
    $$CachedSessionsTableFilterComposer,
    $$CachedSessionsTableOrderingComposer,
    $$CachedSessionsTableCreateCompanionBuilder,
    $$CachedSessionsTableUpdateCompanionBuilder> {
  $$CachedSessionsTableTableManager(
      _$AppDatabase db, $CachedSessionsTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          filteringComposer:
              $$CachedSessionsTableFilterComposer(ComposerState(db, table)),
          orderingComposer:
              $$CachedSessionsTableOrderingComposer(ComposerState(db, table)),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> huntId = const Value.absent(),
            Value<String> status = const Value.absent(),
            Value<DateTime> startedAt = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              CachedSessionsCompanion(
            id: id,
            huntId: huntId,
            status: status,
            startedAt: startedAt,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String huntId,
            Value<String> status = const Value.absent(),
            required DateTime startedAt,
            Value<int> rowid = const Value.absent(),
          }) =>
              CachedSessionsCompanion.insert(
            id: id,
            huntId: huntId,
            status: status,
            startedAt: startedAt,
            rowid: rowid,
          ),
        ));
}

class $$CachedSessionsTableFilterComposer
    extends FilterComposer<_$AppDatabase, $CachedSessionsTable> {
  $$CachedSessionsTableFilterComposer(super.$state);
  ColumnFilters<String> get id => $state.composableBuilder(
      column: $state.table.id,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get huntId => $state.composableBuilder(
      column: $state.table.huntId,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get status => $state.composableBuilder(
      column: $state.table.status,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<DateTime> get startedAt => $state.composableBuilder(
      column: $state.table.startedAt,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));
}

class $$CachedSessionsTableOrderingComposer
    extends OrderingComposer<_$AppDatabase, $CachedSessionsTable> {
  $$CachedSessionsTableOrderingComposer(super.$state);
  ColumnOrderings<String> get id => $state.composableBuilder(
      column: $state.table.id,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get huntId => $state.composableBuilder(
      column: $state.table.huntId,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get status => $state.composableBuilder(
      column: $state.table.status,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<DateTime> get startedAt => $state.composableBuilder(
      column: $state.table.startedAt,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));
}

typedef $$CachedCluesTableCreateCompanionBuilder = CachedCluesCompanion
    Function({
  required String sessionId,
  required String clueId,
  required int sequence,
  required String title,
  required String body,
  required String answerType,
  Value<String?> mediaUrl,
  required DateTime cachedAt,
  Value<int> rowid,
});
typedef $$CachedCluesTableUpdateCompanionBuilder = CachedCluesCompanion
    Function({
  Value<String> sessionId,
  Value<String> clueId,
  Value<int> sequence,
  Value<String> title,
  Value<String> body,
  Value<String> answerType,
  Value<String?> mediaUrl,
  Value<DateTime> cachedAt,
  Value<int> rowid,
});

class $$CachedCluesTableTableManager extends RootTableManager<
    _$AppDatabase,
    $CachedCluesTable,
    CachedClue,
    $$CachedCluesTableFilterComposer,
    $$CachedCluesTableOrderingComposer,
    $$CachedCluesTableCreateCompanionBuilder,
    $$CachedCluesTableUpdateCompanionBuilder> {
  $$CachedCluesTableTableManager(_$AppDatabase db, $CachedCluesTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          filteringComposer:
              $$CachedCluesTableFilterComposer(ComposerState(db, table)),
          orderingComposer:
              $$CachedCluesTableOrderingComposer(ComposerState(db, table)),
          updateCompanionCallback: ({
            Value<String> sessionId = const Value.absent(),
            Value<String> clueId = const Value.absent(),
            Value<int> sequence = const Value.absent(),
            Value<String> title = const Value.absent(),
            Value<String> body = const Value.absent(),
            Value<String> answerType = const Value.absent(),
            Value<String?> mediaUrl = const Value.absent(),
            Value<DateTime> cachedAt = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              CachedCluesCompanion(
            sessionId: sessionId,
            clueId: clueId,
            sequence: sequence,
            title: title,
            body: body,
            answerType: answerType,
            mediaUrl: mediaUrl,
            cachedAt: cachedAt,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String sessionId,
            required String clueId,
            required int sequence,
            required String title,
            required String body,
            required String answerType,
            Value<String?> mediaUrl = const Value.absent(),
            required DateTime cachedAt,
            Value<int> rowid = const Value.absent(),
          }) =>
              CachedCluesCompanion.insert(
            sessionId: sessionId,
            clueId: clueId,
            sequence: sequence,
            title: title,
            body: body,
            answerType: answerType,
            mediaUrl: mediaUrl,
            cachedAt: cachedAt,
            rowid: rowid,
          ),
        ));
}

class $$CachedCluesTableFilterComposer
    extends FilterComposer<_$AppDatabase, $CachedCluesTable> {
  $$CachedCluesTableFilterComposer(super.$state);
  ColumnFilters<String> get sessionId => $state.composableBuilder(
      column: $state.table.sessionId,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get clueId => $state.composableBuilder(
      column: $state.table.clueId,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<int> get sequence => $state.composableBuilder(
      column: $state.table.sequence,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get title => $state.composableBuilder(
      column: $state.table.title,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get body => $state.composableBuilder(
      column: $state.table.body,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get answerType => $state.composableBuilder(
      column: $state.table.answerType,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get mediaUrl => $state.composableBuilder(
      column: $state.table.mediaUrl,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<DateTime> get cachedAt => $state.composableBuilder(
      column: $state.table.cachedAt,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));
}

class $$CachedCluesTableOrderingComposer
    extends OrderingComposer<_$AppDatabase, $CachedCluesTable> {
  $$CachedCluesTableOrderingComposer(super.$state);
  ColumnOrderings<String> get sessionId => $state.composableBuilder(
      column: $state.table.sessionId,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get clueId => $state.composableBuilder(
      column: $state.table.clueId,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<int> get sequence => $state.composableBuilder(
      column: $state.table.sequence,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get title => $state.composableBuilder(
      column: $state.table.title,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get body => $state.composableBuilder(
      column: $state.table.body,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get answerType => $state.composableBuilder(
      column: $state.table.answerType,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get mediaUrl => $state.composableBuilder(
      column: $state.table.mediaUrl,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<DateTime> get cachedAt => $state.composableBuilder(
      column: $state.table.cachedAt,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));
}

typedef $$CachedHintsTableCreateCompanionBuilder = CachedHintsCompanion
    Function({
  Value<int> id,
  required String sessionId,
  required String clueId,
  required int sequence,
  required String body,
});
typedef $$CachedHintsTableUpdateCompanionBuilder = CachedHintsCompanion
    Function({
  Value<int> id,
  Value<String> sessionId,
  Value<String> clueId,
  Value<int> sequence,
  Value<String> body,
});

class $$CachedHintsTableTableManager extends RootTableManager<
    _$AppDatabase,
    $CachedHintsTable,
    CachedHint,
    $$CachedHintsTableFilterComposer,
    $$CachedHintsTableOrderingComposer,
    $$CachedHintsTableCreateCompanionBuilder,
    $$CachedHintsTableUpdateCompanionBuilder> {
  $$CachedHintsTableTableManager(_$AppDatabase db, $CachedHintsTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          filteringComposer:
              $$CachedHintsTableFilterComposer(ComposerState(db, table)),
          orderingComposer:
              $$CachedHintsTableOrderingComposer(ComposerState(db, table)),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<String> sessionId = const Value.absent(),
            Value<String> clueId = const Value.absent(),
            Value<int> sequence = const Value.absent(),
            Value<String> body = const Value.absent(),
          }) =>
              CachedHintsCompanion(
            id: id,
            sessionId: sessionId,
            clueId: clueId,
            sequence: sequence,
            body: body,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required String sessionId,
            required String clueId,
            required int sequence,
            required String body,
          }) =>
              CachedHintsCompanion.insert(
            id: id,
            sessionId: sessionId,
            clueId: clueId,
            sequence: sequence,
            body: body,
          ),
        ));
}

class $$CachedHintsTableFilterComposer
    extends FilterComposer<_$AppDatabase, $CachedHintsTable> {
  $$CachedHintsTableFilterComposer(super.$state);
  ColumnFilters<int> get id => $state.composableBuilder(
      column: $state.table.id,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get sessionId => $state.composableBuilder(
      column: $state.table.sessionId,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get clueId => $state.composableBuilder(
      column: $state.table.clueId,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<int> get sequence => $state.composableBuilder(
      column: $state.table.sequence,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get body => $state.composableBuilder(
      column: $state.table.body,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));
}

class $$CachedHintsTableOrderingComposer
    extends OrderingComposer<_$AppDatabase, $CachedHintsTable> {
  $$CachedHintsTableOrderingComposer(super.$state);
  ColumnOrderings<int> get id => $state.composableBuilder(
      column: $state.table.id,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get sessionId => $state.composableBuilder(
      column: $state.table.sessionId,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get clueId => $state.composableBuilder(
      column: $state.table.clueId,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<int> get sequence => $state.composableBuilder(
      column: $state.table.sequence,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get body => $state.composableBuilder(
      column: $state.table.body,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));
}

typedef $$PendingAnswersTableCreateCompanionBuilder = PendingAnswersCompanion
    Function({
  Value<int> id,
  required String sessionId,
  required String value,
  Value<double?> lat,
  Value<double?> lon,
  Value<String?> photoB64,
  required DateTime queuedAt,
});
typedef $$PendingAnswersTableUpdateCompanionBuilder = PendingAnswersCompanion
    Function({
  Value<int> id,
  Value<String> sessionId,
  Value<String> value,
  Value<double?> lat,
  Value<double?> lon,
  Value<String?> photoB64,
  Value<DateTime> queuedAt,
});

class $$PendingAnswersTableTableManager extends RootTableManager<
    _$AppDatabase,
    $PendingAnswersTable,
    PendingAnswer,
    $$PendingAnswersTableFilterComposer,
    $$PendingAnswersTableOrderingComposer,
    $$PendingAnswersTableCreateCompanionBuilder,
    $$PendingAnswersTableUpdateCompanionBuilder> {
  $$PendingAnswersTableTableManager(
      _$AppDatabase db, $PendingAnswersTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          filteringComposer:
              $$PendingAnswersTableFilterComposer(ComposerState(db, table)),
          orderingComposer:
              $$PendingAnswersTableOrderingComposer(ComposerState(db, table)),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<String> sessionId = const Value.absent(),
            Value<String> value = const Value.absent(),
            Value<double?> lat = const Value.absent(),
            Value<double?> lon = const Value.absent(),
            Value<String?> photoB64 = const Value.absent(),
            Value<DateTime> queuedAt = const Value.absent(),
          }) =>
              PendingAnswersCompanion(
            id: id,
            sessionId: sessionId,
            value: value,
            lat: lat,
            lon: lon,
            photoB64: photoB64,
            queuedAt: queuedAt,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required String sessionId,
            required String value,
            Value<double?> lat = const Value.absent(),
            Value<double?> lon = const Value.absent(),
            Value<String?> photoB64 = const Value.absent(),
            required DateTime queuedAt,
          }) =>
              PendingAnswersCompanion.insert(
            id: id,
            sessionId: sessionId,
            value: value,
            lat: lat,
            lon: lon,
            photoB64: photoB64,
            queuedAt: queuedAt,
          ),
        ));
}

class $$PendingAnswersTableFilterComposer
    extends FilterComposer<_$AppDatabase, $PendingAnswersTable> {
  $$PendingAnswersTableFilterComposer(super.$state);
  ColumnFilters<int> get id => $state.composableBuilder(
      column: $state.table.id,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get sessionId => $state.composableBuilder(
      column: $state.table.sessionId,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get value => $state.composableBuilder(
      column: $state.table.value,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<double> get lat => $state.composableBuilder(
      column: $state.table.lat,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<double> get lon => $state.composableBuilder(
      column: $state.table.lon,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get photoB64 => $state.composableBuilder(
      column: $state.table.photoB64,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<DateTime> get queuedAt => $state.composableBuilder(
      column: $state.table.queuedAt,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));
}

class $$PendingAnswersTableOrderingComposer
    extends OrderingComposer<_$AppDatabase, $PendingAnswersTable> {
  $$PendingAnswersTableOrderingComposer(super.$state);
  ColumnOrderings<int> get id => $state.composableBuilder(
      column: $state.table.id,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get sessionId => $state.composableBuilder(
      column: $state.table.sessionId,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get value => $state.composableBuilder(
      column: $state.table.value,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<double> get lat => $state.composableBuilder(
      column: $state.table.lat,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<double> get lon => $state.composableBuilder(
      column: $state.table.lon,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get photoB64 => $state.composableBuilder(
      column: $state.table.photoB64,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<DateTime> get queuedAt => $state.composableBuilder(
      column: $state.table.queuedAt,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));
}

class $AppDatabaseManager {
  final _$AppDatabase _db;
  $AppDatabaseManager(this._db);
  $$CachedSessionsTableTableManager get cachedSessions =>
      $$CachedSessionsTableTableManager(_db, _db.cachedSessions);
  $$CachedCluesTableTableManager get cachedClues =>
      $$CachedCluesTableTableManager(_db, _db.cachedClues);
  $$CachedHintsTableTableManager get cachedHints =>
      $$CachedHintsTableTableManager(_db, _db.cachedHints);
  $$PendingAnswersTableTableManager get pendingAnswers =>
      $$PendingAnswersTableTableManager(_db, _db.pendingAnswers);
}
