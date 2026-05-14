import { useState, FormEvent } from "react";

import Modal from "./Modal";
import { Flag } from "../data/flags";

interface DateRangeModalProps {
  availableFlags: Flag[];
  year: number;
  onAddRange: (startDate: string, endDate: string, flagId: string) => void;
  onClose: () => void;
}

const DateRangeModal = ({
  availableFlags,
  year,
  onAddRange,
  onClose,
}: DateRangeModalProps) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedFlag, setSelectedFlag] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (startDate && endDate && selectedFlag) {
      onAddRange(startDate, endDate, selectedFlag);
      setStartDate("");
      setEndDate("");
      setSelectedFlag("");
    }
  };

  return (
    <Modal title="Add Date Range" onClose={onClose} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={`${year}-01-01`}
            max={`${year}-12-31`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={`${year}-01-01`}
            max={`${year}-12-31`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Flag
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {availableFlags.map((flag) => (
              <button
                key={flag.id}
                type="button"
                onClick={() => setSelectedFlag(flag.id)}
                className={`
                    flex items-center gap-2 p-2 rounded-lg border-2 transition-all text-left
                    ${
                      selectedFlag === flag.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }
                  `}
              >
                <span className="text-xl">{flag.emoji}</span>
                <span className="text-xs font-medium text-gray-800">
                  {flag.name}
                </span>
                {selectedFlag === flag.id && (
                  <span className="ml-auto text-blue-500 text-lg">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!startDate || !endDate || !selectedFlag}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add Range
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DateRangeModal;
