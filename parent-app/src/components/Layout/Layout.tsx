import { NavLink, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import './Layout.css';
interface NavItem {
    to: string;
    icon: string;
    label: string;
}

const NAV_ITEMS: NavItem[] = [
    { to: '/', icon: '⊞', label: 'Dashboard' },
    { to: '/audit', icon: '🔍', label: 'Audit Logs' },
    { to: '/settings', icon: '⚙', label: 'Settings' },
];

const PAGE_TITLES: Record<string, string> = {
    '/': 'Dashboard',
    '/audit': 'Audit Logs',
    '/settings': 'Settings',
};

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const { pathname } = useLocation();
    const title = PAGE_TITLES[pathname] ?? 'Management Portal';

    return (
        <div className="layout">
            {/* ── Sidebar ── */}
            <aside className="sidebar">
                <div className="sidebar__brand">
                    <div className="sidebar__brand-icon">🛡</div>
                    <span className="sidebar__brand-name">Portal</span>
                </div>

                <nav className="sidebar__nav">
                    <span className="sidebar__section-label">Main</span>
                    {NAV_ITEMS.map(({ to, icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) =>
                                `sidebar__link${isActive ? ' active' : ''}`
                            }
                        >
                            <span className="sidebar__link-icon">{icon}</span>
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar__footer">
                    <div className="sidebar__user">
                        <div className="sidebar__avatar">A</div>
                        <div className="sidebar__user-info">
                            <div className="sidebar__user-name">Admin User</div>
                            <div className="sidebar__user-role">Administrator</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className="main">
                <header className="topbar">
                    <span className="topbar__title">{title}</span>
                    <div className="topbar__actions">
                        <span className="topbar__badge">
                            <span className="topbar__dot" />
                            System Online
                        </span>
                    </div>
                </header>

                <main className="main__content">
                    {children}
                </main>
            </div>
        </div>
    );
}
