import { useState } from "react";

import Modal from "./Modal";

interface StaticLinkModalProps {
  onCreateLink: (isStatic: boolean) => void;
  onClose: () => void;
}

const StaticLinkModal = ({ onCreateLink, onClose }: StaticLinkModalProps) => {
  const [isStatic, setIsStatic] = useState(false);

  const handleCreate = () => {
    onCreateLink(isStatic);
    onClose();
  };

  return (
    <Modal title="Create Shareable Link" onClose={onClose} maxWidth="max-w-md">
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isStatic}
            onChange={(e) => setIsStatic(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <div>
            <div className="font-medium text-gray-800">
              Make calendar static (read-only)
            </div>
            <div className="text-sm text-gray-600">
              Users won't be able to modify dates or flags
            </div>
          </div>
        </label>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Create Link
        </button>
      </div>
    </Modal>
  );
};

export default StaticLinkModal;
