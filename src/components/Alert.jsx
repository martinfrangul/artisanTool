import PropTypes from 'prop-types';

const Alert = ({ message, subMessage, type, onClose }) => {
  const alertTypeClass = {
    success: 'bg-success text-black',
    error: 'bg-danger text-white',
    warning: 'bg-banner',
  }[type];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className={`relative alert w-11/12 md:w-6/12 lg:w-5/12 xl:w-4/12 max-w-2xl ${alertTypeClass} p-4 rounded-lg shadow-lg`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current h-6 w-6 shrink-0"
          
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>{message}</span>
        {subMessage && <div className="text-sm">{subMessage}</div>}
        {onClose && (
          <button onClick={onClose} className="btn btn-sm btn-close">Cerrar</button>
        )}
      </div>
    </div>
  );
};

Alert.propTypes = {
    message: PropTypes.string.isRequired,
    subMessage: PropTypes.string,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
    onClose: PropTypes.func.isRequired,
  };

export default Alert;
