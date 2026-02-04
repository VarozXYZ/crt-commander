import { Link } from "react-router-dom";
import CrtPage from "../components/CrtPage";

export default function Home() {
  return (
    <CrtPage title="CRT_COMMANDER" subtitle="System_Ready // Awaiting_Command">
      <main className="crt-workspace">
        <section className="crt-homePanel">
          <h2 className="crt-homeTitle">WELCOME_OPERATOR</h2>
          <p className="crt-homeText">
            Place a robot on a 5x5 grid, rotate it, move it with wrap-around
            edges, and block paths with walls - all via terminal commands.
          </p>

          <div className="crt-softkeys">
            <Link className="crt-softkey" to="/game">
              START_GAME
            </Link>
          </div>
        </section>
      </main>
    </CrtPage>
  );
}
