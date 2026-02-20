import { useState } from 'react';
import './Settings.css';

export function Settings() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [twoFactor, setTwoFactor] = useState(false);
    const [auditUrl, setAuditUrl] = useState('http://localhost:8000');

    return (
        <div className="settings">
            <div className="settings__header">
                <h1>Settings</h1>
                <p>Manage your portal preferences and system configuration.</p>
            </div>

            {/* Preferences */}
            <section className="settings__section">
                <div className="settings__section-title">Preferences</div>

                <div className="settings__row">
                    <div className="settings__row-label">
                        <span className="settings__row-name">Email Notifications</span>
                        <span className="settings__row-desc">Receive alerts for critical events</span>
                    </div>
                    <label className="toggle">
                        <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
                        <span className="toggle__track" />
                        <span className="toggle__thumb" />
                    </label>
                </div>

                <div className="settings__row">
                    <div className="settings__row-label">
                        <span className="settings__row-name">Dark Mode</span>
                        <span className="settings__row-desc">Use dark theme across the portal</span>
                    </div>
                    <label className="toggle">
                        <input type="checkbox" checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
                        <span className="toggle__track" />
                        <span className="toggle__thumb" />
                    </label>
                </div>
            </section>

            {/* Security */}
            <section className="settings__section">
                <div className="settings__section-title">Security</div>

                <div className="settings__row">
                    <div className="settings__row-label">
                        <span className="settings__row-name">Two-Factor Authentication</span>
                        <span className="settings__row-desc">Add an extra layer of security to your account</span>
                    </div>
                    <label className="toggle">
                        <input type="checkbox" checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} />
                        <span className="toggle__track" />
                        <span className="toggle__thumb" />
                    </label>
                </div>
            </section>

            {/* Integrations */}
            <section className="settings__section">
                <div className="settings__section-title">Integrations</div>

                <div className="settings__row">
                    <div className="settings__row-label">
                        <span className="settings__row-name">Audit Logs URL</span>
                        <span className="settings__row-desc">URL of the embedded audit logs application</span>
                    </div>
                    <input
                        className="settings__input"
                        type="text"
                        value={auditUrl}
                        onChange={(e) => setAuditUrl(e.target.value)}
                    />
                </div>
            </section>

            <div>
                <button className="settings__save">
                    💾 Save Changes
                </button>
            </div>
        </div>
    );
}
