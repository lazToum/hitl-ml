-- ============================================================
-- Demo hunt — ΠΑΔΑ / UNIWA Egaleo Park Campus
-- Theme: history of the institution, from TEI to university
-- Runs once on first DB init (after schema.sql alphabetically)
-- All INSERTs use ON CONFLICT DO NOTHING for idempotency.
-- ============================================================

-- ── System creator player ─────────────────────────────────────
INSERT INTO players (id, display_name, email, role, external_id)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Admin',
  'demo@hitl.system',
  'creator',
  'system:demo'
)
ON CONFLICT (id) DO NOTHING;

-- ── Demo hunt ─────────────────────────────────────────────────
INSERT INTO hunts (id, title, description, creator_id, status)
VALUES (
  '00000000-0000-0000-0000-000000000010',
  'Ίχνη στο Άλσος — Η Ιστορία του ΠΑΔΑ',
  E'Ένα κυνήγι θησαυρού που αφηγείται την ιστορία του ιδρύματος: από τα ΤΕΙ Αθήνας και Πειραιά ώς το σύγχρονο Πανεπιστήμιο Δυτικής Αττικής. Έξι σταθμοί, μία ιστορία.\n\nA treasure hunt through the institution\'s history — from the TEI years to today\'s UNIWA. Six stops, one story.',
  '00000000-0000-0000-0000-000000000001',
  'active'
)
ON CONFLICT (id) DO NOTHING;

-- ── Clue 1 — Main gate: the new name ─────────────────────────
-- Answer: Πανεπιστήμιο Δυτικής Αττικής
INSERT INTO clues (id, hunt_id, sequence, title, body, answer_type, answer_value,
                   answer_tolerance, hint_unlock_after_minutes, hint_unlock_after_attempts)
VALUES (
  '00000000-0000-0000-0000-000000000101',
  '00000000-0000-0000-0000-000000000010',
  1,
  'Σταθμός Α — Το Νέο Όνομα',
  E'Βρίσκεσαι στην κεντρική είσοδο στην οδό Αγίου Σπυρίδωνος. Το 2018 αυτό το campus απέκτησε ένα νέο όνομα — το πρώτο πανεπιστήμιο που γεννήθηκε από τη συγχώνευση δύο ΤΕΙ στην Ελλάδα. Τι γράφει η επίσημη πινακίδα στην κεντρική πύλη;',
  'text',
  'Πανεπιστήμιο Δυτικής Αττικής',
  0.75,
  3,
  2
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO hints (clue_id, sequence, body) VALUES
  ('00000000-0000-0000-0000-000000000101', 1,
   'Κοίτα ψηλά στην πρόσοψη — το πλήρες ελληνικό όνομα του ιδρύματος, όχι το ακρωνύμιο.'),
  ('00000000-0000-0000-0000-000000000101', 2,
   'Το ακρωνύμιο ΠΑΔΑ αντιστοιχεί στο πλήρες όνομα — γράψε το εκτεταμένο.')
ON CONFLICT DO NOTHING;

-- ── Clue 2 — The four streets: campus boundaries ─────────────
-- Answer: Δημητσάνης (one of the 4 bounding streets, least obvious)
INSERT INTO clues (id, hunt_id, sequence, title, body, answer_type, answer_value,
                   answer_tolerance, hint_unlock_after_minutes, hint_unlock_after_attempts)
VALUES (
  '00000000-0000-0000-0000-000000000102',
  '00000000-0000-0000-0000-000000000010',
  2,
  'Σταθμός Β — Τα Όρια',
  E'Το campus του Άλσους Αιγάλεω ορίζεται από τέσσερις οδούς που το περικλείουν σαν πλαίσιο. Τρεις είναι προφανείς αν κοιτάξεις τις πινακίδες γύρω σου — αλλά μία κρύβεται στην ανατολική πλευρά, κοντά στα πευκόδεντρα. Πώς ονομάζεται η λιγότερο ορατή από τις τέσσερις οδούς που οριοθετούν το campus; (βόρεια / ανατολική πλευρά)',
  'text',
  'Δημητσάνης',
  0.80,
  5,
  3
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO hints (clue_id, sequence, body) VALUES
  ('00000000-0000-0000-0000-000000000102', 1,
   'Οι τέσσερις οδοί: Αγίου Σπυρίδωνος, Μήλου, Εδέσσης, και μία ακόμα. Περπάτα τη βόρεια-ανατολική γωνία.'),
  ('00000000-0000-0000-0000-000000000102', 2,
   'Ψάξε πινακίδα οδού κοντά στην ανατολική περίφραξη, κοντά στα πεύκα.')
ON CONFLICT DO NOTHING;

-- ── Clue 3 — ZB building: Electrical & Electronics Engineering
-- Answer: ZB107 ή ZB109 (or the dept name on the door)
INSERT INTO clues (id, hunt_id, sequence, title, body, answer_type, answer_value,
                   answer_tolerance, hint_unlock_after_minutes, hint_unlock_after_attempts)
VALUES (
  '00000000-0000-0000-0000-000000000103',
  '00000000-0000-0000-0000-000000000010',
  3,
  'Σταθμός Γ — Η Σχολή των Μηχανικών',
  E'Στο κτίριο ΖΒ έχουν διδαχθεί γενιές μηχανικών. Βρες τις αίθουσες ΖΒ107 και ΖΒ109 — δύο αίθουσες που γνώρισαν αμέτρητες ώρες μαθημάτων ηλεκτρολογίας και ηλεκτρονικής. Ποιο τμήμα στεγάζεται στο κτίριο ΖΒ; Γράψε το πλήρες όνομα όπως αναγράφεται στην πινακίδα.',
  'text',
  'Ηλεκτρολόγων και Ηλεκτρονικών Μηχανικών',
  0.70,
  4,
  3
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO hints (clue_id, sequence, body) VALUES
  ('00000000-0000-0000-0000-000000000103', 1,
   'Ψάξε πινακίδα τμήματος στην είσοδο ή κοντά στις αίθουσες ΖΒ107/ΖΒ109.'),
  ('00000000-0000-0000-0000-000000000103', 2,
   'Το τμήμα ανήκει στη Σχολή Μηχανικών — το όνομα περιέχει τις λέξεις "Ηλεκτρολόγων" και "Μηχανικών".')
ON CONFLICT DO NOTHING;

-- ── Clue 4 — GPS: campus center ──────────────────────────────
INSERT INTO clues (id, hunt_id, sequence, title, body, answer_type, answer_value,
                   answer_tolerance, hint_unlock_after_minutes, hint_unlock_after_attempts)
VALUES (
  '00000000-0000-0000-0000-000000000104',
  '00000000-0000-0000-0000-000000000010',
  4,
  'Σταθμός Δ — Η Καρδιά του Campus',
  E'Βρίσκεσαι στο γεωγραφικό κέντρο του Άλσους Αιγάλεω — εκεί όπου οι δρόμοι του campus συναντώνται και οι φοιτητές ξεκουράζονται ανάμεσα στα μαθήματα. Πάτα «Επιβεβαίωση τοποθεσίας» όταν φτάσεις στο κεντρικό ανοιχτό χώρο.',
  'gps',
  '38.00287,23.67572',
  40,
  3,
  1
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO hints (clue_id, sequence, body) VALUES
  ('00000000-0000-0000-0000-000000000104', 1,
   'Ακολούθησε τον κεντρικό πεζόδρομο μέσα στο campus — ο ανοιχτός χώρος είναι περίπου στο μέσον.'),
  ('00000000-0000-0000-0000-000000000104', 2,
   'Ψάξε κοντά σε παγκάκια ή φυτεμένες περιοχές — εκεί είναι το κέντρο βαρύτητας του campus.')
ON CONFLICT DO NOTHING;

-- ── Clue 5 — Library: name and size ──────────────────────────
-- Answer: 2 (floors) or the full library name
INSERT INTO clues (id, hunt_id, sequence, title, body, answer_type, answer_value,
                   answer_tolerance, hint_unlock_after_minutes, hint_unlock_after_attempts)
VALUES (
  '00000000-0000-0000-0000-000000000105',
  '00000000-0000-0000-0000-000000000010',
  5,
  'Σταθμός Ε — Η Μνήμη του Ιδρύματος',
  E'Η βιβλιοθήκη του campus είναι ένα κτίριο δύο ορόφων με 2.520 τ.μ. γνώσης. Το επίσημο όνομά της αναφέρεται στο φυσικό τοπίο που περιβάλλει το ίδρυμα. Πώς ονομάζεται επίσημα η βιβλιοθήκη; (βρες την πινακίδα ή το λογότυπο στην είσοδο)',
  'text',
  'Βιβλιοθήκη Πανεπιστημιούπολης Άλσους Αιγάλεω',
  0.70,
  5,
  3
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO hints (clue_id, sequence, body) VALUES
  ('00000000-0000-0000-0000-000000000105', 1,
   'Το όνομα συνδυάζει τη λέξη "Βιβλιοθήκη" με κάτι που περιγράφει τη θέση της — το πράσινο τοπίο γύρω.'),
  ('00000000-0000-0000-0000-000000000105', 2,
   'Το "Άλσος" στο όνομα παραπέμπει στο δάσος / πάρκο που περιβάλλει το campus.')
ON CONFLICT DO NOTHING;

-- ── Clue 6 — Conference hall: seat count and founding year ───
-- Answer: 2018 (founding year) or 344 (seats)
INSERT INTO clues (id, hunt_id, sequence, title, body, answer_type, answer_value,
                   answer_tolerance, hint_unlock_after_minutes, hint_unlock_after_attempts)
VALUES (
  '00000000-0000-0000-0000-000000000106',
  '00000000-0000-0000-0000-000000000010',
  6,
  'Σταθμός ΣΤ — Η Αίθουσα της Ιστορίας',
  E'Το μεγαλύτερο αμφιθέατρο του campus μπορεί να φιλοξενήσει 344 άτομα και διαθέτει σκηνή 55 τ.μ. Εδώ έγιναν οι πρώτες επίσημες εκδηλώσεις του νέου πανεπιστημίου μετά τη συγχώνευση. Ποιο έτος ιδρύθηκε επίσημα το Πανεπιστήμιο Δυτικής Αττικής μέσω αυτής της συγχώνευσης;',
  'text',
  '2018',
  0.95,
  4,
  2
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO hints (clue_id, sequence, body) VALUES
  ('00000000-0000-0000-0000-000000000106', 1,
   'Το ΠΑΔΑ δημιουργήθηκε με Προεδρικό Διάταγμα — ψάξε πινακίδα ή αναμνηστική πλάκα κοντά στην κεντρική αίθουσα.'),
  ('00000000-0000-0000-0000-000000000106', 2,
   'Η συγχώνευση ΤΕΙ Αθήνας + ΤΕΙ Πειραιά έγινε επίσημα την 1η Μαρτίου αυτής της χρονιάς.')
ON CONFLICT DO NOTHING;
