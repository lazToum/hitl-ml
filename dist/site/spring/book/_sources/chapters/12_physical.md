# QR, NFC, and Physical Anchors

```{epigraph}
A clue that requires physical presence is a clue that cannot be cheated by Google. It is also a clue that cannot be solved from a hospital bed.

-- Chapter 12
```

---

## Think about it

**1.** QR codes and NFC tags are physical objects placed in physical locations. What happens when the QR code is damaged, the NFC tag is demagnetized, or the location becomes inaccessible? Who is responsible?

**2.** The QR code encodes a URL that encodes a token that maps to a clue. There are four layers of indirection. Why is each layer there? What would break if you removed one?

**3.** A digital treasure hunt clue can be solved from anywhere. A physical anchor — a QR code at a specific location — forces physical presence. What does physical presence add to the HITL dynamic?

---

## The token design

Every clue has a stable, opaque token generated when the clue is first saved:

```rust
fn generate_token() -> String {
    use rand::Rng;
    const CHARSET: &[u8] = b"ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let mut rng = rand::thread_rng();
    (0..12)
        .map(|_| CHARSET[rng.gen_range(0..CHARSET.len())] as char)
        .collect()
}
```

12 characters from a carefully chosen set: uppercase and lowercase, digits 2-9 (no zero, no one). The charset excludes characters that look alike in print (`0` vs `O`, `1` vs `l`). This matters because the token is also printed below the QR code — if the code is damaged, a player can type the token manually.

The token is opaque: it encodes no information about the hunt, clue, or sequence. This is intentional. A token that contained sequence information could be guessed. A token that contained hunt information would need to change if the hunt was restructured. An opaque token is stable across all hunt edits.

Tokens are stored in `clue_tokens`, one per clue. The relationship is stable: `clue_tokens.clue_id` is a foreign key to `clues.id`. If a clue is deleted, its token is deleted (CASCADE). If the clue's content changes, the token does not — the physical QR codes remain valid.

---

## QR code generation

```rust
// services/qr_generator.rs

pub fn clue_qr_png(base_url: &str, token: &str) -> anyhow::Result<Vec<u8>> {
    let url = format!("{base_url}/scan/{token}");
    let code = QrCode::new(url.as_bytes()).context("QR encode failed")?;

    let img = code
        .render::<image::Luma<u8>>()
        .min_dimensions(200, 200)
        .build();

    let mut buf = Vec::new();
    img.write_to(
        &mut std::io::Cursor::new(&mut buf),
        image::ImageFormat::Png,
    ).context("PNG encode failed")?;

    Ok(buf)
}
```

The QR code encodes the URL `{base_url}/scan/{token}`. The mobile scanner extracts the token from that URL and submits it as the QR/NFC answer for the current clue. The API also exposes `GET /scan/:token` to resolve token metadata, but the current scan handler requires authentication, so a browser following the URL without a bearer token will not act as an anonymous public lookup page. The base URL must be publicly reachable from the player's phone — `localhost` will not work in production.

The minimum dimension is 200×200 pixels, suitable for printing at 2–3 cm per side. QR codes are redundant by design — they can decode correctly even if 30% of the code is damaged. Printing at a larger size further improves reliability.

The `hunt_qr_sheet` function generates all codes for a hunt and returns them as base64-encoded PNGs in a JSON array. The web dashboard fetches this and renders a printable page.

---

## NFC

NFC (Near Field Communication) works differently from QR. Instead of encoding a URL in a visual pattern, an NFC tag stores data that a phone reads when tapped. For this system, the tag stores the same URL pattern as the QR code: `{base_url}/scan/{token}`.

Writing NFC tags requires a separate step not handled by the dashboard — you need an NFC-capable device and a tag writing app (NFC Tools is common). The workflow:

1. Get the token for the clue (visible in the QR sheet or via the API)
2. Write `{base_url}/scan/{token}` to an NFC tag
3. Place the tag at the clue location

From the app's perspective, NFC and QR produce identical results: a URL containing a token. The current Flutter scanner returns that token to the clue screen, which submits it to the answer endpoint. `ApiService.resolveScan()` can call the scan endpoint with a `source` parameter (`"nfc"` vs. `"qr"`), and the Rust scan handler logs that distinction when a `session_id` is provided, but the main clue-screen flow does not currently use that resolver.

```dart
// mobile/lib/services/nfc_service.dart

class NfcService {
  static Future<String?> readTag() async {
    return await FlutterNfcKit.poll().then((tag) async {
      final ndef = tag.ndefAvailable ? await FlutterNfcKit.readNDEFRecords() : null;
      await FlutterNfcKit.finish();
      return ndef?.firstOrNull?.payload;
    });
  }
}
```

---

## The scan endpoint

The scan endpoint can resolve both QR and NFC tokens:

```rust
// routes/scan.rs

pub async fn scan(
    _auth: AuthUser,
    State(state): State<AppState>,
    Path(token): Path<String>,
    Query(q): Query<ScanQuery>,
) -> Result<Json<serde_json::Value>> {
    let row = sqlx::query!(
        r#"SELECT ct.clue_id, c.hunt_id, c.sequence, c.title
           FROM clue_tokens ct
           JOIN clues c ON c.id = ct.clue_id
           WHERE ct.token = $1"#,
        token,
    ).fetch_one(&state.db).await
     .map_err(|_| AppError::NotFound("unknown token".into()))?;

    if let Some(session_id) = q.session_id {
        let source = q.source.as_deref().unwrap_or("qr");
        let event_type = if source == "nfc" { types::NFC_TAPPED } else { types::QR_SCANNED };
        logger.log(session_id, row.hunt_id, Some(row.clue_id), event_type, /* ... */).await?;
    }

    Ok(Json(json!({
        "clue_id":  row.clue_id,
        "hunt_id":  row.hunt_id,
        "sequence": row.sequence,
        "title":    row.title,
    })))
}
```

The endpoint does not validate that the scan is for the player's current clue. It just returns which clue the token belongs to and, if given a `session_id`, logs a QR or NFC event. The app can use that information to confirm the player is in the right place, show an error if not, or simply submit the token through the normal answer endpoint.

The handler currently still requires `AuthUser`, so spectator/developer lookup without authentication is a future extension rather than current behavior.

---

## Physical anchors and HITL

Adding physical anchors to a digital HITL system changes its properties in interesting ways.

**Forced locality.** A player cannot complete a GPS or QR clue without going to the location. This is the strongest anti-cheating measure in the system. It also excludes players who cannot travel — by disability, by distance, by circumstance.

**Fragility.** A digital clue degrades gracefully: a slow server is annoying, a down server is worse. A physical QR code that gets torn off a wall or a landmark that gets demolished has no graceful degradation. The hunt breaks for everyone until someone replaces the physical component.

**Richness.** The physical world provides context that the digital clue cannot. A clue that says "find the plaque on the building's east face" requires the player to navigate, observe, and interpret — skills that a text answer on a screen does not test.

The physical anchor is a bridge between the HITL system and the world it is modeling. When the two diverge, the loop breaks.

---

## Reflection

QR codes require the player to have a functioning camera. NFC requires compatible hardware. GPS requires outdoor line-of-sight. Photo clues require enough light and a steady hand.

Every answer type assumes a capable player with a capable device. What accessibility considerations did this design miss? What would an inclusive treasure hunt look like?

<span class="answer-box">&nbsp;</span>
<span class="answer-box">&nbsp;</span>
