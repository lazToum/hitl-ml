# The Player's Perspective

```{epigraph}
The oracle does not know they are an oracle. They are just trying to win.

-- Chapter 10
```

---

## Think about it

**1.** You are a player in a treasure hunt. You do not know how your behavior is being recorded. At the end, the creator sees that you spent 23 minutes on clue 3 and submitted 7 wrong answers. Is that information about you? About the clue? About the hunt?

**2.** A mobile app for a game should be fast, delightful, and forgiving of connectivity issues. A HITL data collection system should be accurate, complete, and auditable. These are not the same design goals. How do you build something that is both?

**3.** The player app knows the player's GPS location at all times (for GPS clues). The player consented to location access by approving the app permission. Did they understand what they were consenting to?

**4.** The proximity map shows an 80-metre teal circle rather than an exact pin. This protects the creator's location data from being trivially reverse-engineered. But it also withholds precision from the player. Where is the line between privacy-preserving design and deliberately misleading UX?

**5.** A full-screen particle celebration fires when a player finishes the hunt. This is an emotional design choice. What does it communicate about who the system thinks the player is? What would be lost if the completion screen were a plain text "You finished!"?

---

## The Flutter app

The mobile player app (`mobile/`) is built with Flutter and targets iOS and Android. Its primary responsibilities:

- Authenticate the player via OIDC/PKCE
- Scan QR codes and tap NFC tags
- Display the current clue and collected hints
- Submit answers (text, GPS coordinates, photos)
- Show hunt progress and completion

The app uses `flutter_riverpod` for state management, `go_router` for navigation, `flutter_appauth` for OIDC, and `mobile_scanner` for QR scanning.

---

## Authentication flow

Mobile OIDC uses the PKCE (Proof Key for Code Exchange) flow, which is safe for public clients that cannot store secrets:

```dart
// mobile/lib/services/auth_service.dart

class AuthService {
  static final FlutterAppAuth _appAuth = FlutterAppAuth();

  static Future<void> login() async {
    final result = await _appAuth.authorizeAndExchangeCode(
      AuthorizationTokenRequest(
        'mobile-app',
        'treasurehunt://oauth/callback',
        issuer: AppConfig.oidcIssuer,
        scopes: ['openid', 'email', 'profile', 'groups'],
        preferEphemeralSession: false,
      ),
    );
    await _storeTokens(result);
  }

  static Future<String?> accessToken() async {
    // Refresh if expired
    final stored = await _loadTokens();
    if (stored == null) return null;
    if (_isExpired(stored.accessToken)) {
      return await _refresh(stored.refreshToken);
    }
    return stored.accessToken;
  }
}
```

The `scopes` list requests `openid`, `profile`, `email`, and `offline_access`. Zitadel role grants are exposed through project-role claims, and the API also keeps an email-prefix fallback for local dev accounts.

Tokens are stored in `flutter_secure_storage`, which uses the device's secure enclave (Keychain on iOS, Android Keystore on Android) rather than SharedPreferences. This is the correct place for credentials on mobile.

---

## The clue screen

```dart
// mobile/lib/screens/clue_screen.dart

class ClueScreen extends ConsumerWidget {
  final String sessionId;
  const ClueScreen({required this.sessionId, super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final clueAsync = ref.watch(currentClueProvider(sessionId));

    return clueAsync.when(
      loading: () => const CircularProgressIndicator(),
      error: (e, _) => ErrorView(message: e.toString()),
      data: (clue) => Column(children: [
        Text(clue.title, style: Theme.of(context).textTheme.headlineMedium),
        Text(clue.body),
        if (clue.mediaUrl != null)
          CachedNetworkImage(imageUrl: clue.mediaUrl!),
        AnswerInput(clue: clue, sessionId: sessionId),
        HintSection(
          hints: clue.hints,
          sessionId: sessionId,
          clueId: clue.id,
        ),
      ]),
    );
  }
}
```

The clue screen is data-driven: it renders whatever the API returns. The hint section shows already-unlocked hints and a "Request hint" button if more are available. The answer input adapts to the clue's answer type.

---

## QR scanning

```dart
// mobile/lib/screens/scan_screen.dart

class ScanScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MobileScanner(
      onDetect: (capture) {
        final barcode = capture.barcodes.firstOrNull;
        if (barcode?.rawValue == null) return;

        final uri = Uri.parse(barcode!.rawValue!);
        final token = uri.pathSegments.last;

        // Call the universal scan endpoint
        ref.read(apiServiceProvider)
           .scan(token, sessionId: ref.read(activeSessionProvider)?.id)
           .then((result) {
             // Navigate to clue if it matches current session
             if (result.clueId == currentClue.id) {
               context.go('/session/${sessionId}/answer');
             }
           });
      },
    );
  }
}
```

The scanner calls `GET /scan/:token` with the player's current session ID. The server returns which clue the token belongs to. The app uses this to confirm the player is at the right location and navigate to the answer submission screen.

The scan endpoint works independently of session context — it tells you which clue a token belongs to without requiring authentication. This allows future use cases like spectators checking where a clue is located.

---

## GPS submission

```dart
// mobile/lib/services/location_service.dart

class LocationService {
  static Future<Position> currentPosition() async {
    final permission = await Geolocator.requestPermission();
    if (permission == LocationPermission.denied) {
      throw 'Location permission denied';
    }
    return Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );
  }
}
```

For GPS clues, the app requests a fresh location reading before submitting. The coordinates go to the Rust API in the answer body. The server calls `validate_gps` to check proximity.

`LocationAccuracy.high` uses GPS hardware when available, cellular/WiFi triangulation as fallback. In practice on mobile, this gives 5–15 metre accuracy outdoors. The creator needs to account for this when setting the clue radius.

The app requests location only when the player presses "Submit answer" for a GPS clue — not continuously. This is a battery and privacy consideration. The server does not track the player's location; it only validates a single point-in-time reading.

---

## Offline resilience

A treasure hunt often takes place outdoors, in areas with variable connectivity. The Flutter app uses `drift` (SQLite) for local persistence:

- The current clue is cached locally after being fetched
- Submitted answers are queued if the API is unreachable, and retried when connectivity returns
- Unlocked hints are stored locally so they remain visible without a network call

This makes the player experience resilient to brief connectivity interruptions, which are common at physical locations. It also creates a subtle consistency challenge: the local cache may diverge from the server if the player uses multiple devices or if an admin changes the hunt mid-run.

---

## GPS proximity map

The web-based player interface includes a proximity map for GPS clues. Rather than showing the player exactly where the target is, the map renders an 80-metre teal circle centred on the target location. The player can see whether they are inside or outside the zone, but not where within it they should go.

This is a deliberate privacy-first design choice. If the map showed the exact pin, a player could solve the clue without leaving their desk — just share the screenshot. The zone map preserves the physical challenge while giving the player useful directional feedback.

The player's current position is tracked via `watchPosition` (the browser Geolocation API's continuous mode, not a one-shot reading). The haversine distance between the player's current coordinates and the target is computed client-side and displayed in real time as they walk. When the distance drops below the answer radius, the answer submission field activates.

The continuous tracking is a meaningful privacy decision. The player's movement path is known to the browser during the session but is not sent to the server — only the final answer coordinates are submitted. The server sees a point, not a track.

---

## Babylon.js hunt completion

When a player submits the final correct answer, a full-screen Babylon.js particle scene fires before the completion screen renders. The scene uses a burst emitter — several thousand particles with randomised initial velocity, colour-shifted from the hunt's primary palette — that lasts roughly three seconds before the completion summary fades in.

The celebration is implemented as a React component that mounts a `<canvas>` over the full viewport, runs the Babylon.js engine for a fixed duration, then unmounts. It adds approximately 180 KB (gzipped) to the player bundle for a single three-second effect.

This is a question of proportion. The Babylon.js runtime is significant overhead for a one-time animation. An equivalent CSS animation would be smaller and faster. The choice of a 3D particle engine is a signal about what kind of product this is meant to be — not a form, but a game.

---

## What the player generates

From a HITL data collection standpoint, every player action is signal:

| Player action | What it tells us |
|---------------|-----------------|
| Answer submitted (correct, 1st try) | Clue is probably well-written and appropriately difficult |
| Answer submitted (wrong, 3 times) | Clue may be ambiguous, too hard, or the tolerance too strict |
| Hint requested at 2 minutes | Player was actively stuck, not just impatient |
| Hint not requested despite eligibility | Player eventually solved it on their own — the struggle was productive |
| Session abandoned | Something went wrong — location inaccessible, app crash, or player gave up |

The event log captures all of this. The app generates it passively — the player does not know they are contributing to anything other than their game score.

---

## Reflection

The player is an oracle whose judgments shape the HITL feedback loop — but they never consented to that role. They signed up to play a game, not to label data about clue difficulty.

At what point does this become a problem? Is it always a problem, or only when the data is used in specific ways? What disclosure, if any, would you include in the app's onboarding?

<span class="answer-box">&nbsp;</span>
<span class="answer-box">&nbsp;</span>
