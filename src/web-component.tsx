import { createRoot, Root } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

class AuditLogsApp extends HTMLElement {
    private root: Root | null = null;

    connectedCallback() {
        this.style.direction = 'rtl';
        this.setAttribute('dir', 'rtl');
        const basename = this.getAttribute('basename') || '/';

        this.root = createRoot(this);
        this.root.render(<App basename={basename} />);
    }

    disconnectedCallback() {
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
    }
}

customElements.define("audit-logs-app", AuditLogsApp);
