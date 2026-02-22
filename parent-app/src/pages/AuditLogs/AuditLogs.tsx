import React, { useEffect } from 'react';
import './AuditLogs.css';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'audit-logs-app': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { basename?: string };
        }
    }
}

const AUDIT_SCRIPT_URL = 'http://localhost:3001/assets/webComponent.js';

export function AuditLogs() {
    useEffect(() => {
        if (!document.querySelector(`script[src="${AUDIT_SCRIPT_URL}"]`)) {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = AUDIT_SCRIPT_URL;
            document.head.appendChild(script);

            const cssUrl = AUDIT_SCRIPT_URL.replace('.js', '.css');
            if (!document.querySelector(`link[href="${cssUrl}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssUrl;
                document.head.appendChild(link);
            }
        }
    }, []);

    return (
        <div className="audit-logs">
            <audit-logs-app
                basename="/audit"
                className="audit-logs-app-container"
            />
        </div>
    );
}
