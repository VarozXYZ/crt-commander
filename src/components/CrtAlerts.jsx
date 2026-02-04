import { useEffect, useRef } from "react";

function VariantMark({ variant }) {
  const label = variant ? variant.toUpperCase() : "INFO";
  return <span className={`crt-mark crt-mark--${variant}`}>{label}</span>;
}

export function CrtModal({
  open,
  title,
  variant = "info",
  children,
  confirmText = "OK",
  cancelText,
  onConfirm,
  onCancel,
  dismissible = true,
}) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      if (!dismissible) return;
      onCancel?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dismissible, onCancel, open]);

  if (!open) return null;

  return (
    <div className="crt-modalOverlay" role="presentation">
      <div
        className="crt-modalBackdrop"
        onClick={dismissible ? onCancel : undefined}
        aria-hidden="true"
      ></div>

      <div
        className={`crt-modal crt-modal--${variant}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="crt-modalHeader">
          <VariantMark variant={variant} />
          <h3 className="crt-modalTitle">{title}</h3>
        </div>

        <div className="crt-modalBody">{children}</div>

        <div className="crt-modalActions">
          {cancelText ? (
            <button
              className="crt-softkey crt-softkey--compact"
              type="button"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          ) : null}

          <button
            ref={confirmRef}
            className="crt-softkey crt-softkey--compact"
            type="button"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CrtToastStack({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="crt-toastStack" aria-live="polite" aria-relevant="additions">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`crt-toast crt-toast--${t.variant ?? "info"}`}
          role="status"
        >
          <div className="crt-toastHeader">
            <VariantMark variant={t.variant ?? "info"} />
            <div className="crt-toastTitle">
              <span>{t.title}</span>
            </div>

            <button
              className="crt-toastClose"
              type="button"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>

          {t.message ? <p className="crt-toastMsg">{t.message}</p> : null}
        </div>
      ))}
    </div>
  );
}

