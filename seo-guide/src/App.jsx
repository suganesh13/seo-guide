import { useState } from "react";
import { chapters, glossary } from "./chapters.js";

const tagColors = {
  BASICS:    "#3b82f6",
  "ON-PAGE": "#22c55e",
  TECHNICAL: "#a78bfa",
  "OFF-PAGE":"#f59e0b",
  LOCAL:     "#fb7185",
  AEO:       "#38bdf8",
  GEO:       "#2dd4bf",
  HEO:       "#c084fc",
  ANALYTICS: "#86efac",
  ADVANCED:  "#f97316",
  STRATEGY:  "#818cf8",
};

const diffBg = {
  Beginner:     { bg: "#14532d", text: "#4ade80" },
  Intermediate: { bg: "#78350f", text: "#fcd34d" },
  Advanced:     { bg: "#7f1d1d", text: "#fca5a5" },
};

function Tag({ tag, small }) {
  const color = tagColors[tag] || "#888";
  return (
    <span style={{ display: "inline-block", padding: small ? "2px 7px" : "3px 9px", borderRadius: "4px", fontSize: small ? "10px" : "11px", fontWeight: 600, letterSpacing: "0.06em", border: `1px solid ${color}33`, background: `${color}18`, color }}>
      {tag}
    </span>
  );
}

function Pill({ label, colors }) {
  return (
    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 500, background: colors.bg, color: colors.text }}>
      {label}
    </span>
  );
}

function Check({ done, accent, onClick }) {
  return (
    <button onClick={onClick} style={{ width: "20px", height: "20px", borderRadius: "50%", border: `1.5px solid ${done ? accent : "#4a4743"}`, background: done ? accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", transition: "all 0.15s" }}>
      {done && <svg width="10" height="7" viewBox="0 0 10 7" fill="none"><path d="M1 3.5l2.5 2.5 5.5-5" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </button>
  );
}

function ContentRenderer({ content, accent }) {
  return (
    <div>
      {content.split('\n').map((line, i) => {
        if (line === '') return <div key={i} style={{ height: "10px" }} />;
        if (/^[A-Z][A-Z\s\/\-]{3,}(\s—\s.*)?$/.test(line.trim()) && line.length < 80 && !line.startsWith('•') && !line.match(/^\d/)) {
          const parts = line.split(' — ');
          return (
            <div key={i} style={{ marginTop: "20px", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>{parts[0]}</span>
              {parts[1] && <span style={{ fontSize: "13px", color: "var(--text-3)", marginLeft: "8px" }}>{parts[1]}</span>}
            </div>
          );
        }
        if (line.startsWith('• ')) return (
          <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "5px", paddingLeft: "4px" }}>
            <span style={{ color: accent, flexShrink: 0, marginTop: "3px", fontSize: "12px" }}>▸</span>
            <span style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.7 }}>{line.slice(2)}</span>
          </div>
        );
        if (/^\d+\. /.test(line)) {
          const num = line.match(/^\d+/)[0];
          const rest = line.replace(/^\d+\. /, '');
          return (
            <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "7px", paddingLeft: "4px" }}>
              <span style={{ color: accent, fontWeight: 700, flexShrink: 0, fontSize: "12px", minWidth: "18px", marginTop: "3px", fontFamily: "monospace" }}>{num}.</span>
              <span style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.7 }}>{rest}</span>
            </div>
          );
        }
        return <p key={i} style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.8, margin: "0 0 8px" }}>{line}</p>;
      })}
    </div>
  );
}

function TipsPanel({ tips, accent }) {
  return (
    <div style={{ marginTop: "28px", background: `${accent}0d`, border: `1px solid ${accent}25`, borderRadius: "10px", padding: "16px 20px" }}>
      <div style={{ fontSize: "11px", fontWeight: 700, color: accent, letterSpacing: "0.12em", marginBottom: "12px" }}>PRO TIPS</div>
      {tips.map((tip, i) => (
        <div key={i} style={{ display: "flex", gap: "10px", marginBottom: i < tips.length - 1 ? "10px" : 0, paddingBottom: i < tips.length - 1 ? "10px" : 0, borderBottom: i < tips.length - 1 ? `1px solid ${accent}18` : "none" }}>
          <span style={{ color: accent, fontSize: "14px", flexShrink: 0 }}>→</span>
          <span style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.65 }}>{tip}</span>
        </div>
      ))}
    </div>
  );
}

function CaseStudyPanel({ cs, accent }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: "20px", border: `1px solid ${accent}30`, borderRadius: "10px", overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: `${accent}10`, border: "none", cursor: "pointer", textAlign: "left" }}>
        <div>
          <div style={{ fontSize: "10px", fontWeight: 700, color: accent, letterSpacing: "0.12em", marginBottom: "2px" }}>CASE STUDY</div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-1)" }}>{cs.company} — <span style={{ color: accent, fontWeight: 400 }}>{cs.result}</span></div>
        </div>
        <span style={{ color: "var(--text-3)", fontSize: "16px", flexShrink: 0, marginLeft: "12px" }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ padding: "16px 18px", background: "var(--bg-2)", borderTop: `1px solid ${accent}20` }}>
          <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.75, margin: 0 }}>{cs.story}</p>
        </div>
      )}
    </div>
  );
}

function ChapterDetail({ chapter, onBack, completed, onToggle }) {
  const [secIdx, setSecIdx] = useState(0);
  const [tab, setTab] = useState("content");
  const [expanded, setExpanded] = useState(null);
  const sec = chapter.sections[secIdx];
  const accent = chapter.accent;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Nav */}
      <div style={{ background: "var(--bg-2)", borderBottom: "1px solid var(--border)", padding: "0 24px", display: "flex", alignItems: "center", gap: "12px", height: "50px", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={onBack} style={{ background: "none", border: `1px solid var(--border-2)`, color: "var(--text-3)", padding: "4px 12px", borderRadius: "5px", fontSize: "12px" }}>← Back</button>
        <span style={{ color: "var(--border-2)", fontSize: "12px" }}>›</span>
        <span style={{ fontSize: "12px", color: "var(--text-3)" }}>Chapter {chapter.id}: {chapter.title}</span>
        <div style={{ marginLeft: "auto" }}><Tag tag={chapter.tag} /></div>
      </div>

      <div style={{ display: "flex", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Sidebar */}
        <aside style={{ width: "210px", flexShrink: 0, borderRight: "1px solid var(--border)", padding: "20px 0", position: "sticky", top: "50px", height: "calc(100vh - 50px)", overflowY: "auto" }}>
          <div style={{ padding: "0 16px 12px", marginBottom: "4px" }}>
            <button onClick={() => setTab("content")} style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", color: tab === "content" ? accent : "var(--text-4)", fontSize: "12px", fontWeight: tab === "content" ? 600 : 400, padding: "5px 0", borderBottom: tab === "content" ? `2px solid ${accent}` : "2px solid transparent", cursor: "pointer" }}>Sections</button>
          </div>
          <div style={{ padding: "0 16px 12px", marginBottom: "8px" }}>
            <button onClick={() => setTab("exercises")} style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", color: tab === "exercises" ? accent : "var(--text-4)", fontSize: "12px", fontWeight: tab === "exercises" ? 600 : 400, padding: "5px 0", borderBottom: tab === "exercises" ? `2px solid ${accent}` : "2px solid transparent", cursor: "pointer" }}>Exercises ({chapter.exercises.length})</button>
          </div>

          {tab === "content" && chapter.sections.map((s, i) => (
            <button key={i} onClick={() => setSecIdx(i)} style={{ display: "block", width: "100%", textAlign: "left", background: secIdx === i ? `${accent}12` : "none", border: "none", borderLeft: secIdx === i ? `2px solid ${accent}` : "2px solid transparent", color: secIdx === i ? "var(--text-1)" : "var(--text-4)", padding: "9px 16px", fontSize: "12px", cursor: "pointer", lineHeight: 1.4 }}>
              {s.heading}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main style={{ flex: 1, padding: "40px 48px 80px", minWidth: 0 }}>
          {tab === "content" && (
            <>
              <div style={{ fontSize: "11px", color: "var(--text-4)", marginBottom: "6px", fontFamily: "monospace" }}>SECTION {secIdx + 1} / {chapter.sections.length}</div>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: 400, margin: "0 0 24px", color: "var(--text-1)", letterSpacing: "-0.3px", lineHeight: 1.25 }}>{sec.heading}</h1>

              <ContentRenderer content={sec.content} accent={accent} />
              {sec.tips && <TipsPanel tips={sec.tips} accent={accent} />}
              {sec.caseStudy && <CaseStudyPanel cs={sec.caseStudy} accent={accent} />}

              <div style={{ display: "flex", gap: "10px", marginTop: "40px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
                {secIdx > 0 && <button onClick={() => setSecIdx(secIdx - 1)} style={{ background: "none", border: "1px solid var(--border-2)", color: "var(--text-3)", padding: "7px 16px", borderRadius: "6px", fontSize: "13px" }}>← Prev</button>}
                {secIdx < chapter.sections.length - 1
                  ? <button onClick={() => setSecIdx(secIdx + 1)} style={{ background: accent, border: "none", color: "#000", padding: "7px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: 600 }}>Next →</button>
                  : <button onClick={() => setTab("exercises")} style={{ background: accent, border: "none", color: "#000", padding: "7px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: 600 }}>Exercises →</button>
                }
              </div>
            </>
          )}

          {tab === "exercises" && (
            <>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "26px", fontWeight: 400, margin: "0 0 6px", color: "var(--text-1)" }}>Exercises</h1>
              <p style={{ color: "var(--text-4)", fontSize: "13px", margin: "0 0 28px" }}>Work alongside the chapter content. Click the circle to mark complete.</p>
              {chapter.exercises.map((ex, ei) => {
                const key = `${chapter.id}-${ei}`;
                const done = completed[key];
                const isOpen = expanded === key;
                const dc = diffBg[ex.difficulty] || diffBg.Beginner;
                return (
                  <div key={ei} style={{ border: `1px solid ${done ? accent + "44" : "var(--border)"}`, borderRadius: "10px", marginBottom: "10px", overflow: "hidden", background: done ? `${accent}08` : "var(--bg-2)" }}>
                    <div style={{ padding: "16px 18px", display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }} onClick={() => setExpanded(isOpen ? null : key)}>
                      <Check done={done} accent={accent} onClick={e => { e.stopPropagation(); onToggle(key); }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "14px", fontWeight: 600, color: done ? accent : "var(--text-1)" }}>{ex.title}</span>
                          <Pill label={ex.difficulty} colors={dc} />
                          <span style={{ fontSize: "11px", color: "var(--text-4)" }}>{ex.time}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: "12px", color: "var(--text-4)", lineHeight: 1.4 }}>{ex.goal}</p>
                      </div>
                      <span style={{ color: "var(--text-4)", fontSize: "11px", flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                    {isOpen && (
                      <div style={{ borderTop: `1px solid var(--border)`, padding: "16px 18px 18px 50px", background: "var(--bg-3)" }}>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-4)", letterSpacing: "0.1em", marginBottom: "8px" }}>TASK</div>
                        <p style={{ margin: "0 0 14px", fontSize: "13px", color: "var(--text-2)", lineHeight: 1.75 }}>{ex.task}</p>
                        <button onClick={() => onToggle(key)} style={{ background: done ? `${accent}20` : accent, border: `1px solid ${done ? accent + "44" : "transparent"}`, color: done ? accent : "#000", padding: "6px 14px", borderRadius: "5px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                          {done ? "✓ Marked complete — undo?" : "Mark complete"}
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
  const [view, setView] = useState("chapters");

  const toggle = key => setCompleted(p => ({ ...p, [key]: !p[key] }));

  const totalEx = chapters.reduce((a, c) => a + c.exercises.length, 0);
  const doneCount = Object.values(completed).filter(Boolean).length;
  const pct = Math.round((doneCount / totalEx) * 100);

  if (active !== null) {
    return <ChapterDetail chapter={chapters[active]} onBack={() => setActive(null)} completed={completed} onToggle={toggle} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Nav */}
      <div style={{ background: "var(--bg-2)", borderBottom: "1px solid var(--border)", padding: "0 32px", display: "flex", alignItems: "center", height: "50px", gap: "8px" }}>
        <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-1)", letterSpacing: "-0.3px", marginRight: "auto" }}>
          <span style={{ color: "#f97316" }}>SEO</span> Mastery 2026
        </div>
        {["chapters", "glossary"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{ background: view === v ? "var(--bg-4)" : "none", border: `1px solid ${view === v ? "var(--border-2)" : "transparent"}`, color: view === v ? "var(--text-1)" : "var(--text-4)", padding: "4px 14px", borderRadius: "5px", fontSize: "12px", cursor: "pointer", textTransform: "capitalize" }}>{v}</button>
        ))}
      </div>

      {view === "chapters" && (
        <>
          {/* Hero */}
          <div style={{ padding: "64px 48px 48px", maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: "var(--text-4)", marginBottom: "16px", fontFamily: "monospace" }}>COMPLETE STUDY GUIDE · 2026 EDITION</div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "52px", fontWeight: 400, margin: "0 0 16px", color: "var(--text-1)", letterSpacing: "-1px", lineHeight: 1.1 }}>
              SEO Mastery<br /><span style={{ color: "#f97316" }}>2026</span>
            </h1>
            <p style={{ color: "var(--text-3)", fontSize: "16px", margin: "0 0 36px", maxWidth: "520px", lineHeight: 1.65 }}>
              SEO · AEO · GEO · HEO · Technical · Local · Analytics · Strategy. Real case studies, pro tips, and hands-on exercises throughout.
            </p>

            {/* Stats */}
            <div style={{ display: "flex", gap: "1px", background: "var(--border)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", width: "fit-content", marginBottom: "24px" }}>
              {[
                { n: chapters.length, l: "Chapters" },
                { n: totalEx, l: "Exercises" },
                { n: chapters.reduce((a, c) => a + c.sections.length, 0), l: "Sections" },
                { n: chapters.reduce((a, c) => a + c.sections.filter(s => s.caseStudy).length, 0), l: "Case Studies" },
                { n: chapters.reduce((a, c) => a + c.sections.filter(s => s.tips).length, 0), l: "Tip Sheets" },
              ].map((s, i) => (
                <div key={i} style={{ padding: "14px 24px", background: "var(--bg-2)", textAlign: "center", minWidth: "90px" }}>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-1)" }}>{s.n}</div>
                  <div style={{ fontSize: "10px", color: "var(--text-4)", marginTop: "2px", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Progress */}
            {doneCount > 0 && (
              <div style={{ maxWidth: "360px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-4)" }}>Progress — {doneCount}/{totalEx} exercises</span>
                  <span style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600 }}>{pct}%</span>
                </div>
                <div style={{ height: "3px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #f97316, #22c55e)", transition: "width 0.4s ease" }} />
                </div>
              </div>
            )}
          </div>

          {/* Chapter grid */}
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px 80px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "10px" }}>
              {chapters.map((ch, i) => {
                const chDone = ch.exercises.filter((_, ei) => completed[`${ch.id}-${ei}`]).length;
                const caseStudyCount = ch.sections.filter(s => s.caseStudy).length;
                const tipCount = ch.sections.filter(s => s.tips).length;
                return (
                  <div key={i}
                    onClick={() => setActive(i)}
                    style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", cursor: "pointer", transition: "border-color 0.15s, background 0.15s", position: "relative", overflow: "hidden" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = ch.accent + "55"; e.currentTarget.style.background = "var(--bg-3)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-2)"; }}>

                    {/* Top accent line */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: ch.accent, opacity: 0.7 }} />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <span style={{ fontSize: "10px", color: "var(--text-4)", fontFamily: "monospace", letterSpacing: "0.1em" }}>CH {String(ch.id).padStart(2, "0")}</span>
                      <Tag tag={ch.tag} small />
                    </div>

                    <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "17px", fontWeight: 400, margin: "0 0 10px", color: "var(--text-1)", lineHeight: 1.25 }}>{ch.title}</h3>

                    <div style={{ display: "flex", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", color: "var(--text-4)" }}>{ch.sections.length} sections</span>
                      <span style={{ fontSize: "11px", color: "var(--text-4)" }}>·</span>
                      <span style={{ fontSize: "11px", color: "var(--text-4)" }}>{ch.exercises.length} exercises</span>
                      {caseStudyCount > 0 && <><span style={{ fontSize: "11px", color: "var(--text-4)" }}>·</span><span style={{ fontSize: "11px", color: ch.accent }}>{caseStudyCount} case stud{caseStudyCount === 1 ? "y" : "ies"}</span></>}
                      {tipCount > 0 && <><span style={{ fontSize: "11px", color: "var(--text-4)" }}>·</span><span style={{ fontSize: "11px", color: ch.accent }}>{tipCount} tip sheet{tipCount > 1 ? "s" : ""}</span></>}
                    </div>

                    {chDone > 0 && (
                      <div style={{ marginBottom: "10px" }}>
                        <div style={{ height: "2px", background: "var(--border)", borderRadius: "1px", overflow: "hidden", marginBottom: "4px" }}>
                          <div style={{ width: `${(chDone / ch.exercises.length) * 100}%`, height: "100%", background: ch.accent }} />
                        </div>
                        <span style={{ fontSize: "10px", color: ch.accent }}>{chDone}/{ch.exercises.length} done</span>
                      </div>
                    )}

                    <div style={{ fontSize: "11px", color: "var(--text-4)" }}>Open chapter →</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {view === "glossary" && (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 48px 80px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "36px", fontWeight: 400, margin: "0 0 6px", color: "var(--text-1)" }}>Glossary</h2>
          <p style={{ color: "var(--text-4)", margin: "0 0 36px", fontSize: "14px" }}>{glossary.length} terms — every acronym and concept in this guide, defined.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
            {glossary.map((item, i) => {
              const accent = chapters[item.ch - 1]?.accent || "#888";
              return (
                <div key={i}
                  style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "14px 18px", background: "var(--bg-2)", borderBottom: i < glossary.length - 1 ? "1px solid var(--border)" : "none" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg-3)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--bg-2)"}>
                  <div style={{ width: "90px", flexShrink: 0 }}>
                    <code style={{ fontSize: "12px", fontWeight: 700, color: accent, background: `${accent}18`, padding: "3px 7px", borderRadius: "4px", border: `1px solid ${accent}30` }}>{item.term}</code>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-1)", marginBottom: "2px" }}>{item.full}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-3)", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                  <button onClick={() => { setView("chapters"); setActive(item.ch - 1); }} style={{ background: "none", border: `1px solid var(--border-2)`, color: "var(--text-4)", padding: "3px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "11px", flexShrink: 0 }}>
                    Ch.{item.ch} →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
