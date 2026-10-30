"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";
import PropTypes from "prop-types";

export default function Toast({ message, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2600);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="toast" role="status">
      <span className="toast-icon">
        <Check size={16} aria-hidden="true" />
      </span>
      {message}
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  onDone: PropTypes.func.isRequired,
};
