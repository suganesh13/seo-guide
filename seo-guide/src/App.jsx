import { useState, useMemo, useEffect } from "react";
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
  { label: "Authority",   tags: ["OFF-PAGE","LOCAL"] },
  { label: "AI Search",  tags: ["AEO","GEO","HEO"] },
  { label: "Growth",     tags: ["ANALYTICS","ADVANCED","STRATEGY"] },
];

/* ── small reusable atoms ── */
function TagPill({ tag, small }) {
  const m = tagMeta[tag] || { color:"#555", bg:"#f0f0f0", label: tag };
  return (
    <span style={{ display:"inline-block", padding: small?"1px 7px":"2px 10px", borderRadius:"5px",
      fontSize: small?"10px":"11px", fontWeight:700, letterSpacing:"0.03em",
      background: m.bg, color: m.color }}>{m.label}</span>
  );
}

function ChNum({ n, accent }) {
  return (
    <div style={{ width:36, height:36, borderRadius:8, background:`${accent}15`,
      border:`1.5px solid ${accent}30`, display:"flex", alignItems:"center",
      justifyContent:"center", flexShrink:0 }}>
      <span style={{ fontFamily:"var(--font-mono)", fontSize:"11px", fontWeight:700, color:accent }}>
        {String(n).padStart(2,"0")}
      </span>
    </div>
  );
}

function HamburgerBtn({ onClick }) {
  return (
    <button onClick={onClick} aria-label="Open menu"
      style={{ width:36, height:36, borderRadius:8, border:"1.5px solid var(--border)",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        gap:4, background:"var(--surface)", flexShrink:0 }}>
      {[0,1,2].map(i => (
        <span key={i} style={{ width:16, height:1.5, background:"var(--text-2)", borderRadius:1 }} />
      ))}
    </button>
  );
}

/* ── content renderers ── */
function ContentRenderer({ content, accent }) {
  return (
    <div>
      {content.split('\n').map((line, i) => {
        if (line === '') return <div key={i} style={{ height:8 }} />;
        if (/^[A-Z][A-Z\s\/\-]{3,}(\s—\s.*)?$/.test(line.trim()) && line.length < 80 && !line.startsWith('•') && !/^\d/.test(line)) {
          const [head, ...rest] = line.split(' — ');
          return (
            <div key={i} style={{ marginTop:24, marginBottom:8, display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ height:2, width:20, background:accent, flexShrink:0, borderRadius:1 }} />
              <span style={{ fontSize:"10px", fontWeight:700, color:accent, letterSpacing:"0.14em" }}>{head}</span>
              {rest.length > 0 && <span style={{ fontSize:"12px", color:"var(--text-4)", fontWeight:400 }}>{rest.join(' — ')}</span>}
            </div>
          );
        }
        if (line.startsWith('• ')) return (
          <div key={i} style={{ display:"flex", gap:10, marginBottom:6 }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:accent, flexShrink:0, marginTop:9 }} />
            <span style={{ fontSize:"14px", color:"var(--text-2)", lineHeight:1.75 }}>{line.slice(2)}</span>
          </div>
        );
        if (/^\d+\. /.test(line)) {
          const num = line.match(/^\d+/)[0];
          const rest = line.replace(/^\d+\. /,'');
          return (
            <div key={i} style={{ display:"flex", gap:12, marginBottom:8 }}>
              <span style={{ color:accent, fontWeight:700, flexShrink:0, fontSize:"12px", minWidth:16, marginTop:4, fontFamily:"var(--font-mono)" }}>{num}</span>
              <span style={{ fontSize:"14px", color:"var(--text-2)", lineHeight:1.75 }}>{rest}</span>
            </div>
          );
        }
        return <p key={i} style={{ fontSize:"14px", color:"var(--text-2)", lineHeight:1.82, margin:"0 0 6px" }}>{line}</p>;
      })}
    </div>
  );
}

function TipsPanel({ tips, accent }) {
  const m = Object.values(tagMeta).find(m => m.color === accent) || { bg:"#eef0fd" };
  return (
    <div style={{ marginTop:24, background: m.bg||"#eef0fd", border:`1.5px solid ${accent}25`, borderRadius:12, padding:"18px 20px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        <span style={{ fontSize:13, fontWeight:700, color:accent }}>→ Pro Tips</span>
      </div>
      {tips.map((tip, i) => (
        <div key={i} style={{ display:"flex", gap:10,
          marginBottom: i < tips.length-1 ? 11 : 0,
          paddingBottom: i < tips.length-1 ? 11 : 0,
          borderBottom: i < tips.length-1 ? `1px solid ${accent}18` : "none" }}>
          <span style={{ color:accent, fontSize:"11px", flexShrink:0, fontWeight:700, marginTop:3, fontFamily:"var(--font-mono)" }}>{i+1}.</span>
          <span style={{ fontSize:"13px", color:"var(--text-2)", lineHeight:1.65 }}>{tip}</span>
        </div>
      ))}
    </div>
  );
}

function CaseStudyPanel({ cs, accent }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop:16, border:`1.5px solid ${accent}22`, borderRadius:12, overflow:"hidden", background:"var(--surface)" }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"13px 18px", cursor:"pointer", textAlign:"left", background: open ? `${accent}07` : "transparent" }}>
        <div style={{ width:28, height:28, borderRadius:7, background:`${accent}15`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:13 }}>📖</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:"10px", fontWeight:700, color:accent, letterSpacing:"0.1em", marginBottom:1 }}>CASE STUDY</div>
          <div style={{ fontSize:"13px", fontWeight:600, color:"var(--text-1)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
            {cs.company} <span style={{ fontWeight:400, color:"var(--text-3)" }}>— {cs.result}</span>
          </div>
        </div>
        <span style={{ color:"var(--text-4)", fontSize:"11px", flexShrink:0 }}>{open?"▲":"▼"}</span>
      </button>
      {open && (
        <div style={{ padding:"14px 18px 18px", borderTop:`1px solid ${accent}14`, background:"var(--surface-2)" }}>
          <p style={{ fontSize:"13px", color:"var(--text-2)", lineHeight:1.82, margin:0 }}>{cs.story}</p>
        </div>
      )}
    </div>
  );
}

function GoogleInsightPanel({ insights }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop:16, border:"1.5px solid #4285f422", borderRadius:12, overflow:"hidden", background:"var(--surface)" }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"13px 18px", cursor:"pointer", textAlign:"left", background: open?"#4285f407":"transparent" }}>
        <div style={{ width:28, height:28, borderRadius:7, background:"#4285f415", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:13, fontWeight:700, color:"#4285f4", fontFamily:"var(--font-mono)" }}>G</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:"10px", fontWeight:700, color:"#4285f4", letterSpacing:"0.1em", marginBottom:1 }}>GOOGLE'S OFFICIAL GUIDANCE</div>
          <div style={{ fontSize:"13px", color:"var(--text-2)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{insights.summary}</div>
        </div>
        <span style={{ color:"var(--text-4)", fontSize:"11px", flexShrink:0 }}>{open?"▲":"▼"}</span>
      </button>
      {open && (
        <div style={{ padding:"14px 18px 18px", borderTop:"1px solid #4285f414", background:"var(--surface-2)" }}>
          {insights.points.map((p,i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom: i < insights.points.length-1 ? 10 : 0 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:"#4285f4", flexShrink:0, marginTop:8 }} />
              <span style={{ fontSize:"13px", color:"var(--text-2)", lineHeight:1.7 }}>{p}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Sidebar (shared by home + chapter views) ── */
function Sidebar({ view, setView, activeTag, setActiveTag, setSearch, completed, isOpen, onClose, mode, chapter, chIdx, setTab, tab, secIdx, setSecIdx, expanded, setExpanded, onNavigate, allChapters, onBack }) {
  const totalEx = chapters.reduce((a,c) => a + c.exercises.length, 0);
  const doneCount = Object.values(completed).filter(Boolean).length;
  const tagCount = tag => chapters.filter(c => c.tag === tag).length;

  return (
    <>
      {/* Overlay for mobile */}
      <div className={`sidebar-overlay${isOpen?" open":""}`} onClick={onClose} />

      <aside className={`desktop-sidebar${isOpen?" open":""}`}
        style={{ width:"var(--sidebar-w)", flexShrink:0, background:"var(--sidebar-bg)", borderRight:"1px solid var(--border)", display:"flex", flexDirection:"column", height:"100vh", position:"sticky", top:0 }}>

        {/* Brand / back */}
        <div style={{ padding:"18px 18px 14px", borderBottom:"1px solid var(--border)" }}>
          {mode === "chapter" ? (
            <>
              <button onClick={() => { onBack(); onClose(); }} style={{ display:"flex", alignItems:"center", gap:6, color:"var(--text-3)", fontSize:"12px", fontWeight:500, marginBottom:12, cursor:"pointer" }}>← All chapters</button>
              <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                <ChNum n={chapter.id} accent={tagMeta[chapter.tag]?.color||"#3451d1"} />
                <div>
                  <div style={{ fontSize:"12px", fontWeight:700, color:"var(--text-1)", lineHeight:1.35 }}>{chapter.title}</div>
                  <div style={{ marginTop:4 }}><TagPill tag={chapter.tag} small /></div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:"#1e3264", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontSize:16, color:"#fff" }}>◎</span>
              </div>
              <div>
                <div style={{ fontSize:"14px", fontWeight:700, color:"var(--text-1)", lineHeight:1.2 }}>SEO Mastery</div>
                <div style={{ fontSize:"11px", color:"var(--text-3)", fontWeight:500 }}>2026 Edition</div>
              </div>
            </div>
          )}
        </div>

        {mode === "chapter" ? (
          <>
            {/* Chapter tab switcher */}
            <div style={{ display:"flex", borderBottom:"1px solid var(--border)" }}>
              {[["content","Sections"],[`exercises`,`Exercises (${chapter.exercises.length})`]].map(([v,l]) => (
                <button key={v} onClick={() => { setTab(v); onClose(); }} style={{ flex:1, padding:"9px 0", fontSize:"11px", fontWeight:700, color: tab===v ? tagMeta[chapter.tag]?.color||"#3451d1" : "var(--text-3)", borderBottom:`2px solid ${tab===v ? tagMeta[chapter.tag]?.color||"#3451d1" : "transparent"}`, background:"none", cursor:"pointer", marginBottom:-1 }}>{l}</button>
              ))}
            </div>

            <div style={{ flex:1, overflowY:"auto", padding:"6px 0" }}>
              {tab === "content" && chapter.sections.map((s, i) => {
                const accent = tagMeta[chapter.tag]?.color||"#3451d1";
                const accentBg = tagMeta[chapter.tag]?.bg||"#e8ecfd";
                return (
                  <button key={i} onClick={() => { setSecIdx(i); onClose(); }} style={{ display:"block", width:"100%", textAlign:"left", padding:"9px 18px", fontSize:"12px", lineHeight:1.4, color: secIdx===i ? accent : "var(--text-2)", background: secIdx===i ? accentBg : "transparent", borderLeft:`3px solid ${secIdx===i ? accent : "transparent"}`, cursor:"pointer", fontWeight: secIdx===i ? 600 : 400 }}>
                    {s.heading}
                  </button>
                );
              })}
              {tab === "exercises" && chapter.exercises.map((ex, ei) => {
                const key = `${chapter.id}-${ei}`;
                const done = completed[key];
                return (
                  <button key={ei} onClick={() => { setExpanded(expanded===key?null:key); onClose(); }} style={{ display:"flex", alignItems:"flex-start", gap:8, width:"100%", textAlign:"left", padding:"9px 18px", fontSize:"12px", color: done ? tagMeta[chapter.tag]?.color||"#3451d1" : "var(--text-2)", background:"transparent", cursor:"pointer" }}>
                    <div style={{ width:14, height:14, borderRadius:"50%", border:`1.5px solid ${done ? tagMeta[chapter.tag]?.color||"#3451d1" : "var(--border-2)"}`, background: done ? tagMeta[chapter.tag]?.color||"#3451d1" : "transparent", flexShrink:0, marginTop:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {done && <svg width="7" height="5" viewBox="0 0 7 5"><path d="M1 2.5l1.5 1.5 3.5-3.5" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round"/></svg>}
                    </div>
                    <span style={{ lineHeight:1.4, fontWeight: done?600:400 }}>{ex.title}</span>
                  </button>
                );
              })}
            </div>

            {tab === "exercises" && (() => {
              const chDone = chapter.exercises.filter((_,ei) => completed[`${chapter.id}-${ei}`]).length;
              const accent = tagMeta[chapter.tag]?.color||"#3451d1";
              return (
                <div style={{ padding:"12px 18px", borderTop:"1px solid var(--border)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:"11px", color:"var(--text-3)", fontWeight:500 }}>Chapter progress</span>
                    <span style={{ fontSize:"11px", color:accent, fontWeight:700 }}>{chDone}/{chapter.exercises.length}</span>
                  </div>
                  <div style={{ height:4, background:"var(--border)", borderRadius:2, overflow:"hidden" }}>
                    <div style={{ width:`${(chDone/Math.max(chapter.exercises.length,1))*100}%`, height:"100%", background:accent, borderRadius:2, transition:"width 0.3s" }} />
                  </div>
                </div>
              );
            })()}

            <div style={{ display:"flex", borderTop:"1px solid var(--border)" }}>
              {chIdx > 0 && <button onClick={() => { onNavigate(chIdx-1); onClose(); }} style={{ flex:1, padding:10, fontSize:"11px", fontWeight:600, color:"var(--text-3)", cursor:"pointer", borderRight:"1px solid var(--border)" }}>← Prev</button>}
              {chIdx < allChapters.length-1 && <button onClick={() => { onNavigate(chIdx+1); onClose(); }} style={{ flex:1, padding:10, fontSize:"11px", fontWeight:600, color:"var(--text-3)", cursor:"pointer" }}>Next →</button>}
            </div>
          </>
        ) : (
          <>
            {/* Home nav */}
            <div style={{ padding:"12px 10px 0" }}>
              <div style={{ fontSize:"10px", fontWeight:700, color:"var(--text-3)", letterSpacing:"0.1em", padding:"0 8px", marginBottom:4 }}>OVERVIEW</div>
              {[{label:"All chapters",v:"chapters",count:chapters.length},{label:"Glossary",v:"glossary",count:glossary.length}].map(item => (
                <button key={item.v} onClick={() => { setView(item.v); setActiveTag(null); setSearch(""); onClose(); }} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"7px 10px", borderRadius:8, background: view===item.v&&!activeTag?"#eef0fb":"transparent", color: view===item.v&&!activeTag?"#3451d1":"var(--text-1)", fontSize:"13px", fontWeight: view===item.v&&!activeTag?700:500, marginBottom:2, cursor:"pointer", textAlign:"left" }}>
                  <span>{item.label}</span>
                  <span style={{ fontSize:"11px", background:"var(--bg)", color:"var(--text-3)", padding:"1px 7px", borderRadius:10, fontWeight:700 }}>{item.count}</span>
                </button>
              ))}
            </div>

            <div style={{ padding:"14px 10px 0", flex:1, overflowY:"auto" }}>
              {categoryGroups.map(group => (
                <div key={group.label} style={{ marginBottom:14 }}>
                  <div style={{ fontSize:"10px", fontWeight:700, color:"var(--text-3)", letterSpacing:"0.1em", padding:"0 8px", marginBottom:3 }}>{group.label.toUpperCase()}</div>
                  {group.tags.map(tag => {
                    const m = tagMeta[tag];
                    const isActive = activeTag === tag;
                    return (
                      <button key={tag} onClick={() => { setActiveTag(isActive?null:tag); setView("chapters"); setSearch(""); onClose(); }} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"7px 10px", borderRadius:8, background: isActive?m.bg:"transparent", color: isActive?m.color:"var(--text-1)", fontSize:"13px", fontWeight: isActive?700:500, marginBottom:2, cursor:"pointer", textAlign:"left" }}>
                        <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ width:6, height:6, borderRadius:"50%", background: isActive?m.color:"var(--border-2)", flexShrink:0 }} />
                          {m.label}
                        </span>
                        <span style={{ fontSize:"11px", background: isActive?`${m.color}22`:"var(--bg)", color: isActive?m.color:"var(--text-3)", padding:"1px 7px", borderRadius:10, fontWeight:700 }}>{tagCount(tag)}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div style={{ padding:"12px 16px 16px", borderTop:"1px solid var(--border)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:"11px", color:"var(--text-3)", fontWeight:600 }}>Overall progress</span>
                <span style={{ fontSize:"11px", color:"#3451d1", fontWeight:700 }}>{doneCount}/{totalEx}</span>
              </div>
              <div style={{ height:5, background:"var(--border)", borderRadius:3, overflow:"hidden" }}>
                <div style={{ width:`${Math.round((doneCount/totalEx)*100)}%`, height:"100%", background:"linear-gradient(90deg,#3451d1,#15803d)", borderRadius:3, transition:"width 0.4s" }} />
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

/* ── Chapter detail view ── */
function ChapterDetail({ chapter, chIdx, onBack, completed, onToggle, allChapters, onNavigate }) {
  const [secIdx, setSecIdx] = useState(0);
  const [tab, setTab] = useState("content");
  const [expanded, setExpanded] = useState(null);
  const [sideOpen, setSideOpen] = useState(false);
  const accent = tagMeta[chapter.tag]?.color || "#3451d1";
  const sec = chapter.sections[secIdx];

  // close sidebar on resize to desktop
  useEffect(() => {
    const fn = () => { if (window.innerWidth > 768) setSideOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  return (
    <div className="chapter-detail-layout">
      {/* Mobile topbar */}
      <div className="mobile-topbar">
        <HamburgerBtn onClick={() => setSideOpen(true)} />
        <span style={{ fontSize:"13px", fontWeight:700, color:"var(--text-1)", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Ch.{chapter.id} — {chapter.title}</span>
        <TagPill tag={chapter.tag} small />
      </div>

      <Sidebar mode="chapter" isOpen={sideOpen} onClose={() => setSideOpen(false)}
        chapter={chapter} chIdx={chIdx} tab={tab} setTab={setTab}
        secIdx={secIdx} setSecIdx={setSecIdx}
        expanded={expanded} setExpanded={setExpanded}
        completed={completed} onBack={onBack}
        onNavigate={onNavigate} allChapters={allChapters}
        view="" setView={()=>{}} activeTag={null} setActiveTag={()=>{}} setSearch={()=>{}}
      />

      <main className="chapter-content-main main-content-area">
        {tab === "content" && (
          <div className="chapter-content-inner">
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <TagPill tag={chapter.tag} small />
              <span style={{ fontSize:"11px", color:"var(--text-4)", fontFamily:"var(--font-mono)" }}>Section {secIdx+1} / {chapter.sections.length}</span>
            </div>
            <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(22px,4vw,30px)", fontWeight:400, margin:"0 0 28px", color:"var(--text-1)", letterSpacing:"-0.2px", lineHeight:1.25 }}>{sec.heading}</h1>
            <ContentRenderer content={sec.content} accent={accent} />
            {sec.googleInsight && <GoogleInsightPanel insights={sec.googleInsight} />}
            {sec.tips && <TipsPanel tips={sec.tips} accent={accent} />}
            {sec.caseStudy && <CaseStudyPanel cs={sec.caseStudy} accent={accent} />}

            <div style={{ display:"flex", justifyContent:"space-between", marginTop:44, paddingTop:20, borderTop:"1px solid var(--border)", flexWrap:"wrap", gap:10 }}>
              <div>{secIdx > 0 && <button onClick={() => setSecIdx(secIdx-1)} style={{ padding:"8px 18px", borderRadius:8, fontSize:"13px", fontWeight:500, color:"var(--text-3)", border:"1.5px solid var(--border)", cursor:"pointer" }}>← Previous</button>}</div>
              <div>
                {secIdx < chapter.sections.length-1
                  ? <button onClick={() => setSecIdx(secIdx+1)} style={{ padding:"8px 22px", borderRadius:8, fontSize:"13px", fontWeight:700, color:"#fff", background:accent, cursor:"pointer" }}>Next section →</button>
                  : <button onClick={() => setTab("exercises")} style={{ padding:"8px 22px", borderRadius:8, fontSize:"13px", fontWeight:700, color:"#fff", background:accent, cursor:"pointer" }}>Go to exercises →</button>
                }
              </div>
            </div>
          </div>
        )}

        {tab === "exercises" && (
          <div className="exercise-content-inner main-content-area">
            <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(20px,4vw,26px)", fontWeight:400, margin:"0 0 6px", color:"var(--text-1)" }}>Exercises</h1>
            <p style={{ color:"var(--text-3)", fontSize:"13px", margin:"0 0 24px", fontWeight:500 }}>Work through these alongside each section. Tap the circle to mark complete.</p>
            {chapter.exercises.map((ex, ei) => {
              const key = `${chapter.id}-${ei}`;
              const done = completed[key];
              const isOpen = expanded === key;
              const dc = diffMeta[ex.difficulty] || diffMeta.Beginner;
              return (
                <div key={ei} style={{ background:"var(--surface)", border:`1.5px solid ${done?accent+"44":"var(--border)"}`, borderRadius:14, marginBottom:10, overflow:"hidden", boxShadow:"var(--shadow)" }}>
                  <div style={{ padding:"16px 18px", display:"flex", alignItems:"flex-start", gap:13, cursor:"pointer" }} onClick={() => setExpanded(isOpen?null:key)}>
                    <button onClick={e => { e.stopPropagation(); onToggle(key); }} style={{ width:22, height:22, borderRadius:"50%", border:`2px solid ${done?accent:"var(--border-2)"}`, background: done?accent:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, cursor:"pointer", marginTop:1, transition:"all 0.15s" }}>
                      {done && <svg width="10" height="7" viewBox="0 0 10 7"><path d="M1 3.5l2.5 2.5 5.5-5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </button>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4, flexWrap:"wrap" }}>
                        <span style={{ fontSize:"14px", fontWeight:700, color: done?accent:"var(--text-1)" }}>{ex.title}</span>
                        <span style={{ padding:"2px 8px", borderRadius:5, fontSize:"10px", fontWeight:700, background:dc.bg, color:dc.color }}>{ex.difficulty}</span>
                        <span style={{ fontSize:"11px", color:"var(--text-4)", fontWeight:500 }}>⏱ {ex.time}</span>
                      </div>
                      <p style={{ margin:0, fontSize:"12px", color:"var(--text-3)", lineHeight:1.45, fontWeight:500 }}>{ex.goal}</p>
                    </div>
                    <span style={{ color:"var(--text-4)", fontSize:"11px", flexShrink:0, marginTop:4 }}>{isOpen?"▲":"▼"}</span>
                  </div>
                  {isOpen && (
                    <div style={{ borderTop:"1px solid var(--border)", padding:"16px 18px 18px 53px", background:"var(--surface-2)" }}>
                      <div style={{ fontSize:"10px", fontWeight:700, color:"var(--text-4)", letterSpacing:"0.1em", marginBottom:8 }}>TASK</div>
                      <p style={{ margin:"0 0 14px", fontSize:"13px", color:"var(--text-2)", lineHeight:1.8 }}>{ex.task}</p>
                      <button onClick={() => onToggle(key)} style={{ padding:"7px 16px", borderRadius:7, fontSize:"12px", fontWeight:700, background: done?"#fff":accent, color: done?accent:"#fff", border:`1.5px solid ${done?accent:"transparent"}`, cursor:"pointer" }}>
                        {done?"✓ Marked complete — undo?":"Mark as complete"}
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

/* ── Home view ── */
export default function App() {
  const [active, setActive] = useState(null);
  const [completed, setCompleted] = useState({});
  const [view, setView] = useState("chapters");
  const [activeTag, setActiveTag] = useState(null);
  const [search, setSearch] = useState("");
  const [sideOpen, setSideOpen] = useState(false);

  const toggle = key => setCompleted(p => ({ ...p, [key]: !p[key] }));

  const filtered = useMemo(() => {
    let list = chapters;
    if (activeTag) list = list.filter(c => c.tag === activeTag);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => c.title.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q) || c.sections.some(s => s.heading.toLowerCase().includes(q)));
    }
    return list;
  }, [activeTag, search]);

  useEffect(() => {
    const fn = () => { if (window.innerWidth > 768) setSideOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  if (active !== null) {
    return <ChapterDetail chapter={chapters[active]} chIdx={active} onBack={() => setActive(null)} onNavigate={i => { setActive(i); }} completed={completed} onToggle={toggle} allChapters={chapters} />;
  }

  const tagCount = tag => chapters.filter(c => c.tag === tag).length;
  const totalEx = chapters.reduce((a,c) => a + c.exercises.length, 0);
  const doneCount = Object.values(completed).filter(Boolean).length;

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--bg)" }}>
      {/* Mobile topbar */}
      <div className="mobile-topbar">
        <HamburgerBtn onClick={() => setSideOpen(true)} />
        <span style={{ fontSize:"14px", fontWeight:700, color:"var(--text-1)" }}>SEO Mastery 2026</span>
        {doneCount > 0 && <span style={{ fontSize:"11px", color:"#3451d1", fontWeight:700, marginLeft:"auto" }}>{doneCount}/{totalEx}</span>}
      </div>

      <Sidebar mode="home" isOpen={sideOpen} onClose={() => setSideOpen(false)}
        view={view} setView={setView} activeTag={activeTag} setActiveTag={setActiveTag} setSearch={setSearch}
        completed={completed}
        chapter={null} chIdx={0} tab="" setTab={()=>{}} secIdx={0} setSecIdx={()=>{}} expanded={null} setExpanded={()=>{}}
        onBack={()=>{}} onNavigate={()=>{}} allChapters={chapters}
      />

      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {view === "chapters" && (
          <>
            <div className="topbar-row main-content-area">
              <div>
                <h2 className="topbar-title" style={{ fontSize:"17px", fontWeight:700, color:"var(--text-1)", margin:0 }}>
                  {activeTag ? (tagMeta[activeTag]?.label+" chapters") : "All chapters"}
                </h2>
                <div style={{ fontSize:"11px", color:"var(--text-3)", marginTop:1, fontWeight:500 }}>{filtered.length} chapter{filtered.length!==1?"s":""} available</div>
              </div>
              <div className="topbar-search" style={{ display:"flex", alignItems:"center", gap:8, background:"var(--bg)", border:"1.5px solid var(--border)", borderRadius:10, padding:"7px 14px", width:230 }}>
                <span style={{ color:"var(--text-4)", fontSize:14 }}>⌕</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search chapters..." style={{ border:"none", background:"none", outline:"none", fontSize:"13px", color:"var(--text-1)", width:"100%", fontWeight:500 }} />
              </div>
            </div>

            {/* Mobile search bar */}
            <div style={{ display:"none" }} className="mobile-search-wrapper">
              <div style={{ padding:"10px 14px", background:"var(--surface)", borderBottom:"1px solid var(--border)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, background:"var(--bg)", border:"1.5px solid var(--border)", borderRadius:8, padding:"7px 12px" }}>
                  <span style={{ color:"var(--text-4)", fontSize:14 }}>⌕</span>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search chapters..." style={{ border:"none", background:"none", outline:"none", fontSize:"13px", color:"var(--text-1)", width:"100%", fontWeight:500 }} />
                </div>
              </div>
            </div>

            <div className="main-pad main-content-area">
              {filtered.length === 0 ? (
                <div style={{ textAlign:"center", padding:"80px 0", color:"var(--text-4)" }}>
                  <div style={{ fontSize:"14px", fontWeight:500 }}>No chapters match your search</div>
                </div>
              ) : (
                <div className="chapter-grid">
                  {filtered.map((ch) => {
                    const chIdx = chapters.indexOf(ch);
                    const m = tagMeta[ch.tag] || { color:"#555", bg:"#f0f0f0" };
                    const chDone = ch.exercises.filter((_,ei) => completed[`${ch.id}-${ei}`]).length;
                    const caseCount = ch.sections.filter(s => s.caseStudy).length;
                    const tipCount = ch.sections.filter(s => s.tips).length;
                    const googleCount = ch.sections.filter(s => s.googleInsight).length;
                    return (
                      <div key={ch.id} onClick={() => setActive(chIdx)}
                        style={{ background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:16, padding:20, cursor:"pointer", boxShadow:"var(--shadow)", transition:"box-shadow 0.15s, border-color 0.15s", display:"flex", flexDirection:"column", gap:12 }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow="var(--shadow-md)"; e.currentTarget.style.borderColor=m.color+"40"; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow="var(--shadow)"; e.currentTarget.style.borderColor="var(--border)"; }}>
                        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
                          <ChNum n={ch.id} accent={m.color} />
                          <TagPill tag={ch.tag} small />
                        </div>
                        <div>
                          <h3 style={{ fontFamily:"var(--font-display)", fontSize:16, fontWeight:400, margin:"0 0 4px", color:"var(--text-1)", lineHeight:1.3 }}>{ch.title}</h3>
                        </div>
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                          <span style={{ fontSize:"11px", color:"var(--text-3)", background:"var(--bg)", padding:"2px 8px", borderRadius:5, fontWeight:500 }}>{ch.sections.length} sections</span>
                          <span style={{ fontSize:"11px", color:"var(--text-3)", background:"var(--bg)", padding:"2px 8px", borderRadius:5, fontWeight:500 }}>{ch.exercises.length} exercises</span>
                          {caseCount > 0 && <span style={{ fontSize:"11px", color:m.color, background:m.bg, padding:"2px 8px", borderRadius:5, fontWeight:600 }}>📖 {caseCount} case stud{caseCount===1?"y":"ies"}</span>}
                          {tipCount > 0 && <span style={{ fontSize:"11px", color:m.color, background:m.bg, padding:"2px 8px", borderRadius:5, fontWeight:600 }}>→ {tipCount} tip sheet{tipCount>1?"s":""}</span>}
                          {googleCount > 0 && <span style={{ fontSize:"11px", color:"#4285f4", background:"#e8f0fe", padding:"2px 8px", borderRadius:5, fontWeight:600 }}>G official</span>}
                        </div>
                        {chDone > 0 ? (
                          <div>
                            <div style={{ height:3, background:"var(--border)", borderRadius:2, overflow:"hidden", marginBottom:4 }}>
                              <div style={{ width:`${(chDone/ch.exercises.length)*100}%`, height:"100%", background:m.color, borderRadius:2 }} />
                            </div>
                            <span style={{ fontSize:"10px", color:m.color, fontWeight:700 }}>{chDone}/{ch.exercises.length} exercises done</span>
                          </div>
                        ) : (
                          <div style={{ fontSize:"11px", color:"var(--text-4)", fontWeight:600, marginTop:"auto" }}>Open chapter →</div>
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
            <div className="topbar-row main-content-area">
              <div>
                <h2 style={{ fontSize:"17px", fontWeight:700, color:"var(--text-1)", margin:0 }}>Glossary</h2>
                <div style={{ fontSize:"11px", color:"var(--text-3)", marginTop:1, fontWeight:500 }}>{glossary.length} terms defined</div>
              </div>
              <div className="topbar-search" style={{ display:"flex", alignItems:"center", gap:8, background:"var(--bg)", border:"1.5px solid var(--border)", borderRadius:10, padding:"7px 14px", width:230 }}>
                <span style={{ color:"var(--text-4)", fontSize:14 }}>⌕</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search terms..." style={{ border:"none", background:"none", outline:"none", fontSize:"13px", color:"var(--text-1)", width:"100%", fontWeight:500 }} />
              </div>
            </div>
            <div className="main-pad main-content-area">
              <div className="glossary-grid">
                {glossary.filter(g => !search || g.term.toLowerCase().includes(search.toLowerCase()) || g.full.toLowerCase().includes(search.toLowerCase()) || g.desc.toLowerCase().includes(search.toLowerCase())).map((item, i) => {
                  const ch = chapters[item.ch-1];
                  const m = tagMeta[ch?.tag] || { color:"#555", bg:"#f0f0f0" };
                  return (
                    <div key={i} onClick={() => { setActive(item.ch-1); setView("chapters"); setSearch(""); }}
                      style={{ background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:12, padding:"15px 17px", cursor:"pointer", boxShadow:"var(--shadow)" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor=m.color+"40"; e.currentTarget.style.boxShadow="var(--shadow-md)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.boxShadow="var(--shadow)"; }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6, gap:8 }}>
                        <code style={{ fontSize:"12px", fontWeight:700, color:m.color, background:m.bg, padding:"2px 8px", borderRadius:5, fontFamily:"var(--font-mono)" }}>{item.term}</code>
                        <TagPill tag={ch?.tag} small />
                      </div>
                      <div style={{ fontSize:"12px", fontWeight:700, color:"var(--text-1)", marginBottom:3 }}>{item.full}</div>
                      <div style={{ fontSize:"12px", color:"var(--text-3)", lineHeight:1.5, fontWeight:500 }}>{item.desc}</div>
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
