const DIRECTION_GLYPH = {
  NORTH: "▲",
  EAST: "▶",
  SOUTH: "▼",
  WEST: "◀",
};

export default function Board({ robot, walls }) {
  const size = 5;
  const wallSet = new Set(walls.map((w) => `${w.row},${w.col}`));
  const cells = [];

  for (let row = size; row >= 1; row--) {
    for (let col = 1; col <= size; col++) {
      const isRobot = robot && robot.row === row && robot.col === col;
      const isWall = wallSet.has(`${row},${col}`);

      const className = [
        "crt-cell",
        isRobot ? "crt-cell--robot" : "",
        isWall ? "crt-cell--wall" : "",
      ]
        .filter(Boolean)
        .join(" ");

      cells.push(
        <div
          key={`${row}-${col}`}
          className={className}
          role="gridcell"
          aria-label={`Row ${row}, Column ${col}${
            isRobot ? ", Robot" : isWall ? ", Wall" : ""
          }`}
        >
          {isRobot ? (
            <span className="crt-robotGlyph" aria-hidden="true">
              {DIRECTION_GLYPH[robot.facing] ?? "▲"}
            </span>
          ) : isWall ? (
            <span className="crt-wallGlyph" aria-hidden="true">
              ■
            </span>
          ) : null}
        </div>
      );
    }
  }

  return (
    <div className="crt-boardShell" role="grid" aria-label="5 by 5 board">
      <div className="crt-boardGlow" aria-hidden="true"></div>
      <div className="crt-grid">{cells}</div>
    </div>
  );
}
