export default function Board({ robot, walls }) {
    const size = 5;
    const rows = [];

    for (let r = size; r >= 1; r--) {
        const cols = [];
        for (let c = 1; c <= size; c++) {
            const isRobot = robot && robot.row === r && robot.col === c;
            const isWall = walls.some((w) => w.row === r && w.col === c);
            cols.push(
                <td key={`${r}-${c}`}
                style = {{
                    width: "50px",
                    height: "50px",
                    textAlign: "center",
                    border: "1px solid black",
                    backgroundColor: isRobot ? "lightgreen" : isWall ? "gray": "white",
                }}>
                    {isRobot ? robot.facing[0] : isWall ? "X" : ""}
                </td>       
            );
        }
        rows.push(<tr key={r}>{cols}</tr>);
    }

    return (
        <table style={{ borderCollapse: "collapse", margin: "20px" }}>
            <tbody>{rows}</tbody>
        </table>
    );
}  
