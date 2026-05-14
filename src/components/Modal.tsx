import { ReactNode } from "react";

interface ModalProps {
  title?: string;
  onClose: () => void;
  maxWidth?: string;
  children: ReactNode;
}

const Modal = ({
  title,
  onClose,
  maxWidth = "max-w-sm",
  children,
}: ModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-xl ${maxWidth} w-full p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
