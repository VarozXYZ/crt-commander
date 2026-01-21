import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Bienvenida al juego del Robot</h1>
            <p>Este juego permite colocar un robot en un tablero 5x5, moverlo, girarlo y colocar paredes.</p>
        <Link to="/game">
            <button style={{ padding: "10px 20px", marginTop: "20px"}}>Jugar</button>
        </Link>
        </div>
    )
}