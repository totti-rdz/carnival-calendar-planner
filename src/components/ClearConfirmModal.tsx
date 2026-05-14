import Modal from "./Modal";

interface ClearConfirmModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

function ClearConfirmModal({ onConfirm, onClose }: ClearConfirmModalProps) {
  return (
    <Modal title="Clear All Dates" onClose={onClose}>
      <p className="text-sm text-gray-600 mb-4">
        Are you sure you want to delete all marked dates? This action cannot be
        undone.
      </p>
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
        >
          Delete All
        </button>
      </div>
    </Modal>
  );
}

export default ClearConfirmModal;
