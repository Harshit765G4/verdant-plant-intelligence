
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  CircleHelp,
  FlaskConical,
  History,
  Leaf,
  LayoutDashboard,
  ScanSearch,
} from "lucide-react";
import type { ReactNode } from "react";

const navigation = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Analyze a leaf", href: "/analyze", icon: ScanSearch },
  { label: "Scan history", href: "/history", icon: History },
  { label: "Disease library", href: "/library", icon: BookOpen },
  { label: "Model insights", href: "/insights", icon: FlaskConical },
];

export default function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="brand" aria-label="Verdant home">
          <span className="brand-mark">
            <Leaf size={23} strokeWidth={1.8} />
          </span>
          <span>
            <span className="brand-name">Verdant</span>
            <span className="brand-caption" style={{ display: "block" }}>
              PLANT INTELLIGENCE
            </span>
          </span>
        </Link>

        <div className="nav-label">Workspace</div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={17} strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <div className="sidebar-note-title">
              <CircleHelp size={16} />
              Research preview
            </div>
            <p>
              Predictions can be wrong, especially on photographs that differ
              from the model&apos;s training data.
            </p>
          </div>
          <div className="sidebar-version">MOBILENETV2 · 39 CLASSES</div>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span aria-hidden="true"> / </span>{" "}
            <strong>
              {navigation.find((item) =>
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href),
              )?.label ?? "Overview"}
            </strong>
          </div>

          <div className="topbar-meta">
            <span className="local-badge">
              <Activity size={13} />
              Model workspace
            </span>
            <span className="neutral-badge">Research preview</span>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
