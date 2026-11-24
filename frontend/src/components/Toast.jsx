import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} color="#27AE60" />;
      case 'error':
        return <AlertCircle size={20} color="#E74C3C" />;
      default:
        return <Info size={20} color="#E26D24" />;
    }
  };

  return (
    <div className={`toast ${type}`}>
      {getIcon()}
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: 2 }}
          aria-label="Dismiss toast"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Toast;
