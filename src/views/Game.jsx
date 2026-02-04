import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import Board from "../components/Board";
import ButtonControls from "../components/ButtonControls";
import CommandInput from "../components/CommandInput";
import { CrtModal, CrtToastStack } from "../components/CrtAlerts";
import CrtPage from "../components/CrtPage";
import {
  AnalyticsIcon,
  AspectRatioIcon,
  GridIcon,
  HelpIcon,
  ResetIcon,
  WarningIcon,
} from "../components/Icons";

const GRID_SIZE = 5;
const DIRECTIONS = ["NORTH", "EAST", "SOUTH", "WEST"];

const initialState = {
  robot: null,
  walls: [],
  report: "",
  lastCmd: null,
  lastStatus: null, // OK | BLOCKED | INVALID | NOT_PLACED
  lastMessage: "Waiting for input...",
  helpOpen: false,
  inputMode: "manual", // manual | buttons
  toasts: [],
  toastSeq: 0,
  log: [],
  logSeq: 0,
};

function parseCommand(input) {
  const command = input.trim();
  if (!command) return { action: "", args: [], raw: "" };

  const firstSpace = command.indexOf(" ");
  if (firstSpace === -1) return { action: command, args: [], raw: command };

  const action = command.slice(0, firstSpace).trim();
  const argsText = command.slice(firstSpace + 1).trim();
  const args = argsText
    ? argsText
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean)
    : [];

  return { action, args, raw: command };
}

function inBounds(n) {
  return Number.isInteger(n) && n >= 1 && n <= GRID_SIZE;
}

function wrap(n) {
  if (n > GRID_SIZE) return 1;
  if (n < 1) return GRID_SIZE;
  return n;
}

function appendLog(state, entries) {
  const withIds = entries.map((e, idx) => ({
    id: state.logSeq + idx + 1,
    ...e,
  }));
  const nextLog = [...state.log, ...withIds].slice(-200);
  return { ...state, log: nextLog, logSeq: state.logSeq + entries.length };
}

function addToast(state, toast) {
  const id = state.toastSeq + 1;
  const nextToast = { id, durationMs: 2800, variant: "info", ...toast };
  const nextToasts = [...state.toasts, nextToast].slice(-4);
  return { ...state, toasts: nextToasts, toastSeq: id };
}

function applyCommand(state, input) {
  const { action, args, raw } = parseCommand(input);
  if (!action) return state;

  const base = { ...state, lastCmd: action };
  let next = base;
  let status = "OK";
  let message = "OK";
  let toast = null;

  const wallSet = new Set(state.walls.map((w) => `${w.row},${w.col}`));

  switch (action) {
    case "PLACE_ROBOT": {
      const [row, col, facing] = args;
      const r = Number.parseInt(row, 10);
      const c = Number.parseInt(col, 10);
      const f = facing;
      const key = `${r},${c}`;

      if (!inBounds(r) || !inBounds(c) || !DIRECTIONS.includes(f)) {
        status = "INVALID";
        message = "ERROR: INVALID PLACE_ROBOT";
      } else if (wallSet.has(key)) {
        status = "INVALID";
        message = `ERROR: ROBOT_ON_WALL ${key}`;
      } else {
        next = { ...next, robot: { row: r, col: c, facing: f } };
        message = `OK: PLACED ${r},${c},${f}`;
        toast = {
          variant: "success",
          title: "ROBOT_PLACED",
          message: `${r},${c},${f}`,
        };
      }
      break;
    }

    case "PLACE_WALL": {
      const [row, col] = args;
      const r = Number.parseInt(row, 10);
      const c = Number.parseInt(col, 10);
      const key = `${r},${c}`;
      const onRobot = next.robot && next.robot.row === r && next.robot.col === c;

      if (!inBounds(r) || !inBounds(c)) {
        status = "INVALID";
        message = "ERROR: INVALID PLACE_WALL";
      } else if (onRobot) {
        status = "INVALID";
        message = `ERROR: WALL_ON_ROBOT ${key}`;
      } else if (wallSet.has(key)) {
        status = "INVALID";
        message = `ERROR: WALL_EXISTS ${key}`;
      } else {
        next = { ...next, walls: [...next.walls, { row: r, col: c }] };
        message = `OK: WALL_PLACED ${key}`;
        toast = {
          variant: "success",
          title: "WALL_PLACED",
          message: key,
        };
      }
      break;
    }

    case "MOVE": {
      if (!next.robot) {
        status = "NOT_PLACED";
        message = "ERROR: ROBOT_NOT_PLACED";
        toast = {
          variant: "warning",
          title: "ROBOT_NOT_PLACED",
          message: "Place the robot first (PLACE_ROBOT).",
          durationMs: 3200,
        };
        break;
      }

      const { row, col, facing } = next.robot;
      let newRow = row;
      let newCol = col;

      switch (facing) {
        case "NORTH":
          newRow = wrap(row + 1);
          break;
        case "SOUTH":
          newRow = wrap(row - 1);
          break;
        case "EAST":
          newCol = wrap(col + 1);
          break;
        case "WEST":
          newCol = wrap(col - 1);
          break;
      }

      const key = `${newRow},${newCol}`;
      if (wallSet.has(key)) {
        status = "BLOCKED";
        message = `ERROR: BLOCKED ${key}`;
        toast = {
          variant: "error",
          title: "MOVE_BLOCKED",
          message,
          durationMs: 3400,
        };
      } else {
        next = { ...next, robot: { row: newRow, col: newCol, facing } };
        message = `OK: MOVED ${key}`;
      }
      break;
    }

    case "LEFT": {
      if (!next.robot) {
        status = "NOT_PLACED";
        message = "ERROR: ROBOT_NOT_PLACED";
        toast = {
          variant: "warning",
          title: "ROBOT_NOT_PLACED",
          message: "Place the robot first (PLACE_ROBOT).",
          durationMs: 3200,
        };
        break;
      }
      const idx = DIRECTIONS.indexOf(next.robot.facing);
      const facing = DIRECTIONS[(idx + 3) % 4];
      next = { ...next, robot: { ...next.robot, facing } };
      message = `OK: FACING ${facing}`;
      break;
    }

    case "RIGHT": {
      if (!next.robot) {
        status = "NOT_PLACED";
        message = "ERROR: ROBOT_NOT_PLACED";
        toast = {
          variant: "warning",
          title: "ROBOT_NOT_PLACED",
          message: "Place the robot first (PLACE_ROBOT).",
          durationMs: 3200,
        };
        break;
      }
      const idx = DIRECTIONS.indexOf(next.robot.facing);
      const facing = DIRECTIONS[(idx + 1) % 4];
      next = { ...next, robot: { ...next.robot, facing } };
      message = `OK: FACING ${facing}`;
      break;
    }

    case "REPORT": {
      if (!next.robot) {
        status = "NOT_PLACED";
        message = "ERROR: ROBOT_NOT_PLACED";
        toast = {
          variant: "warning",
          title: "ROBOT_NOT_PLACED",
          message: "Place the robot first (PLACE_ROBOT).",
          durationMs: 3200,
        };
        break;
      }
      const report = `${next.robot.row},${next.robot.col},${next.robot.facing}`;
      next = { ...next, report };
      message = `REPORT: ${report}`;
      toast = { variant: "info", title: "REPORT", message: report, durationMs: 3000 };
      break;
    }

    default: {
      status = "INVALID";
      message = `ERROR: UNKNOWN_CMD ${action}`;
      toast = {
        variant: "error",
        title: "INVALID_COMMAND",
        message,
        durationMs: 3600,
      };
      break;
    }
  }

  if (!toast && status === "INVALID") {
    toast = {
      variant: "error",
      title: "INVALID_COMMAND",
      message,
      durationMs: 3600,
    };
  }

  const kind = status === "OK" ? "out" : "err";
  const withMeta = {
    ...next,
    lastStatus: status,
    lastMessage: message,
  };

  let out = appendLog(withMeta, [
    { kind: "cmd", text: `> ${raw}` },
    { kind, text: message },
  ]);
  if (toast) out = addToast(out, toast);
  return out;
}

function reducer(state, action) {
  switch (action.type) {
    case "COMMAND":
      return applyCommand(state, action.command);
    case "RESET": {
      const resetState = {
        ...initialState,
        helpOpen: state.helpOpen,
        inputMode: state.inputMode,
        toasts: [],
        toastSeq: state.toastSeq,
      };
      return addToast(resetState, {
        variant: "info",
        title: "SYSTEM_RESET",
        message: "State cleared.",
        durationMs: 2600,
      });
    }
    case "TOGGLE_HELP":
      return { ...state, helpOpen: !state.helpOpen };
    case "SET_INPUT_MODE":
      return { ...state, inputMode: action.inputMode };
    case "DISMISS_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

export default function Game() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const logRef = useRef(null);
  const toastTimeoutsRef = useRef(new Map());

  const [startOpen, setStartOpen] = useState(true);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  useEffect(() => {
    if (!logRef.current) return;
    logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [state.log.length]);

  useEffect(() => {
    const timeouts = toastTimeoutsRef.current;
    return () => {
      for (const timeoutId of timeouts.values()) {
        window.clearTimeout(timeoutId);
      }
      timeouts.clear();
    };
  }, []);

  const lastStatusLabel = useMemo(() => {
    if (!state.lastStatus) return "—";
    if (state.lastStatus === "OK") return "OK";
    return `ERROR: ${state.lastStatus}`;
  }, [state.lastStatus]);

  const lastCardAlert = state.lastStatus && state.lastStatus !== "OK";
  const robotPos = state.robot ? `${state.robot.row},${state.robot.col}` : "—";
  const robotFacing = state.robot ? state.robot.facing : "—";
  const reportText = state.report || "—";

  const handleCommand = useCallback(
    (command) => dispatch({ type: "COMMAND", command }),
    [dispatch],
  );

  useEffect(() => {
    const timeouts = toastTimeoutsRef.current;
    const activeIds = new Set(state.toasts.map((t) => t.id));

    for (const [id, timeoutId] of timeouts) {
      if (activeIds.has(id)) continue;
      window.clearTimeout(timeoutId);
      timeouts.delete(id);
    }

    for (const toast of state.toasts) {
      if (timeouts.has(toast.id)) continue;
      const timeoutId = window.setTimeout(() => {
        dispatch({ type: "DISMISS_TOAST", id: toast.id });
      }, toast.durationMs ?? 2800);
      timeouts.set(toast.id, timeoutId);
    }
  }, [dispatch, state.toasts]);

  const dismissToast = useCallback(
    (id) => {
      const timeoutId = toastTimeoutsRef.current.get(id);
      if (timeoutId) window.clearTimeout(timeoutId);
      toastTimeoutsRef.current.delete(id);
      dispatch({ type: "DISMISS_TOAST", id });
    },
    [dispatch],
  );

  return (
    <CrtPage>
      <main className="crt-workspace">
        <section className="crt-leftCol">
          <div className="crt-sectionRow">
            <h2 className="crt-h2">
              <GridIcon className="crt-icon" />
              GRID_VIEW
            </h2>
            <span className="crt-badge">WRAP: ENABLED</span>
          </div>

          <Board robot={state.robot} walls={state.walls} />
        </section>

        <section className="crt-rightCol">
          <div>
            <h2 className="crt-h2" style={{ marginBottom: 16 }}>
              <AnalyticsIcon className="crt-icon" />
              SYSTEM_STATUS
            </h2>

            <div className="crt-statusGrid">
              <div
                className={`crt-card ${lastCardAlert ? "crt-card--alert" : ""}`}
              >
                <div className="crt-cardCornerIcon" aria-hidden="true">
                  <WarningIcon className="crt-icon" />
                </div>
                <p className="crt-cardLabel">LAST_CMD</p>
                <p className="crt-cardValue">{state.lastCmd ?? "—"}</p>
                <p
                  className={`crt-cardStatus ${
                    lastCardAlert ? "crt-pulse" : ""
                  }`}
                >
                  {lastStatusLabel}
                </p>
              </div>

              <div className="crt-card">
                <div className="crt-cardCornerIcon" aria-hidden="true">
                  <AspectRatioIcon className="crt-icon crt-iconDim" />
                </div>
                <p className="crt-cardLabel">GRID_SIZE</p>
                <p className="crt-cardValue crt-cardValueWhite">
                  {GRID_SIZE}x{GRID_SIZE}
                </p>
                <div className="crt-progress" aria-hidden="true">
                  <div className="crt-progressBar"></div>
                </div>
              </div>
            </div>

            <div className="crt-telemetry" style={{ marginTop: 16 }}>
              <div className="crt-telemetryGrid">
                <div className="crt-kv">
                  <span className="crt-k">POS</span>
                  <span className="crt-v">{robotPos}</span>
                </div>
                <div className="crt-kv">
                  <span className="crt-k">DIR</span>
                  <span className="crt-v">{robotFacing}</span>
                </div>
                <div className="crt-kv">
                  <span className="crt-k">WALLS</span>
                  <span className="crt-v">{state.walls.length}</span>
                </div>
                <div className="crt-kv">
                  <span className="crt-k">REPORT</span>
                  <span className="crt-v">{reportText}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="crt-interaction">
            <div className="crt-softkeys">
              <button
                className="crt-softkey"
                type="button"
                onClick={() => dispatch({ type: "TOGGLE_HELP" })}
              >
                <HelpIcon className="crt-icon" />
                F1 HELP
              </button>

              <button
                className="crt-softkey"
                type="button"
                onClick={() => setResetConfirmOpen(true)}
              >
                <ResetIcon className="crt-icon" />
                F2 RESET
              </button>

              <button
                className="crt-softkey"
                type="button"
                aria-pressed={state.inputMode === "manual"}
                onClick={() =>
                  dispatch({ type: "SET_INPUT_MODE", inputMode: "manual" })
                }
              >
                MANUAL
              </button>

              <button
                className="crt-softkey"
                type="button"
                aria-pressed={state.inputMode === "buttons"}
                onClick={() =>
                  dispatch({ type: "SET_INPUT_MODE", inputMode: "buttons" })
                }
              >
                BUTTONS
              </button>
            </div>

            {state.helpOpen ? (
              <div className="crt-help">
                <p className="crt-helpTitle">COMMANDS</p>
                <ol className="crt-helpList">
                  <li>
                    <code>PLACE_ROBOT row,col,facing</code> (facing: NORTH/EAST/
                    SOUTH/WEST)
                  </li>
                  <li>
                    <code>PLACE_WALL row,col</code>
                  </li>
                  <li>
                    <code>MOVE</code>, <code>LEFT</code>, <code>RIGHT</code>
                  </li>
                  <li>
                    <code>REPORT</code>
                  </li>
                </ol>
              </div>
            ) : null}

            {state.inputMode === "manual" ? (
              <CommandInput
                onCommand={handleCommand}
                placeholder="PLACE_ROBOT 1,1,NORTH"
              />
            ) : (
              <ButtonControls
                gridSize={GRID_SIZE}
                robot={state.robot}
                walls={state.walls}
                onCommand={handleCommand}
              />
            )}

            <div className="crt-log" ref={logRef} aria-label="Command log">
              {state.log.length ? (
                state.log.map((entry) => (
                  <p
                    key={entry.id}
                    className={`crt-logLine crt-logLine--${entry.kind}`}
                  >
                    {entry.text}
                  </p>
                ))
              ) : (
                <p className="crt-logLine crt-logLine--out">
                  &gt; PLACE_ROBOT 1,1,NORTH
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      <CrtModal
        open={startOpen}
        variant="info"
        title="SYSTEM_READY"
        confirmText="BEGIN"
        onConfirm={() => setStartOpen(false)}
        onCancel={() => setStartOpen(false)}
      >
        <p className="crt-modalText">
          Welcome, operator. Choose <strong>MANUAL</strong> or <strong>BUTTONS</strong> to
          control the robot.
        </p>
        <ul className="crt-modalList">
          <li>
            Wrap-around is enabled (moving past an edge loops to the opposite side).
          </li>
          <li>
            Place robot: <code>PLACE_ROBOT row,col,facing</code>
          </li>
          <li>
            Walls block movement: <code>PLACE_WALL row,col</code>
          </li>
        </ul>
      </CrtModal>

      <CrtModal
        open={resetConfirmOpen}
        variant="warning"
        title="CONFIRM_RESET"
        confirmText="RESET"
        cancelText="CANCEL"
        onConfirm={() => {
          dispatch({ type: "RESET" });
          setResetConfirmOpen(false);
        }}
        onCancel={() => setResetConfirmOpen(false)}
      >
        <p className="crt-modalText">
          This will clear the robot, walls, report, and log.
        </p>
      </CrtModal>

      <CrtToastStack toasts={state.toasts} onDismiss={dismissToast} />
    </CrtPage>
  );
}

