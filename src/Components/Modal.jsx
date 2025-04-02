const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-neutral-950/75 dark:bg-neutral-100/15"
    >
      <div className="relative rounded-lg shadow-lg w-11/12 h-11/12 overflow-scroll bg-neutral-50 p-10 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
        <div className="absolute top-2 right-4">
          <button className="text-3xl" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
