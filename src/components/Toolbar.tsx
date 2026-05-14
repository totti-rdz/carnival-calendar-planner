import { availableFlags } from "../data/flags";

interface ToolbarProps {
  showWeekDays: boolean;
  onShowWeekDaysChange: (value: boolean) => void;
  onAddDateRange: () => void;
  onCreateLink: () => void;
  onClearAll: () => void;
  linkCopied: boolean;
  year: number;
  availableYears: number[];
  onYearChange: (year: number) => void;
}

const Toolbar = ({
  showWeekDays,
  onShowWeekDaysChange,
  onAddDateRange,
  onCreateLink,
  onClearAll,
  linkCopied,
  year,
  availableYears,
  onYearChange,
}: ToolbarProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
        Carnival Calendar Planner
      </h1>
      <p className="text-sm text-center text-gray-600 mb-4">
        Tap a date, then select flags to mark it
      </p>

      {/* Year selector */}
      <div className="mb-4 flex items-center gap-2">
        <label
          htmlFor="year-select"
          className="text-sm font-semibold text-gray-700"
        >
          Year:
        </label>
        <select
          id="year-select"
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {availableYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Flag legend */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold mb-2 text-gray-700">
          Available Flags:
        </h2>
        <div className="flex flex-wrap gap-2">
          {availableFlags.map((flag) => (
            <div
              key={flag.id}
              className="flex items-center gap-1 text-sm bg-gray-100 px-2 py-1 rounded"
            >
              <span className="text-xl">{flag.emoji}</span>
              <span className="text-xs text-gray-700">{flag.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showWeekDays}
            onChange={(e) => onShowWeekDaysChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 select-none">
            Show week days
          </span>
        </label>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onAddDateRange}
          className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
        >
          Add Date Range
        </button>
        <button
          onClick={onCreateLink}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors relative"
        >
          {linkCopied ? "✓ Link Copied!" : "Create Link"}
        </button>
      </div>
      <button
        onClick={onClearAll}
        className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors mt-2"
      >
        Clear All Dates
      </button>
    </div>
  );
};

export default Toolbar;
