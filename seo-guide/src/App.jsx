import { useState, useMemo } from "react";
import { chapters, glossary } from "./chapters.js";

const tagMeta = {
  BASICS:    { color: "#3451d1", bg: "#e8ecfd", label: "Basics" },
  "ON-PAGE": { color: "#15803d", bg: "#dcfce7", label: "On-Page" },
  TECHNICAL: { color: "#6d28d9", bg: "#ede9fe", label: "Technical" },
  "OFF-PAGE":{ color: "#a16207", bg: "#fef9c3", label: "Off-Page" },
  LOCAL:     { color: "#be185d", bg: "#fce7f3", label: "Local" },
  AEO:       { color: "#0369a1", bg: "#e0f2fe", label: "AEO" },
  GEO:       { color: "#0f766e", bg: "#ccfbf1", label: "GEO" },
  HEO:       { color: "#6d28d9", bg: "#f3e8ff", label: "HEO" },
  ANALYTICS: { color: "#166534", bg: "#dcfce7", label: "Analytics" },
  ADVANCED:  { color: "#c2410c", bg: "#ffedd5", label: "Advanced" },
  STRATEGY:  { color: "#3730a3", bg: "#e0e7ff", label: "Strategy" },
};

const diffMeta = {
  Beginner:     { bg: "#dcfce7", color: "#15803d" },
  Intermediate: { bg: "#fef3c7", color: "#a16207" },
  Advanced:     { bg: "#fee2e2", color: "#b91c1c" },
};

const categoryGroups = [
  { label: "Foundations", tags: ["BASICS","ON-PAGE","TECHNICAL"] },
  { label: "Authority", tags: ["OFF-PAGE","LOCAL"] },
  { label: "AI Search", tags: ["AEO","GEO","HEO"] },
  { label: "Growth", tags: ["ANALYTICS","ADVANCED","STRATEGY"] },
];

function TagPill({ tag, small }) {
  const m = tagMeta[tag] || { color: "#555", bg: "#f0f0f0", label: tag };
  return (
    <span style={{
      display: "inline-block", padding: small ? "1px 7px" : "2px 10px",
      borderRadius: "5px", fontSize: small ? "10px" : "11px",
      fontWeight: 700, letterSpacing: "0.03em",
      background: m.bg, color: m.color
    }}>{m.label}</span>
  );
}

function ChNum({ n, accent }) {
  return (
    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: accent + "15", border: `1.5px solid ${accent}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 700, color: accent }}>{String(n).padStart(2,"0")}</span>
    </div>
  );
}

function ContentRenderer({ content, accent }) {
  return (
    <div>
      {content.split('\n').map((line, i) => {
        if (line === '') return <div key={i} style={{ height: "8px" }} />;
        if (/^[A-Z][A-Z\s\/\-]{3,}(\s—\s.*)?$/.test(line.trim()) && line.length < 80 && !line.startsWith('•') && !/^\d/.test(line)) {
          const parts = line.split(' — ');
          return (
            <div key={i} style={{ marginTop: "24px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ height: "2px", width: "20px", background: accent, flexShrink: 0, borderRadius: "1px" }} />
              <span style={{ fontSize: "10px", fontWeight: 700, color: accent, letterSpacing: "0.14em" }}>{parts[0]}</span>
              {parts[1] && <span style={{ fontSize: "12px", color: "var(--text-4)", fontWeight: 400 }}>{parts[1]}</span>}
            </div>
          );
        }
        if (line.startsWith('• ')) return (
          <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: accent, flexShrink: 0, marginTop: "9px" }} />
            <span style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.75 }}>{line.slice(2)}</span>
          </div>
        );
        if (/^\d+\. /.test(line)) {
          const num = line.match(/^\d+/)[0];
          const rest = line.replace(/^\d+\. /, '');
          return (
            <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
              <span style={{ color: accent, fontWeight: 700, flexShrink: 0, fontSize: "12px", minWidth: "16px", marginTop: "4px", fontFamily: "var(--font-mono)" }}>{num}</span>
              <span style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.75 }}>{rest}</span>
            </div>
          );
        }
        return <p key={i} style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.82, margin: "0 0 6px" }}>{line}</p>;
      })}
    </div>
  );
}

function TipsPanel({ tips, accent }) {
  const m = tagMeta[Object.keys(tagMeta).find(k => tagMeta[k].color === accent)] || { bg: "#eef0fd" };
  return (
    <div style={{ marginTop: "24px", background: m.bg || "#eef0fd", border: `1.5px solid ${accent}25`, borderRadius: "12px", padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        <span style={{ fontSize: "13px", fontWeight: 700, color: accent }}>→ Pro Tips</span>
      </div>
      {tips.map((tip, i) => (
        <div key={i} style={{ display: "flex", gap: "10px", marginBottom: i < tips.length - 1 ? "11px" : 0, paddingBottom: i < tips.length - 1 ? "11px" : 0, borderBottom: i < tips.length - 1 ? `1px solid ${accent}18` : "none" }}>
          <span style={{ color: accent, fontSize: "11px", flexShrink: 0, fontWeight: 700, marginTop: "3px", fontFamily: "var(--font-mono)" }}>{i + 1}.</span>
          <span style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.65 }}>{tip}</span>
        </div>
      ))}
    </div>
  );
}

function CaseStudyPanel({ cs, accent }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: "16px", border: `1.5px solid ${accent}22`, borderRadius: "12px", overflow: "hidden", background: "var(--surface)" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "13px 18px", cursor: "pointer", textAlign: "left", background: open ? `${accent}07` : "transparent" }}>
        <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: `${accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: "13px" }}>📖</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: accent, letterSpacing: "0.1em", marginBottom: "1px" }}>CASE STUDY</div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-1)" }}>{cs.company} <span style={{ fontWeight: 400, color: "var(--text-3)" }}>— {cs.result}</span></div>
        </div>
        <span style={{ color: "var(--text-4)", fontSize: "11px" }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ padding: "14px 18px 18px", borderTop: `1px solid ${accent}14`, background: "var(--surface-2)" }}>
          <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.82, margin: 0 }}>{cs.story}</p>
        </div>
      )}
    </div>
  );
}

function GoogleInsightPanel({ insights }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: "16px", border: "1.5px solid #4285f422", borderRadius: "12px", overflow: "hidden", background: "var(--surface)" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "13px 18px", cursor: "pointer", textAlign: "left", background: open ? "#4285f407" : "transparent" }}>
        <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "#4285f415", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "14px" }}>G</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#4285f4", letterSpacing: "0.1em", marginBottom: "1px" }}>GOOGLE'S OFFICIAL GUIDANCE</div>
          <div style={{ fontSize: "13px", color: "var(--text-2)" }}>{insights.summary}</div>
        </div>
        <span style={{ color: "var(--text-4)", fontSize: "11px" }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ padding: "14px 18px 18px", borderTop: "1px solid #4285f414", background: "var(--surface-2)" }}>
          {insights.points.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", marginBottom: i < insights.points.length - 1 ? "10px" : 0 }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#4285f4", flexShrink: 0, marginTop: "8px" }} />
              <span style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.7 }}>{p}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChapterDetail({ chapter, chIdx, onBack, completed, onToggle, allChapters, onNavigate }) {
  const [secIdx, setSecIdx] = useState(0);
  const [tab, setTab] = useState("content");
  const [expanded, setExpanded] = useState(null);
  const sec = chapter.sections[secIdx];
  const accent = tagMeta[chapter.tag]?.color || "#3451d1";
  const accentBg = tagMeta[chapter.tag]?.bg || "#e8ecfd";
  const chDone = chapter.exercises.filter((_, ei) => completed[`${chapter.id}-${ei}`]).length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <aside style={{ width: "240px", flexShrink: 0, background: "var(--sidebar-bg)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "18px 18px 14px", borderBottom: "1px solid var(--border)" }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-3)", fontSize: "12px", fontWeight: 500, marginBottom: "14px", cursor: "pointer" }}>
            ← All chapters
          </button>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <ChNum n={chapter.id} accent={accent} />
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-1)", lineHeight: 1.35 }}>{chapter.title}</div>
              <div style={{ marginTop: "4px" }}><TagPill tag={chapter.tag} small /></div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
          {[["content","Sections"],["exercises",`Exercises (${chapter.exercises.length})`]].map(([v,l]) => (
            <button key={v} onClick={() => setTab(v)} style={{ flex: 1, padding: "9px 0", fontSize: "11px", fontWeight: 700, color: tab === v ? accent : "var(--text-3)", borderBottom: `2px solid ${tab === v ? accent : "transparent"}`, background: "none", cursor: "pointer", marginBottom: "-1px" }}>{l}</button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
          {tab === "content" && chapter.sections.map((s, i) => (
            <button key={i} onClick={() => setSecIdx(i)} style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 18px", fontSize: "12px", lineHeight: 1.4, color: secIdx === i ? accent : "var(--text-2)", background: secIdx === i ? accentBg : "transparent", borderLeft: `3px solid ${secIdx === i ? accent : "transparent"}`, cursor: "pointer", fontWeight: secIdx === i ? 600 : 400 }}>
              {s.heading}
            </button>
          ))}
          {tab === "exercises" && chapter.exercises.map((ex, ei) => {
            const key = `${chapter.id}-${ei}`;
            const done = completed[key];
            return (
              <button key={ei} onClick={() => setExpanded(expanded === key ? null : key)} style={{ display: "flex", alignItems: "flex-start", gap: "8px", width: "100%", textAlign: "left", padding: "9px 18px", fontSize: "12px", color: done ? accent : "var(--text-2)", background: "transparent", cursor: "pointer" }}>
                <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: `1.5px solid ${done ? accent : "var(--border-2)"}`, background: done ? accent : "transparent", flexShrink: 0, marginTop: "1px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {done && <svg width="7" height="5" viewBox="0 0 7 5"><path d="M1 2.5l1.5 1.5 3.5-3.5" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round"/></svg>}
                </div>
                <span style={{ lineHeight: 1.4, fontWeight: done ? 600 : 400 }}>{ex.title}</span>
              </button>
            );
          })}
        </div>

        {tab === "exercises" && (
          <div style={{ padding: "12px 18px", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 500 }}>Chapter progress</span>
              <span style={{ fontSize: "11px", color: accent, fontWeight: 700 }}>{chDone}/{chapter.exercises.length}</span>
            </div>
            <div style={{ height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ width: `${(chDone / Math.max(chapter.exercises.length,1)) * 100}%`, height: "100%", background: accent, borderRadius: "2px", transition: "width 0.3s" }} />
            </div>
          </div>
        )}

        <div style={{ display: "flex", borderTop: "1px solid var(--border)" }}>
          {chIdx > 0 && <button onClick={() => onNavigate(chIdx - 1)} style={{ flex: 1, padding: "10px", fontSize: "11px", fontWeight: 600, color: "var(--text-3)", cursor: "pointer", borderRight: "1px solid var(--border)" }}>← Prev</button>}
          {chIdx < allChapters.length - 1 && <button onClick={() => onNavigate(chIdx + 1)} style={{ flex: 1, padding: "10px", fontSize: "11px", fontWeight: 600, color: "var(--text-3)", cursor: "pointer" }}>Next →</button>}
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
        {tab === "content" && (
          <div style={{ maxWidth: "740px", margin: "0 auto", padding: "44px 52px 80px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <TagPill tag={chapter.tag} small />
              <span style={{ fontSize: "11px", color: "var(--text-4)", fontFamily: "var(--font-mono)" }}>Section {secIdx + 1} / {chapter.sections.length}</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "30px", fontWeight: 400, margin: "0 0 28px", color: "var(--text-1)", letterSpacing: "-0.2px", lineHeight: 1.25 }}>{sec.heading}</h1>
            <ContentRenderer content={sec.content} accent={accent} />
            {sec.googleInsight && <GoogleInsightPanel insights={sec.googleInsight} />}
            {sec.tips && <TipsPanel tips={sec.tips} accent={accent} />}
            {sec.caseStudy && <CaseStudyPanel cs={sec.caseStudy} accent={accent} />}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "44px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
              <div>{secIdx > 0 && <button onClick={() => setSecIdx(secIdx - 1)} style={{ padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 500, color: "var(--text-3)", border: "1.5px solid var(--border)", cursor: "pointer" }}>← Previous</button>}</div>
              <div>
                {secIdx < chapter.sections.length - 1
                  ? <button onClick={() => setSecIdx(secIdx + 1)} style={{ padding: "8px 22px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, color: "#fff", background: accent, cursor: "pointer" }}>Next section →</button>
                  : <button onClick={() => setTab("exercises")} style={{ padding: "8px 22px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, color: "#fff", background: accent, cursor: "pointer" }}>Go to exercises →</button>
                }
              </div>
            </div>
          </div>
        )}

        {tab === "exercises" && (
          <div style={{ maxWidth: "700px", margin: "0 auto", padding: "44px 52px 80px" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 400, margin: "0 0 6px", color: "var(--text-1)" }}>Exercises</h1>
            <p style={{ color: "var(--text-3)", fontSize: "13px", margin: "0 0 24px", fontWeight: 500 }}>Work through these alongside each section. Click the circle to mark complete.</p>
            {chapter.exercises.map((ex, ei) => {
              const key = `${chapter.id}-${ei}`;
              const done = completed[key];
              const isOpen = expanded === key;
              const dc = diffMeta[ex.difficulty] || diffMeta.Beginner;
              return (
                <div key={ei} style={{ background: "var(--surface)", border: `1.5px solid ${done ? accent+"44" : "var(--border)"}`, borderRadius: "14px", marginBottom: "10px", overflow: "hidden", boxShadow: "var(--shadow)" }}>
                  <div style={{ padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: "13px", cursor: "pointer" }} onClick={() => setExpanded(isOpen ? null : key)}>
                    <button onClick={e => { e.stopPropagation(); onToggle(key); }} style={{ width: "22px", height: "22px", borderRadius: "50%", border: `2px solid ${done ? accent : "var(--border-2)"}`, background: done ? accent : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", marginTop: "1px", transition: "all 0.15s" }}>
                      {done && <svg width="10" height="7" viewBox="0 0 10 7"><path d="M1 3.5l2.5 2.5 5.5-5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: done ? accent : "var(--text-1)" }}>{ex.title}</span>
                        <span style={{ padding: "2px 8px", borderRadius: "5px", fontSize: "10px", fontWeight: 700, background: dc.bg, color: dc.color }}>{ex.difficulty}</span>
                        <span style={{ fontSize: "11px", color: "var(--text-4)", fontWeight: 500 }}>⏱ {ex.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: "12px", color: "var(--text-3)", lineHeight: 1.45, fontWeight: 500 }}>{ex.goal}</p>
                    </div>
                    <span style={{ color: "var(--text-4)", fontSize: "11px", flexShrink: 0, marginTop: "4px" }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                  {isOpen && (
                    <div style={{ borderTop: "1px solid var(--border)", padding: "16px 20px 18px 55px", background: "var(--surface-2)" }}>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-4)", letterSpacing: "0.1em", marginBottom: "8px" }}>TASK</div>
                      <p style={{ margin: "0 0 14px", fontSize: "13px", color: "var(--text-2)", lineHeight: 1.8 }}>{ex.task}</p>
                      <button onClick={() => onToggle(key)} style={{ padding: "7px 16px", borderRadius: "7px", fontSize: "12px", fontWeight: 700, background: done ? "#fff" : accent, color: done ? accent : "#fff", border: `1.5px solid ${done ? accent : "transparent"}`, cursor: "pointer" }}>
                        {done ? "✓ Marked complete — undo?" : "Mark as complete"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState(null);
  const [completed, setCompleted] = useState({});
  const [view, setView] = useState("chapters");
  const [activeTag, setActiveTag] = useState(null);
  const [search, setSearch] = useState("");

  const toggle = key => setCompleted(p => ({ ...p, [key]: !p[key] }));
  const totalEx = chapters.reduce((a, c) => a + c.exercises.length, 0);
  const doneCount = Object.values(completed).filter(Boolean).length;

  const filtered = useMemo(() => {
    let list = chapters;
    if (activeTag) list = list.filter(c => c.tag === activeTag);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => c.title.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q) || c.sections.some(s => s.heading.toLowerCase().includes(q)));
    }
    return list;
  }, [activeTag, search]);

  if (active !== null) {
    return <ChapterDetail chapter={chapters[active]} chIdx={active} onBack={() => setActive(null)} onNavigate={i => setActive(i)} completed={completed} onToggle={toggle} allChapters={chapters} />;
  }

  const tagCount = tag => chapters.filter(c => c.tag === tag).length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{ width: "224px", flexShrink: 0, background: "var(--sidebar-bg)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "#1e3264", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "16px", color: "#fff" }}>◎</span>
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-1)", lineHeight: 1.2 }}>SEO Mastery</div>
              <div style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 500 }}>2026 Edition</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "12px 10px 0" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.1em", padding: "0 8px", marginBottom: "4px" }}>OVERVIEW</div>
          {[
            { label: "All chapters", v: "chapters", count: chapters.length },
            { label: "Glossary", v: "glossary", count: glossary.length },
          ].map(item => (
            <button key={item.v} onClick={() => { setView(item.v); setActiveTag(null); setSearch(""); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "7px 10px", borderRadius: "8px", background: view === item.v && !activeTag ? "#eef0fb" : "transparent", color: view === item.v && !activeTag ? "#3451d1" : "var(--text-1)", fontSize: "13px", fontWeight: view === item.v && !activeTag ? 700 : 500, marginBottom: "2px", cursor: "pointer", textAlign: "left" }}>
              <span>{item.label}</span>
              <span style={{ fontSize: "11px", background: "var(--bg)", color: "var(--text-3)", padding: "1px 7px", borderRadius: "10px", fontWeight: 700 }}>{item.count}</span>
            </button>
          ))}
        </div>

        <div style={{ padding: "14px 10px 0", flex: 1, overflowY: "auto" }}>
          {categoryGroups.map(group => (
            <div key={group.label} style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.1em", padding: "0 8px", marginBottom: "3px" }}>{group.label.toUpperCase()}</div>
              {group.tags.map(tag => {
                const m = tagMeta[tag];
                const isActive = activeTag === tag;
                return (
                  <button key={tag} onClick={() => { setActiveTag(isActive ? null : tag); setView("chapters"); setSearch(""); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "7px 10px", borderRadius: "8px", background: isActive ? m.bg : "transparent", color: isActive ? m.color : "var(--text-1)", fontSize: "13px", fontWeight: isActive ? 700 : 500, marginBottom: "2px", cursor: "pointer", textAlign: "left" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: isActive ? m.color : "var(--border-2)", flexShrink: 0 }} />
                      {m.label}
                    </span>
                    <span style={{ fontSize: "11px", background: isActive ? m.color + "22" : "var(--bg)", color: isActive ? m.color : "var(--text-3)", padding: "1px 7px", borderRadius: "10px", fontWeight: 700 }}>{tagCount(tag)}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{ padding: "12px 16px 16px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 600 }}>Overall progress</span>
            <span style={{ fontSize: "11px", color: "#3451d1", fontWeight: 700 }}>{doneCount}/{totalEx}</span>
          </div>
          <div style={{ height: "5px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ width: `${Math.round((doneCount / totalEx) * 100)}%`, height: "100%", background: "linear-gradient(90deg, #3451d1, #15803d)", borderRadius: "3px", transition: "width 0.4s" }} />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {view === "chapters" && (
          <>
            <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "58px", flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-1)", margin: 0 }}>{activeTag ? (tagMeta[activeTag]?.label + " chapters") : "All chapters"}</h2>
                <div style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "1px", fontWeight: 500 }}>{filtered.length} chapter{filtered.length !== 1 ? "s" : ""} available</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--bg)", border: "1.5px solid var(--border)", borderRadius: "10px", padding: "7px 14px", width: "230px" }}>
                <span style={{ color: "var(--text-4)", fontSize: "14px" }}>⌕</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search chapters..." style={{ border: "none", background: "none", outline: "none", fontSize: "13px", color: "var(--text-1)", width: "100%", fontWeight: 500 }} />
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px 64px" }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-4)" }}>
                  <div style={{ fontSize: "14px", fontWeight: 500 }}>No chapters match your search</div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(256px, 1fr))", gap: "12px" }}>
                  {filtered.map((ch) => {
                    const chIdx = chapters.indexOf(ch);
                    const m = tagMeta[ch.tag] || { color: "#555", bg: "#f0f0f0" };
                    const chDone = ch.exercises.filter((_, ei) => completed[`${ch.id}-${ei}`]).length;
                    const caseCount = ch.sections.filter(s => s.caseStudy).length;
                    const tipCount = ch.sections.filter(s => s.tips).length;
                    const googleCount = ch.sections.filter(s => s.googleInsight).length;
                    return (
                      <div key={ch.id} onClick={() => setActive(chIdx)}
                        style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "16px", padding: "20px", cursor: "pointer", boxShadow: "var(--shadow)", transition: "box-shadow 0.15s, border-color 0.15s", display: "flex", flexDirection: "column", gap: "12px" }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.borderColor = m.color + "40"; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--shadow)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                          <ChNum n={ch.id} accent={m.color} />
                          <TagPill tag={ch.tag} small />
                        </div>
                        <div>
                          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 400, margin: "0 0 4px", color: "var(--text-1)", lineHeight: 1.3 }}>{ch.title}</h3>
                        </div>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "11px", color: "var(--text-3)", background: "var(--bg)", padding: "2px 8px", borderRadius: "5px", fontWeight: 500 }}>{ch.sections.length} sections</span>
                          <span style={{ fontSize: "11px", color: "var(--text-3)", background: "var(--bg)", padding: "2px 8px", borderRadius: "5px", fontWeight: 500 }}>{ch.exercises.length} exercises</span>
                          {caseCount > 0 && <span style={{ fontSize: "11px", color: m.color, background: m.bg, padding: "2px 8px", borderRadius: "5px", fontWeight: 600 }}>📖 {caseCount} case stud{caseCount===1?"y":"ies"}</span>}
                          {tipCount > 0 && <span style={{ fontSize: "11px", color: m.color, background: m.bg, padding: "2px 8px", borderRadius: "5px", fontWeight: 600 }}>→ {tipCount} tip sheet{tipCount>1?"s":""}</span>}
                          {googleCount > 0 && <span style={{ fontSize: "11px", color: "#4285f4", background: "#e8f0fe", padding: "2px 8px", borderRadius: "5px", fontWeight: 600 }}>G official</span>}
                        </div>
                        {chDone > 0 ? (
                          <div>
                            <div style={{ height: "3px", background: "var(--border)", borderRadius: "2px", overflow: "hidden", marginBottom: "4px" }}>
                              <div style={{ width: `${(chDone/ch.exercises.length)*100}%`, height: "100%", background: m.color, borderRadius: "2px" }} />
                            </div>
                            <span style={{ fontSize: "10px", color: m.color, fontWeight: 700 }}>{chDone}/{ch.exercises.length} exercises done</span>
                          </div>
                        ) : (
                          <div style={{ fontSize: "11px", color: "var(--text-4)", fontWeight: 600, marginTop: "auto" }}>Open chapter →</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {view === "glossary" && (
          <>
            <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "58px", flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-1)", margin: 0 }}>Glossary</h2>
                <div style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "1px", fontWeight: 500 }}>{glossary.length} terms defined</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--bg)", border: "1.5px solid var(--border)", borderRadius: "10px", padding: "7px 14px", width: "230px" }}>
                <span style={{ color: "var(--text-4)", fontSize: "14px" }}>⌕</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search terms..." style={{ border: "none", background: "none", outline: "none", fontSize: "13px", color: "var(--text-1)", width: "100%", fontWeight: 500 }} />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px 64px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "10px" }}>
                {glossary.filter(g => !search || g.term.toLowerCase().includes(search.toLowerCase()) || g.full.toLowerCase().includes(search.toLowerCase()) || g.desc.toLowerCase().includes(search.toLowerCase())).map((item, i) => {
                  const ch = chapters[item.ch - 1];
                  const m = tagMeta[ch?.tag] || { color: "#555", bg: "#f0f0f0" };
                  return (
                    <div key={i} onClick={() => { setActive(item.ch - 1); setView("chapters"); setSearch(""); }}
                      style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "12px", padding: "15px 17px", cursor: "pointer", boxShadow: "var(--shadow)" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = m.color+"40"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "var(--shadow)"; }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                        <code style={{ fontSize: "12px", fontWeight: 700, color: m.color, background: m.bg, padding: "2px 8px", borderRadius: "5px", fontFamily: "var(--font-mono)" }}>{item.term}</code>
                        <TagPill tag={ch?.tag} small />
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-1)", marginBottom: "3px" }}>{item.full}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-3)", lineHeight: 1.5, fontWeight: 500 }}>{item.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
