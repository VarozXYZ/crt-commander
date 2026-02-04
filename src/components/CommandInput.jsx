import { useId, useState } from "react";
import { TerminalIcon } from "./Icons";

export default function CommandInput({
  onCommand,
  placeholder = "ENTER_COMMAND...",
}) {
  const inputId = useId();
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalized = input.trim();
    if (!normalized) return;

    onCommand(normalized.toUpperCase());
    setInput("");
  };

  return (
    <form className="crt-cmdForm" onSubmit={handleSubmit}>
      <div className="crt-cmdHeader">
        <label className="crt-cmdLabel" htmlFor={inputId}>
          COMMAND_INPUT
        </label>
      </div>

      <div className="crt-cmdField">
        <div className="crt-cmdIcon" aria-hidden="true">
          <TerminalIcon className="crt-icon" />
        </div>

        <input
          id={inputId}
          className="crt-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          autoFocus
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />

        <div className="crt-enterHint" aria-hidden="true">
          ⏎
        </div>
      </div>
    </form>
  );
}
