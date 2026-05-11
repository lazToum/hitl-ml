const CHAPTERS = [
  { num: '01', slug: '01_building_hitl',   title: 'Building HITL Systems',            desc: 'What does it mean to put a human in the loop? The system requirements and architectural decisions that follow.' },
  { num: '02', slug: '02_five_dimensions', title: 'Five Dimensions of HITL',          desc: 'A framework for understanding HITL systems across five axes: task, feedback, latency, authority, and transparency.' },
  { num: '03', slug: '03_schema',          title: 'Database Schema Design',            desc: 'From domain model to Postgres schema. How the hunt, clue, session, and event tables relate.' },
  { num: '04', slug: '04_api',             title: 'The API Layer: Rust and Axum',      desc: 'The Rust/Axum backend: routing, extractors, error handling, and the shape of every endpoint.' },
  { num: '05', slug: '05_auth',            title: 'Authentication with Zitadel & OIDC', desc: 'Identity without passwords. How Zitadel, OIDC, and JWT tokens create a roles-based auth system.' },
  { num: '06', slug: '06_validation',      title: 'Answer Validation',                 desc: 'How the server decides whether a player\'s answer is correct across text, GPS, and photo types.' },
  { num: '07', slug: '07_hints',           title: 'The Hint System',                   desc: 'Progressive hints as a feedback mechanism. The tradeoffs between helping players and preserving data quality.' },
  { num: '08', slug: '08_ai',              title: 'AI Assistance',                     desc: 'Where AI enters the loop: clue generation, difficulty estimation, and session analysis via the Python service.' },
  { num: '09', slug: '09_creator',         title: 'The Creator\'s Perspective',        desc: 'The creator dashboard, ReactFlow clue editor, GPS map picker, and what it means to encode judgment as hunt design.' },
  { num: '10', slug: '10_player',          title: 'The Player\'s Perspective',         desc: 'The web player interface, GPS proximity map, Babylon.js celebration, and the player as unwitting data labeler.' },
  { num: '11', slug: '11_observer',        title: 'The Observer\'s Perspective',       desc: 'Live event feed, pause/buffer/filter controls, AI session analysis, and supervisory control in HITL systems.' },
  { num: '12', slug: '12_physical',        title: 'Physical Interaction & NFC',        desc: 'Where the digital meets the physical: QR codes, NFC tags, and the challenges of location-dependent systems.' },
  { num: '13', slug: '13_testing',         title: 'Testing Strategy',                  desc: 'Testing a system where human behavior is part of the spec. Unit, integration, and simulation approaches.' },
  { num: '14', slug: '14_deployment',      title: 'Deployment',                        desc: 'Docker Compose, reverse proxies, environment parity, and what "production-ready" means for a HITL system.' },
  { num: '15', slug: '15_reflection',      title: 'Reflection',                        desc: 'Looking back across the whole system: what we built, what it reveals about HITL ML, and what we left unresolved.' },
]

const HANDBOOK_BASE_URL = 'http://localhost:8082'

export default function Learn() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1e2a5e 0%, #2b3a8f 50%, #1a2c6b 100%)',
        padding: '64px 32px 56px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,.08)',
      }}>
        <div style={{ fontSize: '2.8rem', marginBottom: 12 }}>📚</div>
        <h1 style={{
          margin: 0,
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          fontWeight: 800,
          letterSpacing: '-.02em',
          color: '#fff',
        }}>
          Spring Handbook
        </h1>
        <p style={{
          margin: '10px 0 0',
          fontSize: 'clamp(1rem, 2vw, 1.15rem)',
          color: 'rgba(255,255,255,.6)',
          fontStyle: 'italic',
        }}>
          Human in the Loop: Why the Smartest Machines Still Need Us
        </p>
        <p style={{
          margin: '18px auto 0',
          maxWidth: 560,
          fontSize: 14,
          color: 'rgba(255,255,255,.45)',
          lineHeight: 1.6,
        }}>
          15 chapters that use this treasure hunt app as a living case study for understanding
          human-in-the-loop machine learning systems.
        </p>
      </div>

      {/* Chapter grid */}
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '48px 24px 64px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
        }}>
          {CHAPTERS.map(ch => (
            <div
              key={ch.slug}
              style={{
                background: 'rgba(255,255,255,.05)',
                border: '1px solid rgba(255,255,255,.09)',
                borderRadius: 12,
                padding: '22px 22px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                transition: 'border-color 200ms ease, background 200ms ease',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,130,245,.5)'
                ;(e.currentTarget as HTMLDivElement).style.background  = 'rgba(255,255,255,.08)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,.09)'
                ;(e.currentTarget as HTMLDivElement).style.background  = 'rgba(255,255,255,.05)'
              }}
            >
              {/* Chapter number */}
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.1em',
                color: 'rgba(99,130,245,.8)',
                textTransform: 'uppercase',
              }}>
                Chapter {ch.num}
              </div>

              {/* Title */}
              <div style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#f1f5f9',
                lineHeight: 1.3,
              }}>
                {ch.title}
              </div>

              {/* Description */}
              <div style={{
                fontSize: 13,
                color: 'rgba(255,255,255,.45)',
                lineHeight: 1.55,
                flex: 1,
              }}>
                {ch.desc}
              </div>

              {/* Read link */}
              <a
                href={`${HANDBOOK_BASE_URL}/chapters/${ch.slug}.html`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#7c8ff5',
                  textDecoration: 'none',
                  marginTop: 4,
                }}
              >
                Read →
              </a>
            </div>
          ))}
        </div>

        {/* Build note */}
        <div style={{
          marginTop: 56,
          padding: '20px 24px',
          background: 'rgba(255,255,255,.04)',
          border: '1px solid rgba(255,255,255,.08)',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 14,
        }}>
          <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>🛠</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,.8)', marginBottom: 4 }}>
              Build &amp; Serve the handbook
            </div>
            <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,.45)', lineHeight: 1.6 }}>
              Run <code style={{ background: 'rgba(255,255,255,.1)', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace' }}>make spring-serve</code> from the project root to build the Jupyter Book and start the handbook at{' '}
              <a href={HANDBOOK_BASE_URL} target="_blank" rel="noreferrer" style={{ color: '#7c8ff5' }}>localhost:8082</a>.
              The "Read →" links above open the matching generated chapter pages once the server is running.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
