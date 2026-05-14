import { useState } from "react";
import MonthView from "./MonthView";
import type { MarkedDates } from "./MonthView";
import DateModal from "./DateModal";
import { Flag } from "../data/flags";

interface CalendarProps {
  markedDates: MarkedDates;
  onDateClick: (dateStr: string, flagId: string) => void;
  availableFlags: Flag[];
  isStatic?: boolean;
  showWeekDays?: boolean;
  year: number;
}

const Calendar = ({
  markedDates,
  onDateClick,
  availableFlags,
  isStatic = false,
  showWeekDays = false,
  year,
}: CalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const allMonths = [
    { name: "January", number: 1 },
    { name: "February", number: 2 },
    { name: "March", number: 3 },
    { name: "April", number: 4 },
    { name: "May", number: 5 },
    { name: "June", number: 6 },
    { name: "July", number: 7 },
    { name: "August", number: 8 },
    { name: "September", number: 9 },
    { name: "October", number: 10 },
    { name: "November", number: 11 },
    { name: "December", number: 12 },
  ];

  const months = isStatic
    ? allMonths.filter((month) => {
        const prefix = `${String(month.number).padStart(2, "0")}-`;
        return Object.keys(markedDates).some((d) => d.startsWith(prefix));
      })
    : allMonths;

  const handleDayClick = (dateStr: string) => {
    if (!isStatic) {
      setSelectedDate(dateStr);
    }
  };

  const handleFlagSelect = (flagId: string) => {
    if (selectedDate) {
      onDateClick(selectedDate, flagId);
    }
  };

  const closeModal = () => {
    setSelectedDate(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {months.map((month) => (
          <MonthView
            key={month.number}
            year={year}
            month={month.number}
            monthName={month.name}
            markedDates={markedDates}
            onDayClick={handleDayClick}
            availableFlags={availableFlags}
            isStatic={isStatic}
            showWeekDays={showWeekDays}
          />
        ))}
      </div>

      {selectedDate && (
        <DateModal
          date={selectedDate}
          year={year}
          markedFlags={markedDates[selectedDate] || []}
          availableFlags={availableFlags}
          onFlagSelect={handleFlagSelect}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Calendar;
