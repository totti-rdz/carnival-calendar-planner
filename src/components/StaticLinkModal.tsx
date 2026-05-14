import { useState } from "react";

import Modal from "./Modal";

interface StaticLinkModalProps {
  onCreateLink: (isStatic: boolean, title: string) => void;
  onClose: () => void;
  currentTitle: string;
}

const StaticLinkModal = ({
  onCreateLink,
  onClose,
  currentTitle,
}: StaticLinkModalProps) => {
  const [isStatic, setIsStatic] = useState(false);
  const [title, setTitle] = useState(currentTitle);

  const handleCreate = () => {
    onCreateLink(isStatic, title.trim());
    onClose();
  };

  return (
    <Modal title="Create Shareable Link" onClose={onClose} maxWidth="max-w-md">
      <div className="mb-4">
        <label
          htmlFor="link-title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title (optional)
        </label>
        <input
          id="link-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Summer Travel 2026"
          maxLength={30}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
        <p className="text-xs text-gray-400 mt-1">
          Shown as the calendar heading when shared
        </p>
      </div>

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
