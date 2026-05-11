# The Creator's Perspective

```{epigraph}
The annotator sees the world through the categories you gave them. Design the categories carefully.

-- Chapter 9
```

---

## Think about it

**1.** You are designing a form for creating clues. What fields do you show by default, and what do you hide behind "Advanced"? What does that choice reveal about your assumptions about creators?

**2.** A creator who uses the AI generator for every clue is different from a creator who writes every clue by hand. Should the system track this? Should it be disclosed to players?

**3.** A live hunt with 50 active sessions. The creator notices clue 4 is causing widespread confusion and wants to fix the wording. Should the system allow edits to live clues? If yes, what happens to the 20 players currently on clue 4?

**4.** The clue editor now shows clues as a visual flow graph. How does the visual metaphor change how creators think about hunt design? Does seeing the sequence as a connected graph reveal structural properties — dead ends, bottlenecks — that a list view would hide?

**5.** When a creator picks GPS coordinates by clicking a map rather than typing lat/lon, what cognitive load have you reduced? What might you have hidden? Could the precision of the click introduce systematic error that typed coordinates would not?

---

## The creator dashboard

The web dashboard (`web/src/pages/CreatorDashboard/`) serves creators. It is a React application that provides:

- Hunt management: create, edit, activate, archive
- Clue editor: write clues, set answer types and tolerances, manage hints
- AI assistance: generate clue drafts, estimate difficulty
- QR sheet: generate and print QR codes for all clues in a hunt

The dashboard communicates with the Rust API through `web/src/services/api.ts`. Authentication uses `oidc-client-ts` — the creator logs in via Zitadel and the browser stores the token.

---

## Hunt creation flow

```tsx
// web/src/pages/CreatorDashboard/index.tsx

export default function CreatorDashboard() {
    const { data: hunts, refetch } = useQuery({
        queryKey: ['hunts'],
        queryFn: () => api.get('/hunts').then(r => r.data),
    });

    const createHunt = useMutation({
        mutationFn: (data: CreateHuntRequest) =>
            api.post('/hunts', data).then(r => r.data),
        onSuccess: () => refetch(),
    });

    // ...
}
```

React Query manages server state — fetching, caching, and invalidating hunt lists. When a new hunt is created, the list automatically refreshes.

The Rust `CreateHunt` model accepts title, description, and optional start/end times. The current dashboard create button sends only `title: "Untitled Hunt"` and an empty description. The status starts as `draft`, but activation is currently just a status update; the API does not enforce "must have at least one clue" before a hunt becomes active.

---

## The clue editor

The clue editor (`ClueEditor.tsx`) is the most complex component. It manages:

- The clue's content (title and body; the API model also has `media_url`, but the current dashboard does not expose it)
- The answer configuration (type, value, tolerance)
- The hint list (up to N hints in sequence)
- The AI assistance panel (generate or estimate)

```tsx
function ClueEditor({ huntId, sequence, onSave }: ClueEditorProps) {
    const [form, setForm] = useState<ClueFormState>(defaultClueForm());
    const [aiLoading, setAiLoading] = useState(false);

    const generateWithAI = async () => {
        setAiLoading(true);
        try {
            const result = await api.post(`/hunts/${huntId}/ai/generate-clue`, {
                description: form.body || 'a mystery location',
                answer:      form.answerValue || 'unknown',
                difficulty:  3,
                num_hints:   3,
            });
            // Pre-fill form with AI output
            setForm(f => ({
                ...f,
                title:           result.data.title,
                body:            result.data.body,
                hints:           result.data.hints,
            }));
        } finally {
            setAiLoading(false);
        }
    };

    const save = () => {
        api.put(`/hunts/${huntId}/clues/${form.sequence}`, form)
           .then(() => onSave());
    };

    // ...
}
```

The AI generation fills part of the form but does not save. The creator sees the AI output in the same fields they would use to write a clue manually. In the current implementation it fills title, clue text, and hints only; the answer value and tolerance remain creator-supplied. The "AI was here" is not stored — a generated clue and a hand-written clue look identical in the database.

This is a transparency gap. If post-hoc analysis wanted to compare AI-assisted clues to hand-written ones, it could not. Adding an `ai_generated: bool` column to the clues table would cost almost nothing and enable that analysis.

---

## ReactFlow clue editor

The clue list inside a hunt is no longer a plain ordered list. It is rendered as an interactive flow graph using `@xyflow/react` (ReactFlow). Each clue becomes a node; animated directed edges connect them in sequence order. Creators can drag nodes to visually rearrange the layout, and the graph updates the underlying sequence order automatically.

This changes the authoring experience in a subtle but important way. A list suggests a queue — you add items at the bottom and work top to bottom. A flow graph suggests a narrative: there is a beginning, a path, and an end. Creators who see their hunt as a graph tend to notice structural problems earlier — a clue that branches nowhere, a sequence where three hard clues stack consecutively, a bottleneck node that everything feeds through.

From a HITL perspective, the graph is also a form of implicit labeling. When a creator drags clue 7 to follow immediately after clue 2, they are encoding a sequencing judgment. That judgment could be studied: do certain orderings correlate with higher completion rates? The visual editor makes that data richer without adding any explicit annotation step.

---

## GPS map picker

GPS clues require the creator to specify the target coordinates — the point a player must physically reach. The original interface provided two text fields: `latitude` and `longitude`. The current interface replaces these with an interactive Leaflet map (`GpsPickerMap.tsx`): the creator pans and clicks to place a pin, and the lat/lon fields populate automatically from the click coordinates.

The map picker lowers the barrier to entry dramatically. A creator who does not know the coordinates of the footbridge in the park can find it on the map, click it, and move on. The cognitive task shifts from "look up the coordinates" to "find the location on a map," which is more natural for non-technical creators.

The tradeoff is precision. A click on a map at the default zoom level has a radius of roughly 5–15 metres. A creator who types `51.50729, -0.12776` is making a different kind of claim than one who clicks approximately there. The tolerance slider compensates for some of this, but the source of imprecision is now in the creator's workflow rather than in the environment.

---

## The QR sheet

```tsx
// web/src/pages/CreatorDashboard/QrSheet.tsx

export function QrSheet({ huntId }: { huntId: string }) {
    const { data } = useQuery({
        queryKey: ['qr-sheet', huntId],
        queryFn: () => api.get(`/hunts/${huntId}/qr-sheet`).then(r => r.data),
    });

    return (
        <div className="qr-sheet">
            {data?.map((clue: ClueQr) => (
                <div key={clue.sequence} className="qr-card">
                    <h3>{clue.sequence}. {clue.title}</h3>
                    <img
                        src={`data:image/png;base64,${clue.png_b64}`}
                        alt={`QR for clue ${clue.sequence}`}
                    />
                    <code>{clue.token}</code>
                </div>
            ))}
        </div>
    );
}
```

The QR sheet fetches pre-rendered QR code images from the Rust API (base64-encoded PNGs, generated by `services/qr_generator.rs`). The creator can print this page — one QR card per clue — and place the printed codes at their physical locations.

This is the bridge between the digital and physical worlds. The token embedded in each QR code is the same token in `clue_tokens`. Printing and placing the codes is entirely offline — no internet needed at the hunt location.

---

## Sharing and discovery

Once a hunt is active, the creator can share it via a one-click copy button in the dashboard topbar. The button writes the join URL (`/join?hunt=<id>`) to the clipboard. Players who receive the link land directly on the join flow without needing to know the UUID manually.

Active hunts also appear on the `/discover` page — a public, unauthenticated page listing hunts that are currently accepting players. This removes the need for the creator to actively distribute links; interested players can find the hunt on their own. The tension here is intentional: some hunts are designed for specific groups and should not be publicly discoverable. The system currently makes all active hunts discoverable, which is an implicit policy choice the creator cannot override.

---

## Creator as annotator

From a HITL perspective, the creator is performing a labeling task: they are encoding their judgment about what counts as a correct answer, how hard a clue is, and what hint should be offered when.

Everything they enter into the clue editor is a label. The `answer_value` is the ground truth. The `answer_tolerance` is a claim about how similar an answer must be to the ground truth to count. The hints are annotations about the solution path.

These labels are created once and applied to every player who runs the hunt. A creator who writes a vague clue creates a bad experience for all players. A creator who sets too tight a tolerance creates frustration. A creator who writes excellent progressive hints creates a better experience regardless of the AI.

The system cannot enforce label quality. It can only surface the signal: player performance data, after the hunt, tells you which labels were good and which were not.

---

## Reflection

The creator dashboard makes the hunt creation process feel like filling out a form. But creating a good treasure hunt is a creative act — it requires imagining the player's experience from a location they haven't been to yet.

What does a form-based interface do to creative tasks? Does it constrain thinking to the fields provided? Does it help by making the task more concrete? Would a different interface — freeform text, map-based, conversation with AI — produce different hunts?

<span class="answer-box">&nbsp;</span>
<span class="answer-box">&nbsp;</span>
