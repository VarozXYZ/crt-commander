import { useMemo, useState } from "react";

function range1(n) {
  return Array.from({ length: n }, (_, i) => i + 1);
}

export default function ButtonControls({
  gridSize,
  robot,
  walls,
  onCommand,
}) {
  const rows = useMemo(() => range1(gridSize), [gridSize]);
  const cols = rows;
  const wallSet = useMemo(
    () => new Set(walls.map((w) => `${w.row},${w.col}`)),
    [walls],
  );

  const [robotRow, setRobotRow] = useState(1);
  const [robotCol, setRobotCol] = useState(1);
  const [robotFacing, setRobotFacing] = useState("NORTH");

  const [wallRow, setWallRow] = useState(1);
  const [wallCol, setWallCol] = useState(1);

  const robotPlaced = Boolean(robot);
  const wallKey = `${wallRow},${wallCol}`;
  const robotKey = `${robotRow},${robotCol}`;

  const wallOnRobot =
    robot && robot.row === wallRow && robot.col === wallCol;
  const wallExists = wallSet.has(wallKey);
  const robotOnWall = wallSet.has(robotKey);

  return (
    <div className="crt-controls" aria-label="Button controls">
      <div className="crt-controlsSection">
        <p className="crt-controlsTitle">ROBOT_CONTROLS</p>
        <div className="crt-softkeys">
          <button
            className="crt-softkey crt-softkey--compact"
            type="button"
            onClick={() => onCommand("MOVE")}
            disabled={!robotPlaced}
          >
            MOVE
          </button>
          <button
            className="crt-softkey crt-softkey--compact"
            type="button"
            onClick={() => onCommand("LEFT")}
            disabled={!robotPlaced}
          >
            LEFT
          </button>
          <button
            className="crt-softkey crt-softkey--compact"
            type="button"
            onClick={() => onCommand("RIGHT")}
            disabled={!robotPlaced}
          >
            RIGHT
          </button>
          <button
            className="crt-softkey crt-softkey--compact"
            type="button"
            onClick={() => onCommand("REPORT")}
            disabled={!robotPlaced}
          >
            REPORT
          </button>
        </div>
      </div>

      <div className="crt-controlsSection">
        <p className="crt-controlsTitle">PLACE_ROBOT</p>
        <div className="crt-formGrid">
          <label className="crt-field">
            <span className="crt-fieldLabel">ROW</span>
            <select
              className="crt-select"
              value={robotRow}
              onChange={(e) => setRobotRow(Number(e.target.value))}
            >
              {rows.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <label className="crt-field">
            <span className="crt-fieldLabel">COL</span>
            <select
              className="crt-select"
              value={robotCol}
              onChange={(e) => setRobotCol(Number(e.target.value))}
            >
              {cols.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <label className="crt-field">
            <span className="crt-fieldLabel">FACING</span>
            <select
              className="crt-select"
              value={robotFacing}
              onChange={(e) => setRobotFacing(e.target.value)}
            >
              <option value="NORTH">NORTH</option>
              <option value="EAST">EAST</option>
              <option value="SOUTH">SOUTH</option>
              <option value="WEST">WEST</option>
            </select>
          </label>

          <button
            className="crt-softkey crt-softkey--compact crt-formButton"
            type="button"
            onClick={() =>
              onCommand(`PLACE_ROBOT ${robotRow},${robotCol},${robotFacing}`)
            }
            disabled={robotOnWall}
          >
            {robotOnWall ? "BLOCKED: WALL" : "PLACE_ROBOT"}
          </button>
        </div>
      </div>

      <div className="crt-controlsSection">
        <p className="crt-controlsTitle">PLACE_WALL</p>
        <div className="crt-formGrid">
          <label className="crt-field">
            <span className="crt-fieldLabel">ROW</span>
            <select
              className="crt-select"
              value={wallRow}
              onChange={(e) => setWallRow(Number(e.target.value))}
            >
              {rows.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <label className="crt-field">
            <span className="crt-fieldLabel">COL</span>
            <select
              className="crt-select"
              value={wallCol}
              onChange={(e) => setWallCol(Number(e.target.value))}
            >
              {cols.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <div className="crt-field" aria-hidden="true"></div>

          <button
            className="crt-softkey crt-softkey--compact crt-formButton"
            type="button"
            onClick={() => onCommand(`PLACE_WALL ${wallRow},${wallCol}`)}
            disabled={wallOnRobot || wallExists}
          >
            {wallOnRobot
              ? "BLOCKED: ROBOT"
              : wallExists
                ? "BLOCKED: EXISTS"
                : "PLACE_WALL"}
          </button>
        </div>
      </div>
    </div>
  );
}

