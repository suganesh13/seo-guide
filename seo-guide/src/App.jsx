import { useState, useMemo } from "react";
import { chapters, glossary } from "./chapters.js";

const TAGS = ["BASICS","ON-PAGE","TECHNICAL","OFF-PAGE","LOCAL","AEO","GEO","HEO","ANALYTICS","ADVANCED","STRATEGY"];

const tagMeta = {
  BASICS:    { color: "#4f63d2", bg: "#eef0fd", label: "Basics" },
  "ON-PAGE": { color: "#16a34a", bg: "#dcfce7", label: "On-Page" },
  TECHNICAL: { color: "#7c3aed", bg: "#ede9fe", label: "Technical" },
  "OFF-PAGE":{ color: "#b45309", bg: "#fef3c7", label: "Off-Page" },
  LOCAL:     { color: "#be185d", bg: "#fce7f3", label: "Local" },
  AEO:       { color: "#0369a1", bg: "#e0f2fe", label: "AEO" },
  GEO:       { color: "#0f766e", bg: "#ccfbf1", label: "GEO" },
  HEO:       { color: "#6d28d9", bg: "#f3e8ff", label: "HEO" },
  ANALYTICS: { color: "#15803d", bg: "#dcfce7", label: "Analytics" },
  ADVANCED:  { color: "#c2410c", bg: "#ffedd5", label: "Advanced" },
  STRATEGY:  { color: "#4338ca", bg: "#e0e7ff", label: "Strategy" },
};

const chapterIcons = ["○","◇","△","□","◁","◉","▷","⬡","✦","◈","◆","★"];

const iconBgs = [
  "#dbeafe","#dcfce7","#ede9fe","#ccfbf1","#fef3c7",
  "#fce7f3","#e0f2fe","#f3e8ff","#ffedd5","#d1fae5","#e0e7ff","#fae8ff"
];
const iconColors = [
  "#2563eb","#16a34a","#7c3aed","#0f766e","#b45309",
  "#be185d","#0369a1","#6d28d9","#c2410c","#059669","#4338ca","#a21caf"
];

const diffMeta = {
  Beginner:     { bg: "#dcfce7", color: "#15803d" },
  Intermediate: { bg: "#fef3c7", color: "#b45309" },
  Advanced:     { bg: "#fee2e2", color: "#b91c1c" },
};

const categoryGroups = [
  { label: "Foundations", tags: ["BASICS","ON-PAGE","TECHNICAL"] },
  { label: "Authority", tags: ["OFF-PAGE","LOCAL"] },
  { label: "AI Search", tags: ["AEO","GEO","HEO"] },
  { label: "Growth", tags: ["ANALYTICS","ADVANCED","STRATEGY"] },
];

function TagPill({ tag, small }) {
  const m = tagMeta[tag] || { color: "#888", bg: "#f0f0f0", label: tag };
  return (
    <span style={{
      display: "inline-block", padding: small ? "1px 7px" : "2px 9px",
      borderRadius: "5px", fontSize: small ? "10px" : "11px",
      fontWeight: 600, letterSpacing: "0.04em",
      background: m.bg, color: m.color
    }}>{m.label}</span>
  );
}

function IconCircle({ idx, size = 44 }) {
  const i = idx % iconBgs.length;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: iconBgs[i], display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: size * 0.38, color: iconColors[i],
      flexShrink: 0
    }}>
      {chapterIcons[idx % chapterIcons.length]}
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
            <div key={i} style={{ marginTop: "22px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ height: "1px", width: "24px", background: accent, flexShrink: 0 }} />
              <span style={{ fontSize: "10px", fontWeight: 700, color: accent, letterSpacing: "0.14em" }}>{parts[0]}</span>
              {parts[1] && <span style={{ fontSize: "12px", color: "var(--text-3)", fontWeight: 400 }}>{parts[1]}</span>}
            </div>
          );
        }
        if (line.startsWith('• ')) return (
          <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: accent, flexShrink: 0, marginTop: "8px" }} />
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
        return <p key={i} style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.8, margin: "0 0 6px" }}>{line}</p>;
      })}
    </div>
  );
}

function TipsPanel({ tips, accent }) {
  const m = Object.values(tagMeta).find(m => m.color === accent) || { bg: "#f0f4ff" };
  return (
    <div style={{ marginTop: "24px", background: m.bg, border: `1.5px solid ${accent}22`, borderRadius: "12px", padding: "18px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "11px", color: "#fff" }}>→</span>
        </div>
        <span style={{ fontSize: "11px", fontWeight: 700, color: accent, letterSpacing: "0.1em" }}>PRO TIPS</span>
      </div>
      {tips.map((tip, i) => (
        <div key={i} style={{ display: "flex", gap: "10px", marginBottom: i < tips.length - 1 ? "12px" : 0, paddingBottom: i < tips.length - 1 ? "12px" : 0, borderBottom: i < tips.length - 1 ? `1px solid ${accent}18` : "none" }}>
          <span style={{ color: accent, fontSize: "12px", flexShrink: 0, fontWeight: 700, marginTop: "2px" }}>{i + 1}.</span>
          <span style={{ fontSize: "13px", color: accent === "#4f63d2" ? "#1e2a5e" : "var(--text-2)", lineHeight: 1.65 }}>{tip}</span>
        </div>
      ))}
    </div>
  );
}

function CaseStudyPanel({ cs, accent }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: "18px", border: `1.5px solid ${accent}22`, borderRadius: "12px", overflow: "hidden", background: "var(--surface)" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", cursor: "pointer", textAlign: "left", background: open ? `${accent}08` : "transparent" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${accent}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: "14px" }}>📖</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: accent, letterSpacing: "0.1em", marginBottom: "1px" }}>CASE STUDY</div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-1)" }}>{cs.company} <span style={{ fontWeight: 400, color: "var(--text-3)" }}>— {cs.result}</span></div>
        </div>
        <span style={{ color: "var(--text-4)", fontSize: "12px" }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ padding: "16px 18px 18px", borderTop: `1px solid ${accent}14`, background: "var(--surface-2)" }}>
          <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.8, margin: 0 }}>{cs.story}</p>
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
  const accent = tagMeta[chapter.tag]?.color || "#4f63d2";
  const accentBg = tagMeta[chapter.tag]?.bg || "#eef0fd";
  const chDone = chapter.exercises.filter((_, ei) => completed[`${chapter.id}-${ei}`]).length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Left sidebar */}
      <aside style={{ width: "240px", flexShrink: 0, background: "var(--sidebar-bg)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        {/* Logo area */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)" }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-3)", fontSize: "12px", marginBottom: "16px", cursor: "pointer" }}>
            ← All chapters
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <IconCircle idx={chIdx} size={36} />
            <div>
              <div style={{ fontSize: "10px", color: "var(--text-4)", letterSpacing: "0.08em", fontFamily: "var(--font-mono)" }}>CH {String(chapter.id).padStart(2,"0")}</div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-1)", lineHeight: 1.3 }}>{chapter.title}</div>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
          {[["content","Sections"],["exercises","Exercises"]].map(([v,l]) => (
            <button key={v} onClick={() => setTab(v)} style={{ flex: 1, padding: "10px 0", fontSize: "12px", fontWeight: 600, color: tab === v ? accent : "var(--text-4)", borderBottom: `2px solid ${tab === v ? accent : "transparent"}`, background: "none", cursor: "pointer", marginBottom: "-1px" }}>{l}</button>
          ))}
        </div>

        {/* Section / exercise list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {tab === "content" && chapter.sections.map((s, i) => (
            <button key={i} onClick={() => setSecIdx(i)} style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "9px 20px", fontSize: "12px", lineHeight: 1.4,
              color: secIdx === i ? accent : "var(--text-3)",
              background: secIdx === i ? accentBg : "transparent",
              borderLeft: `3px solid ${secIdx === i ? accent : "transparent"}`,
              cursor: "pointer", fontWeight: secIdx === i ? 600 : 400
            }}>{s.heading}</button>
          ))}
          {tab === "exercises" && chapter.exercises.map((ex, ei) => {
            const key = `${chapter.id}-${ei}`;
            const done = completed[key];
            return (
              <button key={ei} onClick={() => setExpanded(expanded === key ? null : key)} style={{
                display: "flex", alignItems: "center", gap: "8px", width: "100%",
                textAlign: "left", padding: "9px 20px", fontSize: "12px",
                color: done ? accent : "var(--text-3)",
                background: "transparent", cursor: "pointer"
              }}>
                <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: `1.5px solid ${done ? accent : "var(--border-2)"}`, background: done ? accent : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {done && <svg width="7" height="5" viewBox="0 0 7 5"><path d="M1 2.5l1.5 1.5 3.5-3.5" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round"/></svg>}
                </div>
                <span style={{ lineHeight: 1.35 }}>{ex.title}</span>
              </button>
            );
          })}
        </div>

        {/* Progress at bottom */}
        {tab === "exercises" && (
          <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontSize: "11px", color: "var(--text-4)" }}>Progress</span>
              <span style={{ fontSize: "11px", color: accent, fontWeight: 600 }}>{chDone}/{chapter.exercises.length}</span>
            </div>
            <div style={{ height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ width: `${(chDone / chapter.exercises.length) * 100}%`, height: "100%", background: accent, borderRadius: "2px", transition: "width 0.3s" }} />
            </div>
          </div>
        )}

        {/* Chapter nav at bottom */}
        <div style={{ display: "flex", borderTop: "1px solid var(--border)" }}>
          {chIdx > 0 && (
            <button onClick={() => onNavigate(chIdx - 1)} style={{ flex: 1, padding: "10px", fontSize: "11px", color: "var(--text-3)", cursor: "pointer", borderRight: "1px solid var(--border)" }}>← Prev</button>
          )}
          {chIdx < allChapters.length - 1 && (
            <button onClick={() => onNavigate(chIdx + 1)} style={{ flex: 1, padding: "10px", fontSize: "11px", color: "var(--text-3)", cursor: "pointer" }}>Next →</button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
        {tab === "content" && (
          <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 48px 80px" }}>
            {/* Section header */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <TagPill tag={chapter.tag} small />
              <span style={{ fontSize: "11px", color: "var(--text-4)", fontFamily: "var(--font-mono)" }}>Section {secIdx + 1} of {chapter.sections.length}</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 400, margin: "0 0 28px", color: "var(--text-1)", letterSpacing: "-0.3px", lineHeight: 1.2 }}>{sec.heading}</h1>

            <ContentRenderer content={sec.content} accent={accent} />
            {sec.tips && <TipsPanel tips={sec.tips} accent={accent} />}
            {sec.caseStudy && <CaseStudyPanel cs={sec.caseStudy} accent={accent} />}

            {/* Nav buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "48px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
              <div>
                {secIdx > 0 && (
                  <button onClick={() => setSecIdx(secIdx - 1)} style={{ padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 500, color: "var(--text-3)", border: "1.5px solid var(--border)", cursor: "pointer" }}>← Previous section</button>
                )}
              </div>
              <div>
                {secIdx < chapter.sections.length - 1
                  ? <button onClick={() => setSecIdx(secIdx + 1)} style={{ padding: "8px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: "#fff", background: accent, cursor: "pointer", border: "none" }}>Next section →</button>
                  : <button onClick={() => setTab("exercises")} style={{ padding: "8px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: "#fff", background: accent, cursor: "pointer", border: "none" }}>Go to exercises →</button>
                }
              </div>
            </div>
          </div>
        )}

        {tab === "exercises" && (
          <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 48px 80px" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 400, margin: "0 0 6px", color: "var(--text-1)" }}>Exercises</h1>
            <p style={{ color: "var(--text-3)", fontSize: "13px", margin: "0 0 28px" }}>Work through these alongside each section. Click the circle to mark complete.</p>

            {chapter.exercises.map((ex, ei) => {
              const key = `${chapter.id}-${ei}`;
              const done = completed[key];
              const isOpen = expanded === key;
              const dc = diffMeta[ex.difficulty] || diffMeta.Beginner;
              return (
                <div key={ei} style={{ background: "var(--surface)", border: `1.5px solid ${done ? accent + "44" : "var(--border)"}`, borderRadius: "14px", marginBottom: "12px", overflow: "hidden", boxShadow: "var(--shadow)" }}>
                  <div style={{ padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: "14px", cursor: "pointer" }} onClick={() => setExpanded(isOpen ? null : key)}>
                    {/* Checkbox */}
                    <button onClick={e => { e.stopPropagation(); onToggle(key); }} style={{ width: "22px", height: "22px", borderRadius: "50%", border: `2px solid ${done ? accent : "var(--border-2)"}`, background: done ? accent : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", marginTop: "1px", transition: "all 0.15s" }}>
                      {done && <svg width="10" height="7" viewBox="0 0 10 7"><path d="M1 3.5l2.5 2.5 5.5-5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: done ? accent : "var(--text-1)" }}>{ex.title}</span>
                        <span style={{ padding: "2px 8px", borderRadius: "5px", fontSize: "10px", fontWeight: 600, background: dc.bg, color: dc.color }}>{ex.difficulty}</span>
                        <span style={{ fontSize: "11px", color: "var(--text-4)" }}>⏱ {ex.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: "12px", color: "var(--text-3)", lineHeight: 1.45 }}>{ex.goal}</p>
                    </div>
                    <span style={{ color: "var(--text-4)", fontSize: "11px", flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                  {isOpen && (
                    <div style={{ borderTop: "1px solid var(--border)", padding: "18px 20px 20px 56px", background: "var(--surface-2)" }}>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-4)", letterSpacing: "0.1em", marginBottom: "8px" }}>TASK</div>
                      <p style={{ margin: "0 0 16px", fontSize: "13px", color: "var(--text-2)", lineHeight: 1.8 }}>{ex.task}</p>
                      <button onClick={() => onToggle(key)} style={{ padding: "7px 16px", borderRadius: "7px", fontSize: "12px", fontWeight: 600, background: done ? "#fff" : accent, color: done ? accent : "#fff", border: `1.5px solid ${done ? accent : "transparent"}`, cursor: "pointer" }}>
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
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.tag.toLowerCase().includes(q) ||
        c.sections.some(s => s.heading.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeTag, search]);

  if (active !== null) {
    return <ChapterDetail
      chapter={chapters[active]} chIdx={active}
      onBack={() => { setActive(null); }}
      onNavigate={(i) => { setActive(i); }}
      completed={completed} onToggle={toggle}
      allChapters={chapters}
    />;
  }

  const tagCount = tag => chapters.filter(c => c.tag === tag).length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside style={{ width: "220px", flexShrink: 0, background: "var(--sidebar-bg)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        {/* Brand */}
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "16px" }}>◎</span>
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-1)", lineHeight: 1.2 }}>SEO Mastery</div>
              <div style={{ fontSize: "10px", color: "var(--text-4)" }}>2026 Edition</div>
            </div>
          </div>
        </div>

        {/* Overview nav */}
        <div style={{ padding: "12px 12px 0" }}>
          <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-4)", letterSpacing: "0.1em", padding: "0 8px", marginBottom: "4px" }}>OVERVIEW</div>
          {[
            { label: "All chapters", v: "chapters", count: chapters.length, icon: "⊞" },
            { label: "Glossary", v: "glossary", count: glossary.length, icon: "◎" },
          ].map(item => (
            <button key={item.v} onClick={() => { setView(item.v); setActiveTag(null); setSearch(""); }} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", padding: "8px 10px", borderRadius: "8px",
              background: view === item.v && !activeTag ? "#f0f2f7" : "transparent",
              color: view === item.v && !activeTag ? "var(--text-1)" : "var(--text-3)",
              fontSize: "13px", fontWeight: view === item.v && !activeTag ? 600 : 400,
              marginBottom: "2px", cursor: "pointer", textAlign: "left"
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>{item.icon}</span>{item.label}
              </span>
              <span style={{ fontSize: "11px", background: view === item.v && !activeTag ? "#e0e7f0" : "var(--bg)", color: "var(--text-3)", padding: "1px 6px", borderRadius: "10px", fontWeight: 600 }}>{item.count}</span>
            </button>
          ))}
        </div>

        {/* Category groups */}
        <div style={{ padding: "16px 12px 0", flex: 1, overflowY: "auto" }}>
          {categoryGroups.map(group => (
            <div key={group.label} style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-4)", letterSpacing: "0.1em", padding: "0 8px", marginBottom: "4px" }}>{group.label.toUpperCase()}</div>
              {group.tags.map(tag => {
                const m = tagMeta[tag];
                const isActive = activeTag === tag;
                return (
                  <button key={tag} onClick={() => { setActiveTag(isActive ? null : tag); setView("chapters"); setSearch(""); }} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", padding: "7px 10px", borderRadius: "8px",
                    background: isActive ? m.bg : "transparent",
                    color: isActive ? m.color : "var(--text-3)",
                    fontSize: "12px", fontWeight: isActive ? 600 : 400,
                    marginBottom: "2px", cursor: "pointer", textAlign: "left"
                  }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: isActive ? m.color : "var(--border-2)", flexShrink: 0 }} />
                      {m.label}
                    </span>
                    <span style={{ fontSize: "11px", background: isActive ? `${m.color}22` : "var(--bg)", color: isActive ? m.color : "var(--text-4)", padding: "1px 6px", borderRadius: "10px", fontWeight: 600 }}>{tagCount(tag)}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Progress at bottom */}
        <div style={{ padding: "12px 16px 16px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-4)" }}>Overall progress</span>
            <span style={{ fontSize: "11px", color: "#4f63d2", fontWeight: 600 }}>{doneCount}/{totalEx}</span>
          </div>
          <div style={{ height: "5px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ width: `${Math.round((doneCount / totalEx) * 100)}%`, height: "100%", background: "linear-gradient(90deg, #4f63d2, #16a34a)", borderRadius: "3px", transition: "width 0.4s" }} />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {view === "chapters" && (
          <>
            {/* Top bar */}
            <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px", flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-1)", margin: 0 }}>
                  {activeTag ? (tagMeta[activeTag]?.label + " chapters") : "All chapters"}
                </h2>
                <div style={{ fontSize: "11px", color: "var(--text-4)", marginTop: "1px" }}>{filtered.length} chapter{filtered.length !== 1 ? "s" : ""} available</div>
              </div>
              {/* Search */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--bg)", border: "1.5px solid var(--border)", borderRadius: "10px", padding: "7px 14px", width: "240px" }}>
                <span style={{ color: "var(--text-4)", fontSize: "14px" }}>⌕</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search chapters..." style={{ border: "none", background: "none", outline: "none", fontSize: "13px", color: "var(--text-1)", width: "100%" }} />
              </div>
            </div>

            {/* Chapter cards grid */}
            <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px 64px" }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-4)" }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>◎</div>
                  <div style={{ fontSize: "14px" }}>No chapters match your search</div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
                  {filtered.map((ch) => {
                    const chIdx = chapters.indexOf(ch);
                    const m = tagMeta[ch.tag] || { color: "#888", bg: "#f5f5f5" };
                    const chDone = ch.exercises.filter((_, ei) => completed[`${ch.id}-${ei}`]).length;
                    const caseCount = ch.sections.filter(s => s.caseStudy).length;
                    const tipCount = ch.sections.filter(s => s.tips).length;
                    return (
                      <div key={ch.id}
                        onClick={() => setActive(chIdx)}
                        style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "16px", padding: "20px", cursor: "pointer", boxShadow: "var(--shadow)", transition: "box-shadow 0.15s, border-color 0.15s", display: "flex", flexDirection: "column", gap: "12px" }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.borderColor = m.color + "44"; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--shadow)"; e.currentTarget.style.borderColor = "var(--border)"; }}>

                        {/* Icon + tag */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                          <IconCircle idx={chIdx} size={44} />
                          <TagPill tag={ch.tag} small />
                        </div>

                        {/* Title */}
                        <div>
                          <div style={{ fontSize: "10px", color: "var(--text-4)", fontFamily: "var(--font-mono)", marginBottom: "4px", letterSpacing: "0.06em" }}>Chapter {ch.id}</div>
                          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 400, margin: 0, color: "var(--text-1)", lineHeight: 1.3 }}>{ch.title}</h3>
                        </div>

                        {/* Meta pills */}
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "11px", color: "var(--text-4)", background: "var(--bg)", padding: "2px 8px", borderRadius: "5px" }}>{ch.sections.length} sections</span>
                          <span style={{ fontSize: "11px", color: "var(--text-4)", background: "var(--bg)", padding: "2px 8px", borderRadius: "5px" }}>{ch.exercises.length} exercises</span>
                          {caseCount > 0 && <span style={{ fontSize: "11px", color: m.color, background: m.bg, padding: "2px 8px", borderRadius: "5px" }}>📖 {caseCount} case stud{caseCount === 1 ? "y" : "ies"}</span>}
                          {tipCount > 0 && <span style={{ fontSize: "11px", color: m.color, background: m.bg, padding: "2px 8px", borderRadius: "5px" }}>→ {tipCount} tip sheet{tipCount > 1 ? "s" : ""}</span>}
                        </div>

                        {/* Progress */}
                        {chDone > 0 ? (
                          <div>
                            <div style={{ height: "3px", background: "var(--border)", borderRadius: "2px", overflow: "hidden", marginBottom: "4px" }}>
                              <div style={{ width: `${(chDone / ch.exercises.length) * 100}%`, height: "100%", background: m.color, borderRadius: "2px" }} />
                            </div>
                            <span style={{ fontSize: "10px", color: m.color, fontWeight: 600 }}>{chDone}/{ch.exercises.length} exercises done</span>
                          </div>
                        ) : (
                          <div style={{ fontSize: "11px", color: "var(--text-4)", marginTop: "auto" }}>Open chapter →</div>
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
            <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px", flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-1)", margin: 0 }}>Glossary</h2>
                <div style={{ fontSize: "11px", color: "var(--text-4)", marginTop: "1px" }}>{glossary.length} terms defined</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--bg)", border: "1.5px solid var(--border)", borderRadius: "10px", padding: "7px 14px", width: "240px" }}>
                <span style={{ color: "var(--text-4)", fontSize: "14px" }}>⌕</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search terms..." style={{ border: "none", background: "none", outline: "none", fontSize: "13px", color: "var(--text-1)", width: "100%" }} />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px 64px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "10px" }}>
                {glossary.filter(g => !search || g.term.toLowerCase().includes(search.toLowerCase()) || g.full.toLowerCase().includes(search.toLowerCase()) || g.desc.toLowerCase().includes(search.toLowerCase())).map((item, i) => {
                  const ch = chapters[item.ch - 1];
                  const m = tagMeta[ch?.tag] || { color: "#888", bg: "#f5f5f5" };
                  return (
                    <div key={i}
                      onClick={() => { setActive(item.ch - 1); setView("chapters"); setSearch(""); }}
                      style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "12px", padding: "16px 18px", cursor: "pointer", boxShadow: "var(--shadow)" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = m.color + "44"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "var(--shadow)"; }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                        <code style={{ fontSize: "13px", fontWeight: 700, color: m.color, background: m.bg, padding: "2px 8px", borderRadius: "5px", fontFamily: "var(--font-mono)" }}>{item.term}</code>
                        <TagPill tag={ch?.tag} small />
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-1)", marginBottom: "3px" }}>{item.full}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-3)", lineHeight: 1.5 }}>{item.desc}</div>
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
