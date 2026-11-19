"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, ChevronDown, Clock3, Menu, Trophy, Users, X } from "lucide-react"
import { resolveMatchConfiguration } from "@/lib/match-rules"
import { usePplStore } from "@/lib/ppl-store"

const teams = [
  { name: "Northern Hawks", city: "NORTH", mark: "NH", color: "#e7b84f" },
  { name: "Coastal Royals", city: "COAST", mark: "CR", color: "#63a9c7" },
  { name: "Capital Chargers", city: "CAPITAL", mark: "CC", color: "#e26e55" },
  { name: "Western Wolves", city: "WEST", mark: "WW", color: "#a88bdd" },
  { name: "Eastern Falcons", city: "EAST", mark: "EF", color: "#66b994" },
  { name: "Southern Strikers", city: "SOUTH", mark: "SS", color: "#dc8a4a" },
  { name: "Royal Independents", city: "ROYAL", mark: "RI", color: "#d76b88" },
  { name: "Frontier Titans", city: "FRONTIER", mark: "FT", color: "#8b9bb3" },
]

const candidates = [
  { name: "Arjun Mehta", role: "THE STRATEGIST", position: "Opening batter", stat: "88", color: "#c98a5f", initials: "AM", detail: "Calm under pressure. A natural leader at the crease." },
  { name: "Mira Sen", role: "THE GAME-CHANGER", position: "All-rounder", stat: "94", color: "#9a786a", initials: "MS", detail: "Reads the room. Turns the tide when it matters." },
  { name: "Kabir Rao", role: "THE PACESETTER", position: "Fast bowler", stat: "91", color: "#718394", initials: "KR", detail: "Relentless energy. Makes every moment count." },
]

const fixtures = [
  { date: "18", month: "JUN", home: "Northern Hawks", away: "Coastal Royals", venue: "Meridian Oval, Northport", time: "19:30" },
  { date: "20", month: "JUN", home: "Capital Chargers", away: "Western Wolves", venue: "Crown Stadium, Capital City", time: "19:30" },
  { date: "22", month: "JUN", home: "Eastern Falcons", away: "Southern Strikers", venue: "The Foundry, Eastvale", time: "16:00" },
]

function SectionHeading({ kicker, title, link }: { kicker: string; title: string; link?: string }) {
  return <div className="section-heading"><div><span className="eyebrow">{kicker}</span><h2>{title}</h2></div>{link && <a className="text-link" href="#teams">{link}<ArrowUpRight size={15} /></a>}</div>
}

export function PplHome() {
  const [menuOpen, setMenuOpen] = useState(false)
  const activeFixtures = usePplStore((state) => state.fixtures)
  const tournamentConfig = usePplStore((state) => state.tournamentConfig)
  const formatOverrides = usePplStore((state) => state.matchFormatOverrides)
  const ruleOverrides = usePplStore((state) => state.matchRuleOverrides)
  const fixtureCards = fixtures.map((fixture, index) => {
    const match = activeFixtures[index]
    const formatId = match ? formatOverrides[match.id] ?? match.formatId ?? tournamentConfig.formatId : tournamentConfig.formatId
    const configuration = resolveMatchConfiguration(formatId, tournamentConfig, match ? ruleOverrides[match.id] : undefined)
    return { ...fixture, formatLabel: `${configuration.shortLabel} · ${configuration.oversPerInnings} OVERS` }
  })
  const closeMenu = () => setMenuOpen(false)
  return (
    <main>
      <div className="topline"><span>THE INAUGURAL SEASON · 2025</span><span className="topline-right"><i /> A NEW GAME IS COMING</span></div>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="PPL home"><span className="brand-mark">P<span>.</span></span><span className="brand-name">POLITICAL<br />PREMIER LEAGUE</span></a>
        <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
          {[{ label: "Home", href: "/" }, { label: "Teams", href: "/teams" }, { label: "Candidates", href: "/candidates" }, { label: "Auction", href: "/auction" }, { label: "Matches", href: "/matches" }, { label: "Standings", href: "/standings" }].map((item) => <a key={item.label} href={item.href} onClick={closeMenu}>{item.label}</a>)}
          <a className="mobile-login" href="/login" onClick={closeMenu}>Login <ArrowUpRight size={14} /></a>
        </nav>
        <a className="login-link" href="/login">Login <ArrowUpRight size={14} /></a>
        <button className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="hero" id="home">
        <Image className="hero-image" src="/ppl-stadium.png" alt="A floodlit cricket stadium at night" fill priority sizes="100vw" />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="hero-kicker"><span className="live-dot" /> A LEAGUE OF ITS OWN <span className="kicker-line" /></div>
          <h1>THE GAME.<br /><em>REIMAGINED.</em></h1>
          <p className="hero-copy">Eight teams. One trophy. A whole new way to play.<br className="desktop-break" /> The next chapter of cricket starts here.</p>
          <div className="hero-actions"><a className="button-gold" href="#teams">EXPLORE THE LEAGUE <ArrowRight size={16} /></a><a className="button-quiet" href="#auction"><span className="play-icon">↓</span> THE AUCTION STORY</a></div>
          <div className="hero-note"><span>01</span><span className="note-rule" /> THE INAUGURAL SEASON</div>
        </div>
        <div className="hero-side-label">SPORT · STRATEGY · SPECTACLE</div>
        <a className="scroll-cue" href="#teams" aria-label="Scroll to teams"><ArrowDown size={16} /></a>
        <div className="hero-index">PPL <span>/</span> 25</div>
      </section>

      <section className="ticker" aria-label="League highlights"><div className="ticker-track">{Array.from({ length: 4 }).map((_, i) => <span key={i}>THE PEOPLE&apos;S GAME <b>✳</b> EIGHT FRANCHISES <b>✳</b> ONE CHAMPION <b>✳</b> YOUR TEAM. YOUR CALL. <b>✳</b></span>)}</div></section>

      <section className="section teams-section" id="teams">
        <SectionHeading kicker="01 / THE FRANCHISES" title="Find your side." link="MEET ALL TEAMS" />
        <p className="section-intro">Eight founding franchises. Eight distinct identities. Which colors will you wear?</p>
        <div className="team-grid">{teams.map((team, i) => <a href="#fixtures" className="team-card" key={team.mark} style={{ "--team-color": team.color } as React.CSSProperties}><span className="team-number">0{i + 1}</span><div className="team-emblem"><span>{team.mark}</span><i /></div><span className="team-city">{team.city} DIVISION</span><strong>{team.name}</strong><span className="team-arrow"><ArrowUpRight size={16} /></span></a>)}</div>
      </section>

      <section className="auction-band" id="auction"><div className="auction-glow" /><div className="auction-inner"><div className="auction-copy"><span className="eyebrow">THE MOMENT EVERYTHING CHANGES</span><h2>The first<br /><em>call is yours.</em></h2><p>Eight franchises. A room full of possibilities.<br />The inaugural player auction is almost here.</p><a href="#candidates" className="button-gold">GET TO KNOW THE PLAYERS <ArrowRight size={16} /></a></div><div className="auction-countdown"><span className="countdown-label"><Clock3 size={15} /> COUNTDOWN TO THE AUCTION</span><div className="countdown-units"><div><strong>--</strong><span>DAYS</span></div><b>:</b><div><strong>--</strong><span>HRS</span></div><b>:</b><div><strong>--</strong><span>MIN</span></div></div><span className="countdown-note">DATE TO BE ANNOUNCED</span><div className="auction-seal"><span>THE<br />INAUGURAL<br />AUCTION</span><Trophy size={20} /></div></div></div></section>

      <section className="section candidates-section" id="candidates"><SectionHeading kicker="02 / THE ROSTER" title="Meet the contenders." /><div className="demo-label"><span /> FICTIONAL DEMONSTRATION PROFILES · NOT REAL PEOPLE</div><div className="candidate-grid">{candidates.map((person, i) => <article className="candidate-card" key={person.initials}><div className="candidate-art" style={{ "--portrait-tone": person.color } as React.CSSProperties}><span className="candidate-index">PPL / 0{i + 1}</span><div className="portrait-orb"><span>{person.initials}</span></div><span className="candidate-role">{person.role}</span><span className="rating"><strong>{person.stat}</strong><small>OVR</small></span></div><div className="candidate-info"><div><h3>{person.name}</h3><span>{person.position}</span></div><ArrowUpRight size={18} /></div><p>{person.detail}</p></article>)}</div></section>

      <section className="activity-section" id="standings"><div className="section activity-layout"><div className="activity-intro"><span className="eyebrow">03 / THE LIVE BOARD</span><h2>Every bid.<br /><em>Every move.</em></h2><p>Follow the story as each franchise builds a squad from the ground up.</p><a href="#fixtures" className="text-link">EXPLORE THE AUCTION <ArrowRight size={15} /></a></div><div className="activity-panel"><div className="panel-top"><div><span className="panel-dot" /> RECENT AUCTION ACTIVITY</div><span className="demo-tag">DEMO DATA</span></div>{[{ n: "Mira Sen", t: "All-rounder", team: "Coastal Royals", bid: "₹ 12.4L", color: "#63a9c7" }, { n: "Arjun Mehta", t: "Opening batter", team: "Northern Hawks", bid: "₹ 10.8L", color: "#e7b84f" }, { n: "Kabir Rao", t: "Fast bowler", team: "Capital Chargers", bid: "₹ 9.6L", color: "#e26e55" }].map((p, i) => <div className="activity-row" key={p.n}><span className="activity-order">0{i + 1}</span><span className="activity-avatar" style={{ "--team-color": p.color } as React.CSSProperties}>{p.n.split(" ").map(x => x[0]).join("")}</span><div className="activity-person"><strong>{p.n}</strong><span>{p.t}</span></div><div className="activity-team">{p.team}</div><strong className="activity-bid">{p.bid}</strong></div>)}<div className="panel-foot">ILLUSTRATIVE AUCTION ACTIVITY <span>NOT LIVE</span></div></div></div></section>

      <section className="section fixtures-section" id="matches"><div id="fixtures"><div className="section-heading"><div><span className="eyebrow">04 / MARK YOUR CALENDAR</span><h2>The season starts here.</h2></div><a className="text-link" href="/matches">FULL FIXTURE LIST <ArrowUpRight size={15} /></a></div></div><div className="fixture-list">{fixtureCards.map((f, i) => <article className="fixture-row" key={f.date}><div className="fixture-date"><strong>{f.date}</strong><span>{f.month} <i>·</i> 2025</span></div><div className="fixture-match"><span className="fixture-team"><b style={{ "--team-color": teams[i * 2].color } as React.CSSProperties}>{teams[i * 2].mark}</b>{f.home}</span><span className="versus">VS</span><span className="fixture-team"><b style={{ "--team-color": teams[i * 2 + 1].color } as React.CSSProperties}>{teams[i * 2 + 1].mark}</b>{f.away}</span></div><div className="fixture-venue"><span><CalendarDays size={14} /> {f.venue}</span><span><Clock3 size={14} /> {f.time} LOCAL</span><span className="fixture-format-copy">{f.formatLabel} / INNINGS</span></div><a className="fixture-arrow" href="#auction" aria-label={`Details for ${f.home} versus ${f.away}`}><ArrowUpRight size={18} /></a></article>)}</div><p className="fixture-note">* DEMONSTRATION SCHEDULE · FIXTURES SUBJECT TO CHANGE</p></section>

      <section className="stats-band"><div className="stats-inner"><div className="stats-title"><span className="eyebrow">BUILT FOR THE MOMENT</span><h2>A new kind<br />of <em>game.</em></h2></div><div className="stat-cell"><Users size={19} /><strong>08</strong><span>FOUNDING<br />FRANCHISES</span></div><div className="stat-cell"><Trophy size={19} /><strong>01</strong><span>CHAMPION’S<br />TROPHY</span></div><div className="stat-cell"><CalendarDays size={19} /><strong>01</strong><span>INAUGURAL<br />SEASON</span></div><div className="stat-cell"><ChevronDown size={19} /><strong>∞</strong><span>WAYS TO<br />PLAY</span></div></div></section>

      <footer className="site-footer" id="footer"><div className="footer-top"><a className="brand" href="#home"><span className="brand-mark">P<span>.</span></span><span className="brand-name">POLITICAL<br />PREMIER LEAGUE</span></a><p>Cricket, with a twist.<br />A league for the people.</p><a className="footer-cta" href="#teams">CHOOSE YOUR SIDE <ArrowUpRight size={16} /></a></div><div className="footer-bottom"><span>© 2025 POLITICAL PREMIER LEAGUE</span><span>AN INDEPENDENT FICTIONAL SPORTS CONCEPT</span><div><a href="#home">INSTAGRAM</a><a href="#home">X / TWITTER</a><a href="#home">COMMUNITY</a></div></div></footer>
    </main>
  )
}
