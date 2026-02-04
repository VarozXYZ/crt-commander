import { WifiIcon } from "./Icons";

export default function CrtPage({
  children,
  title = "CRT_COMMANDER",
  subtitle = "System_Ready // User: ADMIN",
  footerLeft = "Terminal ID: 884-XJ",
  footerRight = "Signal Strength: 98%",
}) {
  return (
    <div className="crt-root">
      <div
        className="crt-overlay crt-overlay--scanlines"
        aria-hidden="true"
      ></div>
      <div className="crt-overlay crt-overlay--vignette" aria-hidden="true"></div>

      <div className="crt-shell crt-flicker">
        <header className="crt-header">
          <div>
            <h1 className="crt-title">{title}</h1>
            <p className="crt-subtitle">{subtitle}</p>
          </div>

          <div className="crt-headerRight">
            <WifiIcon className="crt-icon crt-pulse" title="Online" />
            <span>ONLINE</span>
            <span className="crt-sep">|</span>
            <span>MEM: 64K OK</span>
          </div>
        </header>

        {children}

        <footer className="crt-footer">
          <span>{footerLeft}</span>
          <span>{footerRight}</span>
        </footer>
      </div>
    </div>
  );
}
