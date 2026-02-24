import { createRoot, Root } from "react-dom/client";
import App from "./App.tsx";
import styles from "./index.css?inline";

class AuditLogsApp extends HTMLElement {
    private root: Root | null = null;

    connectedCallback() {
        this.style.direction = 'rtl';
        this.setAttribute('dir', 'rtl');
        const basename = this.getAttribute('basename') || '/';

        const shadow = this.attachShadow({ mode: "open" });

        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        shadow.appendChild(styleSheet);

        const mountPoint = document.createElement("div");
        mountPoint.className = "audit-logs-wrapper";
        mountPoint.style.width = '100%';
        mountPoint.style.height = '100%';
        mountPoint.style.display = 'flex';
        mountPoint.style.flexDirection = 'column';
        shadow.appendChild(mountPoint);

        this.root = createRoot(mountPoint);
        this.root.render(<App basename={basename} shadowContainer={mountPoint} />);
    }

    disconnectedCallback() {
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
    }
}

customElements.define("audit-logs-app", AuditLogsApp);
