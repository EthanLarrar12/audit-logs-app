import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const STATS = [
    { label: 'Total Events', value: '24,821', change: '+12% vs last month', up: true, icon: '📋', variant: 'blue' },
    { label: 'Active Users', value: '138', change: '+4 today', up: true, icon: '👥', variant: 'green' },
    { label: 'Warnings', value: '17', change: '-3 vs yesterday', up: false, icon: '⚠️', variant: 'yellow' },
    { label: 'Failed Logins', value: '5', change: '+2 vs yesterday', up: true, icon: '🔒', variant: 'red' },
];

const ACTIVITY = [
    { color: 'var(--color-success)', action: <><strong>admin@mirage.io</strong> updated permissions for role <strong>Manager</strong></>, time: '2 min ago' },
    { color: 'var(--color-danger)', action: <><strong>ops@mirage.io</strong> failed login attempt (3rd)</>, time: '8 min ago' },
    { color: 'var(--color-accent)', action: <><strong>dev@mirage.io</strong> exported audit log report</>, time: '21 min ago' },
    { color: 'var(--color-warning)', action: <><strong>system</strong> detected unusual activity from IP 192.168.1.55</>, time: '34 min ago' },
    { color: 'var(--color-success)', action: <><strong>hr@mirage.io</strong> created new user <strong>john.doe</strong></>, time: '1 hr ago' },
    { color: 'var(--color-accent)', action: <><strong>admin@mirage.io</strong> modified entity <strong>Project Alpha</strong></>, time: '2 hr ago' },
];

const QUICK_LINKS = [
    { icon: '🔍', label: 'View Audit Logs', to: '/audit' },
    { icon: '⚙', label: 'System Settings', to: '/settings' },
];

export function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="dashboard">
            <div className="dashboard__header">
                <h1>Welcome back, Admin</h1>
                <p>Here's what's happening in your system today.</p>
            </div>

            {/* Stat cards */}
            <div className="dashboard__stats">
                {STATS.map((s) => (
                    <div key={s.label} className={`stat-card stat-card--${s.variant}`}>
                        <div className="stat-card__top">
                            <span className="stat-card__label">{s.label}</span>
                            <div className="stat-card__icon">{s.icon}</div>
                        </div>
                        <div className="stat-card__value">{s.value}</div>
                        <span className={`stat-card__change ${s.up ? 'up' : 'down'}`}>
                            {s.up ? '▲' : '▼'} {s.change}
                        </span>
                    </div>
                ))}
            </div>

            {/* Activity + Quick links */}
            <div className="dashboard__bottom">
                <div className="panel">
                    <div className="panel__title">Recent Activity</div>
                    <div className="activity-list">
                        {ACTIVITY.map((a, i) => (
                            <div key={i} className="activity-item">
                                <div className="activity-item__dot" style={{ background: a.color }} />
                                <div className="activity-item__text">
                                    <div className="activity-item__action">{a.action}</div>
                                    <div className="activity-item__time">{a.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="panel">
                    <div className="panel__title">Quick Links</div>
                    <div className="quick-links">
                        {QUICK_LINKS.map((l) => (
                            <button key={l.to} className="quick-link" onClick={() => navigate(l.to)}>
                                <span className="quick-link__icon">{l.icon}</span>
                                {l.label}
                                <span className="quick-link__arrow">›</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
