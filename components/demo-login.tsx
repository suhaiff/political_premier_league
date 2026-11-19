"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, ArrowRight, BadgeCheck, Eye, Gavel, Shield, Users } from "lucide-react"
import type { Role } from "@/lib/ppl-data"

const choices: { role: Role; title: string; description: string; icon: typeof Shield }[] = [
  { role: "admin", title: "League Admin", description: "Manage franchises, candidates and the auction", icon: Shield },
  { role: "owner", title: "Team Owner", description: "Build your roster and manage your franchise", icon: Gavel },
  { role: "player", title: "Player", description: "View your player card, team and season stats", icon: BadgeCheck },
  { role: "viewer", title: "Viewer", description: "Follow matches, teams and the tournament", icon: Eye },
]
const destinations: Record<Role, string> = { admin: "/admin/dashboard", owner: "/owner/dashboard", player: "/player/dashboard", viewer: "/viewer/dashboard" }

export function DemoLogin() {
  const router = useRouter()
  const [role, setRole] = useState<Role>("viewer")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  return <main className="login-page"><header className="login-header"><Link href="/" className="app-brand"><span className="app-brand-mark">P<span>.</span></span><span>POLITICAL<br />PREMIER LEAGUE</span></Link><Link className="login-back" href="/"><ArrowLeft size={15} /> Public homepage</Link></header><div className="login-layout"><section className="login-intro"><span className="workspace-eyebrow">PPL · INAUGURAL SEASON</span><h1>Welcome to<br /><em>the league.</em></h1><p>Choose a demo role to explore the PPL application. This frontend prototype does not provide real authentication or access control.</p><div className="login-feature"><Users size={17} /><span>Four role-specific workspaces</span></div><div className="login-feature"><Gavel size={17} /><span>Interactive local auction simulation</span></div><div className="login-feature"><Shield size={17} /><span>Fictional teams, players and fixtures</span></div><span className="login-watermark">PPL <b>·</b> 25</span></section><section className="login-card"><div className="login-card-heading"><span className="workspace-eyebrow">DEVELOPMENT PREVIEW</span><h2>Enter the league office.</h2><p>Select a role to continue into its demo workspace.</p></div><div className="role-choice-grid">{choices.map((choice) => { const Icon = choice.icon; return <button type="button" key={choice.role} className={`role-choice ${role === choice.role ? "selected" : ""}`} onClick={() => { setRole(choice.role); setError("") }} aria-pressed={role === choice.role}><span className="role-choice-icon"><Icon size={18} /></span><span><strong>{choice.title}</strong><small>{choice.description}</small></span><i>{role === choice.role ? <BadgeCheck size={17} /> : null}</i></button> })}</div><label className="login-label" htmlFor="demo-email">EMAIL ADDRESS <span>OPTIONAL FOR DEMO</span></label><input id="demo-email" className="login-input" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} /><button className="login-submit" onClick={() => { if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email address or leave this field empty."); return } router.push(destinations[role]) }}>Continue as {choices.find((choice) => choice.role === role)?.title} <ArrowRight size={16} /></button>{error && <p className="login-error" role="alert">{error}</p>}<div className="login-disclaimer"><Shield size={15} /><span>Demo role switching is for UI exploration only. It does not authenticate users or secure data.</span></div></section></div><footer className="login-footer">PPL · AN INDEPENDENT FICTIONAL SPORTS CONCEPT <span>LOCAL FRONTEND DEMO</span></footer></main>
}
