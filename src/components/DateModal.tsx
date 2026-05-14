import Modal from "./Modal";
import { Flag } from "../data/flags";

interface DateModalProps {
  date: string;
  year: number;
  markedFlags: string[];
  availableFlags: Flag[];
  onFlagSelect: (flagId: string) => void;
  onClose: () => void;
}

const DateModal = ({
  date,
  year,
  markedFlags,
  availableFlags,
  onFlagSelect,
  onClose,
}: DateModalProps) => {
  const formatDateDisplay = (dateStr: string): string => {
    const [month, day] = dateStr.split("-");
    const d = new Date(year, Number(month) - 1, Number(day));
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Modal title={formatDateDisplay(date)} onClose={onClose}>
      <p className="text-sm text-gray-600 mb-4">
        Tap flags to add or remove them:
      </p>

      <div className="grid grid-cols-2 gap-2">
        {availableFlags.map((flag) => {
          const isSelected = markedFlags.includes(flag.id);
          return (
            <button
              key={flag.id}
              onClick={() => onFlagSelect(flag.id)}
              className={`
                flex items-center gap-2 p-3 rounded-lg border-2 transition-all
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }
              `}
            >
              <span className="text-2xl">{flag.emoji}</span>
              <span className="text-sm font-medium text-gray-800">
                {flag.name}
              </span>
              {isSelected && (
                <span className="ml-auto text-blue-500 text-xl">✓</span>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={onClose}
        className="w-full mt-6 bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
      >
        Done
      </button>
    </Modal>
  );
};

export default DateModal;
