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
      className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 backdrop-blur-md bg-opacity-25"
    >
      <div className="relative bg-zinc-50 p-10 rounded-lg shadow-lg w-11/12 h-11/12 overflow-scroll">
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
