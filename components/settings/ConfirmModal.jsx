"use client";

import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";

export default function ConfirmModal({
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
  busy,
}) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-body">{body}</p>
        <div className="modal-actions">
          <button
            type="button"
            className="modal-cancel-btn"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="button"
            className="modal-confirm-btn"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? (
              <Loader2 size={16} className="spin" aria-hidden="true" />
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmModal.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  busy: PropTypes.bool,
};
