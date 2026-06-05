import { useState } from "react";
import { chapters, glossary } from "./chapters.js";

const tagColors = {
  BASICS:    { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  "ON-PAGE": { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  TECHNICAL: { bg: "#faf5ff", text: "#6d28d9", border: "#ddd6fe" },
  "OFF-PAGE":{ bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
  LOCAL:     { bg: "#fff1f2", text: "#be123c", border: "#fecdd3" },
  AEO:       { bg: "#ecfeff", text: "#0e7490", border: "#a5f3fc" },
  GEO:       { bg: "#f0fdfa", text: "#0f766e", border: "#99f6e4" },
  HEO:       { bg: "#faf5ff", text: "#6d28d9", border: "#ddd6fe" },
  ANALYTICS: { bg: "#f7fee7", text: "#4d7c0f", border: "#d9f99d" },
  ADVANCED:  { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  STRATEGY:  { bg: "#eef2ff", text: "#4338ca", border: "#c7d2fe" },
};

const diffColors = {
  Beginner:     { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  Intermediate: { bg: "#fffbeb", text: "#92400e", border: "#fde68a" },
  Advanced:     { bg: "#fff1f2", text: "#9f1239", border: "#fecdd3" },
};

const s = {
  // Layout
  page: { minHeight: "100vh", background: "var(--bg)", color: "var(--text-1)" },
  // Nav
  nav: { background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "0 32px", display: "flex", alignItems: "center", gap: "16px", height: "52px", position: "sticky", top: 0, zIndex: 100 },
  navBack: { background: "none", border: "1px solid var(--border-2)", color: "var(--text-2)", padding: "5px 14px", borderRadius: "6px", fontSize: "13px", cursor: "pointer" },
  navBreadcrumb: { fontSize: "13px", color: "var(--text-3)", display: "flex", alignItems: "center", gap: "8px" },
  // Hero
  hero: { borderBottom: "1px solid var(--border)", padding: "80px 48px 64px", maxWidth: "1200px", margin: "0 auto" },
  heroLabel: { fontSize: "11px", letterSpacing: "0.15em", color: "var(--text-3)", textTransform: "uppercase", marginBottom: "20px", fontFamily: "var(--font-sans)", fontWeight: 500 },
  heroTitle: { fontFamily: "var(--font-serif)", fontSize: "52px", fontWeight: 400, margin: "0 0 16px", color: "var(--text-1)", letterSpacing: "-1px", lineHeight: 1.1 },
  heroSub: { fontSize: "17px", color: "var(--text-2)", margin: "0 0 40px", lineHeight: 1.6, maxWidth: "560px" },
  statsRow: { display: "flex", gap: "0", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", width: "fit-content" },
  statBox: { padding: "16px 28px", borderRight: "1px solid var(--border)", textAlign: "center" },
  statNum: { fontSize: "22px", fontWeight: 600, color: "var(--text-1)", display: "block" },
  statLabel: { fontSize: "11px", color: "var(--text-3)", marginTop: "2px", letterSpacing: "0.1em", textTransform: "uppercase", display: "block" },
  // Progress bar
  progBar: { maxWidth: "420px", marginTop: "24px" },
  progTrack: { height: "3px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" },
  // Grid
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1px", background: "var(--border)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" },
  card: { background: "var(--bg)", padding: "28px", cursor: "pointer", transition: "background 0.15s", display: "flex", flexDirection: "column", gap: "12px" },
  cardHover: { background: "var(--bg-2)" },
  // Chapter detail
  chLayout: { display: "flex", minHeight: "calc(100vh - 52px)" },
  sidebar: { width: "220px", flexShrink: 0, borderRight: "1px solid var(--border)", padding: "24px 0", position: "sticky", top: "52px", height: "calc(100vh - 52px)", overflowY: "auto" },
  sideItem: { display: "block", width: "100%", textAlign: "left", background: "none", border: "none", padding: "9px 20px", fontSize: "13px", cursor: "pointer", color: "var(--text-3)", lineHeight: 1.4 },
  sideItemActive: { color: "var(--text-1)", fontWeight: 500, background: "var(--bg-2)" },
  content: { flex: 1, padding: "48px 64px", maxWidth: "760px" },
  // Tab bar
  tabs: { display: "flex", gap: "0", borderBottom: "1px solid var(--border)", marginBottom: "40px" },
  tab: { background: "none", border: "none", borderBottom: "2px solid transparent", padding: "10px 20px", fontSize: "14px", cursor: "pointer", color: "var(--text-3)", marginBottom: "-1px" },
  // Exercise card
  exCard: { border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", marginBottom: "12px" },
  exHead: { padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: "14px", cursor: "pointer" },
  exBody: { borderTop: "1px solid var(--border)", padding: "20px 20px 20px 54px", background: "var(--bg-2)" },
  // Tag pill
  pill: { display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: "5px", fontSize: "11px", fontWeight: 500, letterSpacing: "0.05em", border: "1px solid" },
};

function Tag({ tag }) {
  const c = tagColors[tag] || tagColors.BASICS;
  return <span style={{ ...s.pill, background: c.bg, color: c.text, borderColor: c.border }}>{tag}</span>;
}

function DiffBadge({ diff }) {
  const c = diffColors[diff] || diffColors.Beginner;
  return <span style={{ ...s.pill, background: c.bg, color: c.text, borderColor: c.border }}>{diff}</span>;
}

function Check({ done, accent, onClick }) {
  return (
    <button onClick={onClick} style={{ width: "22px", height: "22px", borderRadius: "50%", border: `1.5px solid ${done ? accent : "var(--border-2)"}`, background: done ? accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", marginTop: "1px", transition: "all 0.15s" }}>
      {done && <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="M1 4l3 3 6-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </button>
  );
}

function ChapterDetail({ chapter, onBack, completed, onToggle }) {
  const [section, setSection] = useState(0);
  const [tab, setTab] = useState("content");
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={s.page}>
      <div style={s.nav}>
        <button style={s.navBack} onClick={onBack}>← Back</button>
        <div style={s.navBreadcrumb}>
          <span style={{ color: "var(--text-3)" }}>SEO Mastery 2026</span>
          <span style={{ color: "var(--border-2)" }}>›</span>
          <span style={{ color: "var(--text-2)" }}>Chapter {chapter.id}: {chapter.title}</span>
        </div>
        <Tag tag={chapter.tag} />
      </div>

      <div style={s.chLayout}>
        {/* Sidebar */}
        <aside style={s.sidebar}>
          <div style={{ padding: "0 20px 16px", borderBottom: "1px solid var(--border)", marginBottom: "8px" }}>
            <button onClick={() => setTab("content")} style={{ ...s.sideItem, padding: "6px 0", borderBottom: tab === "content" ? `2px solid ${chapter.accent}` : "2px solid transparent", color: tab === "content" ? chapter.accent : "var(--text-3)", fontWeight: tab === "content" ? 500 : 400, display: "block", width: "100%", textAlign: "left" }}>Sections</button>
            <button onClick={() => setTab("exercises")} style={{ ...s.sideItem, padding: "6px 0", borderBottom: tab === "exercises" ? `2px solid ${chapter.accent}` : "2px solid transparent", color: tab === "exercises" ? chapter.accent : "var(--text-3)", fontWeight: tab === "exercises" ? 500 : 400, display: "block", width: "100%", textAlign: "left", marginTop: "8px" }}>Exercises ({chapter.exercises.length})</button>
          </div>
          {tab === "content" && chapter.sections.map((sec, i) => (
            <button key={i} onClick={() => setSection(i)} style={{ ...s.sideItem, ...(section === i ? s.sideItemActive : {}), borderLeft: section === i ? `2px solid ${chapter.accent}` : "2px solid transparent" }}>
              {sec.heading}
            </button>
          ))}
          {tab === "exercises" && chapter.exercises.map((ex, ei) => {
            const key = `${chapter.id}-${ei}`;
            const done = completed[key];
            return (
              <button key={ei} onClick={() => { setExpanded(expanded === key ? null : key); }} style={{ ...s.sideItem, display: "flex", alignItems: "center", gap: "8px", color: done ? chapter.accent : "var(--text-3)" }}>
                <span style={{ fontSize: "10px" }}>{done ? "✓" : "○"}</span>
                <span>{ex.title}</span>
              </button>
            );
          })}
        </aside>

        {/* Main content */}
        <main style={s.content}>
          {tab === "content" && (
            <>
              <div style={{ fontSize: "12px", color: "var(--text-3)", marginBottom: "8px", fontFamily: "var(--font-sans)" }}>
                {section + 1} of {chapter.sections.length}
              </div>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", fontWeight: 400, margin: "0 0 32px", color: "var(--text-1)", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
                {chapter.sections[section].heading}
              </h1>
              <div>
                {chapter.sections[section].content.split('\n').map((line, i) => {
                  if (line === '') return <div key={i} style={{ height: "12px" }} />;
                  if (/^[A-Z][A-Z\s\/\-]{3,}:$/.test(line.trim())) {
                    return <div key={i} style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "24px", marginBottom: "8px", paddingBottom: "6px", borderBottom: "1px solid var(--border)" }}>{line.replace(/:$/, '')}</div>;
                  }
                  if (line.startsWith('• ')) {
                    return <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "6px", paddingLeft: "4px" }}>
                      <span style={{ color: chapter.accent, flexShrink: 0, marginTop: "2px", fontSize: "14px" }}>·</span>
                      <span style={{ fontSize: "15px", color: "var(--text-2)", lineHeight: 1.65 }}>{line.slice(2)}</span>
                    </div>;
                  }
                  if (/^\d+\. /.test(line)) {
                    const num = line.match(/^\d+/)[0];
                    const rest = line.replace(/^\d+\. /, '');
                    return <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "8px", paddingLeft: "4px" }}>
                      <span style={{ color: chapter.accent, fontWeight: 600, flexShrink: 0, fontFamily: "var(--font-sans)", fontSize: "13px", minWidth: "18px", marginTop: "2px" }}>{num}.</span>
                      <span style={{ fontSize: "15px", color: "var(--text-2)", lineHeight: 1.65 }}>{rest}</span>
                    </div>;
                  }
                  return <p key={i} style={{ fontSize: "15px", color: "var(--text-2)", lineHeight: 1.75, margin: "0 0 10px" }}>{line}</p>;
                })}
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "48px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
                {section > 0 && <button onClick={() => setSection(section - 1)} style={{ background: "none", border: "1px solid var(--border-2)", color: "var(--text-2)", padding: "8px 18px", borderRadius: "7px", cursor: "pointer", fontSize: "13px" }}>← Previous</button>}
                {section < chapter.sections.length - 1
                  ? <button onClick={() => setSection(section + 1)} style={{ background: chapter.accent, border: "none", color: "#fff", padding: "8px 18px", borderRadius: "7px", cursor: "pointer", fontSize: "13px" }}>Next section →</button>
                  : <button onClick={() => setTab("exercises")} style={{ background: chapter.accent, border: "none", color: "#fff", padding: "8px 18px", borderRadius: "7px", cursor: "pointer", fontSize: "13px" }}>Go to exercises →</button>
                }
              </div>
            </>
          )}

          {tab === "exercises" && (
            <>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 400, margin: "0 0 8px", color: "var(--text-1)" }}>Exercises</h1>
              <p style={{ color: "var(--text-3)", fontSize: "14px", margin: "0 0 32px" }}>Work through these alongside the chapter content. Click the circle to mark complete.</p>
              {chapter.exercises.map((ex, ei) => {
                const key = `${chapter.id}-${ei}`;
                const done = completed[key];
                const isOpen = expanded === key;
                return (
                  <div key={ei} style={{ ...s.exCard, borderColor: done ? "#bbf7d0" : "var(--border)", background: done ? "#f0fdf4" : "var(--bg)" }}>
                    <div style={s.exHead} onClick={() => setExpanded(isOpen ? null : key)}>
                      <Check done={done} accent={chapter.accent} onClick={e => { e.stopPropagation(); onToggle(key); }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "5px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "15px", fontWeight: 500, color: done ? "#15803d" : "var(--text-1)" }}>{ex.title}</span>
                          <DiffBadge diff={ex.difficulty} />
                          <span style={{ fontSize: "12px", color: "var(--text-3)" }}>⏱ {ex.time}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-3)", lineHeight: 1.4 }}>{ex.goal}</p>
                      </div>
                      <span style={{ color: "var(--text-3)", fontSize: "12px", flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                    {isOpen && (
                      <div style={s.exBody}>
                        <div style={{ fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px", fontWeight: 500 }}>Task</div>
                        <p style={{ margin: "0 0 16px", fontSize: "14px", color: "var(--text-2)", lineHeight: 1.7 }}>{ex.task}</p>
                        <button onClick={() => onToggle(key)} style={{ background: done ? "#f0fdf4" : chapter.accent, border: `1px solid ${done ? "#86efac" : "transparent"}`, color: done ? "#15803d" : "#fff", padding: "7px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
                          {done ? "✓ Marked complete — undo?" : "Mark as complete"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState(null);
  const [completed, setCompleted] = useState({});
  const [view, setView] = useState("chapters"); // chapters | glossary

  const toggle = key => setCompleted(p => ({ ...p, [key]: !p[key] }));

  const totalEx = chapters.reduce((a, c) => a + c.exercises.length, 0);
  const doneCount = Object.values(completed).filter(Boolean).length;
  const pct = Math.round((doneCount / totalEx) * 100);

  if (active !== null) {
    return <ChapterDetail chapter={chapters[active]} onBack={() => setActive(null)} completed={completed} onToggle={toggle} />;
  }

  return (
    <div style={s.page}>
      {/* Sticky nav */}
      <div style={{ ...s.nav, justifyContent: "space-between" }}>
        <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-1)", letterSpacing: "-0.3px" }}>SEO Mastery 2026</div>
        <div style={{ display: "flex", gap: "4px" }}>
          {["chapters", "glossary"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ background: view === v ? "var(--bg-3)" : "none", border: "1px solid " + (view === v ? "var(--border-2)" : "transparent"), color: view === v ? "var(--text-1)" : "var(--text-3)", padding: "5px 14px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", textTransform: "capitalize" }}>{v}</button>
          ))}
        </div>
      </div>

      {view === "chapters" && (
        <>
          {/* Hero */}
          <div style={s.hero}>
            <div style={s.heroLabel}>Complete Study Guide · 2026 Edition</div>
            <h1 style={s.heroTitle}>SEO Mastery<br />2026</h1>
            <p style={s.heroSub}>Every discipline covered — SEO, AEO, GEO, HEO, Technical, Local, Analytics, and Strategy. Theory and practice, chapter by chapter.</p>
            <div style={s.statsRow}>
              <div style={s.statBox}><span style={s.statNum}>{chapters.length}</span><span style={s.statLabel}>Chapters</span></div>
              <div style={s.statBox}><span style={s.statNum}>{totalEx}</span><span style={s.statLabel}>Exercises</span></div>
              <div style={{ ...s.statBox, borderRight: "none" }}><span style={{ ...s.statNum, color: doneCount > 0 ? "#15803d" : "var(--text-1)" }}>{doneCount}/{totalEx}</span><span style={s.statLabel}>Completed</span></div>
            </div>
            {doneCount > 0 && (
              <div style={s.progBar}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-3)" }}>Progress</span>
                  <span style={{ fontSize: "12px", color: "#15803d", fontWeight: 500 }}>{pct}%</span>
                </div>
                <div style={s.progTrack}><div style={{ width: `${pct}%`, height: "100%", background: "#4ade80", transition: "width 0.4s ease" }} /></div>
              </div>
            )}
          </div>

          {/* Chapter grid */}
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 48px 80px" }}>
            <div style={s.grid}>
              {chapters.map((ch, i) => {
                const chDone = ch.exercises.filter((_, ei) => completed[`${ch.id}-${ei}`]).length;
                return (
                  <div key={i}
                    style={s.card}
                    onClick={() => setActive(i)}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "var(--bg)"}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{ fontSize: "11px", color: "var(--text-3)", fontFamily: "var(--font-sans)", letterSpacing: "0.08em" }}>CH {String(ch.id).padStart(2, "0")}</span>
                      <Tag tag={ch.tag} />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "19px", fontWeight: 400, margin: "0 0 6px", color: "var(--text-1)", lineHeight: 1.25 }}>{ch.title}</h3>
                      <p style={{ margin: 0, fontSize: "12px", color: "var(--text-3)" }}>{ch.sections.length} sections · {ch.exercises.length} exercises</p>
                    </div>
                    {chDone > 0 && (
                      <div>
                        <div style={{ height: "2px", background: "var(--border)", borderRadius: "1px", overflow: "hidden" }}>
                          <div style={{ width: `${(chDone / ch.exercises.length) * 100}%`, height: "100%", background: ch.accent }} />
                        </div>
                        <span style={{ fontSize: "11px", color: ch.accent, marginTop: "4px", display: "block" }}>{chDone}/{ch.exercises.length} done</span>
                      </div>
                    )}
                    <div style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "auto" }}>Open →</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {view === "glossary" && (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 48px 80px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "36px", fontWeight: 400, margin: "0 0 8px" }}>Glossary</h2>
          <p style={{ color: "var(--text-3)", margin: "0 0 40px", fontSize: "15px" }}>Every acronym and term used in this guide, defined.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
            {glossary.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "24px", alignItems: "flex-start", padding: "16px 20px", background: "var(--bg)", borderBottom: i < glossary.length - 1 ? "1px solid var(--border)" : "none" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--bg-2)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--bg)"}>
                <div style={{ width: "80px", flexShrink: 0 }}>
                  <code style={{ fontSize: "13px", fontWeight: 600, color: chapters[item.ch - 1]?.accent || "#6366f1", background: "var(--bg-2)", padding: "3px 7px", borderRadius: "4px" }}>{item.term}</code>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-1)", marginBottom: "2px" }}>{item.full}</div>
                  <div style={{ fontSize: "13px", color: "var(--text-3)", lineHeight: 1.5 }}>{item.desc}</div>
                </div>
                <button onClick={() => setActive(item.ch - 1)} style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-3)", padding: "4px 10px", borderRadius: "5px", cursor: "pointer", fontSize: "11px", flexShrink: 0 }}>
                  Ch. {item.ch} →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
