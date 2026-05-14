import { Flag } from "../data/flags";

export interface MarkedDates {
  [dateStr: string]: string[];
}

interface MonthViewProps {
  year: number;
  month: number;
  monthName: string;
  markedDates: MarkedDates;
  onDayClick: (dateStr: string) => void;
  availableFlags: Flag[];
  isStatic?: boolean;
  showWeekDays?: boolean;
}

const MonthView = ({
  year,
  month,
  monthName,
  markedDates,
  onDayClick,
  availableFlags,
  isStatic = false,
  showWeekDays = false,
}: MonthViewProps) => {
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    const day = new Date(year, month - 1, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday=0 to Monday=0
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days: (number | null)[] = [];

  // Add empty cells for days before the first day (only if showing week days)
  if (showWeekDays) {
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
  }

  // Add all days in the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const formatDate = (day: number): string => {
    return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const getFlagEmoji = (flagId: string): string => {
    const flag = availableFlags.find((f) => f.id === flagId);
    return flag ? flag.emoji : "";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-2">
      <h2 className="text-base font-bold text-center mb-2 text-gray-800">
        {monthName} {year}
      </h2>

      {showWeekDays && (
        <div className="grid grid-cols-7 mb-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-600 py-1"
            >
              {day}
            </div>
          ))}
        </div>
      )}

      {/* Days grid */}
      <div className="calendar-grid grid grid-cols-7">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateStr = formatDate(day);
          const flags = markedDates[dateStr] || [];
          const hasFlags = flags.length > 0;

          return (
            <button
              key={`day-${day}`}
              onClick={() => !isStatic && onDayClick(dateStr)}
              disabled={isStatic}
              className={`
                aspect-square rounded-none flex items-center justify-center p-0.5
                transition-all duration-200 relative overflow-visible
                ${isStatic ? "" : "hover:shadow-md hover:z-10 active:scale-95 cursor-pointer"}
                ${
                  hasFlags
                    ? "bg-gradient-to-br from-blue-50 to-indigo-50" +
                      (isStatic
                        ? ""
                        : " hover:from-blue-100 hover:to-indigo-100")
                    : "bg-gradient-to-br from-white to-gray-50" +
                      (isStatic ? "" : " hover:from-gray-50 hover:to-gray-100")
                }
              `}
            >
              <span className="absolute top-0.5 left-1 text-xs font-bold text-gray-700 drop-shadow-sm">
                {day}
              </span>
              {hasFlags && (
                <div
                  className={
                    flags.length === 1
                      ? "flex items-center justify-center"
                      : "grid grid-cols-2 gap-0.5 p-1"
                  }
                >
                  {flags.slice(0, 4).map((flagId, idx) => {
                    const fontSize =
                      flags.length === 1
                        ? "32px"
                        : flags.length === 2
                          ? "24px"
                          : "20px";
                    return (
                      <span
                        key={flagId}
                        className="leading-none"
                        style={{
                          fontSize,
                          transform:
                            flags.length === 1
                              ? "none"
                              : `rotate(${[2, -3, -2, 3][idx % 4]}deg)`,
                          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                        }}
                      >
                        {getFlagEmoji(flagId)}
                      </span>
                    );
                  })}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
