"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, ArrowUpRight, BadgeCheck, CalendarDays, ChartNoAxesCombined, CircleMinus, Gavel, LayoutDashboard, Menu, Radio, Search, Settings2, Shield, Trophy, UserRound, UserRoundCog, Users, X, ArrowLeftRight, Bell } from "lucide-react"
import { roleMeta, type Role } from "@/lib/ppl-data"
import { usePplStore } from "@/lib/ppl-store"

const icons = { LayoutDashboard, Shield, Users, Gavel, BadgeCheck, CircleMinus, UserRoundCog, Radio, CalendarDays, Trophy, Settings2, UserRound, ArrowLeftRight, ChartNoAxesCombined, Search }
const roleStart: Record<Role, string> = { admin: "/admin/dashboard", owner: "/owner/dashboard", player: "/player/dashboard", viewer: "/viewer/dashboard" }

export function AppShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [roleMenu, setRoleMenu] = useState(false)
  const toast = usePplStore((state) => state.toast)
  const clearToast = usePplStore((state) => state.clearToast)
  const meta = roleMeta[role]
  const activeTitle = meta.nav.find((item) => item.href === pathname)?.label ?? pathname.split("/").filter(Boolean).at(-1)?.replace(/-/g, " ") ?? "Dashboard"
  return <div className="app-frame">
    {open && <button aria-label="Close navigation overlay" className="app-sidebar-overlay" onClick={() => setOpen(false)} />}
    <aside className={`app-sidebar ${open ? "app-sidebar-open" : ""}`}>
      <div className="app-brand-row"><Link href="/" className="app-brand"><span className="app-brand-mark">P<span>.</span></span><span>POLITICAL<br />PREMIER LEAGUE</span></Link><button className="app-sidebar-close" aria-label="Close menu" onClick={() => setOpen(false)}><X size={18} /></button></div>
      <div className="app-season"><span className="app-season-dot" /> INAUGURAL SEASON <b>2025</b></div>
      <div className="app-role-label">{meta.title}</div>
      <nav className="app-nav" aria-label={`${meta.label} navigation`}>{meta.nav.map((item) => { const NavIcon = icons[item.icon as keyof typeof icons]; const active = pathname === item.href || pathname.startsWith(item.href + "/"); return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`app-nav-link ${active ? "active" : ""}`}><NavIcon size={17} strokeWidth={1.7} /><span>{item.label}</span>{item.label === "Live auction" && <i className="nav-live-dot" />}</Link> })}</nav>
      <div className="app-sidebar-bottom"><div className="demo-connection"><span className="demo-connection-dot" /><span>DEMO MODE<br /><small>Local prototype data</small></span></div><Link href="/" className="back-public"><ArrowLeft size={14} /> Back to public site</Link></div>
    </aside>
    <div className="app-main-area">
      <header className="app-topbar"><button className="app-menu-button" aria-label="Open navigation" onClick={() => setOpen(true)}><Menu /></button><div className="app-breadcrumb"><span>LEAGUE OFFICE</span><b>/</b><strong>{activeTitle}</strong></div><div className="app-top-actions"><span className="app-live-status"><i /> LOCAL DEMO</span><button className="app-bell" aria-label="Notifications" onClick={() => usePplStore.getState().notify("No new league notifications.")}><Bell size={17} /></button><div className="app-role-switch"><button onClick={() => setRoleMenu(!roleMenu)} aria-expanded={roleMenu}><span className="role-avatar">{role === "admin" ? "AD" : role === "owner" ? "TO" : role === "player" ? "PL" : "VW"}</span><span className="role-user-text"><strong>{role === "admin" ? "League Admin" : role === "owner" ? "Aarav Kapoor" : role === "player" ? "Mira Sen" : "Guest Viewer"}</strong><small>{meta.label} · Demo</small></span><span className="switch-chevron">⌄</span></button>{roleMenu && <div className="role-dropdown"><span>SWITCH DEMO ROLE</span>{(Object.keys(roleMeta) as Role[]).map((nextRole) => <Link key={nextRole} href={roleStart[nextRole]} onClick={() => setRoleMenu(false)}>{roleMeta[nextRole].label}<ArrowUpRight size={13} /></Link>)}</div>}</div></div></header>
      <div className="app-page-content">{children}<footer className="app-footnote">PPL · FRONTEND DEMONSTRATION <span>NOT CONNECTED TO A LIVE LEAGUE</span></footer></div>
    </div>
    {toast && <div className="app-toast" role="status"><span />{toast}<button onClick={clearToast} aria-label="Dismiss notification"><X size={14} /></button></div>}
  </div>
}
