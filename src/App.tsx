import { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import type { MarkedDates } from "./components/MonthView";
import ClearConfirmModal from "./components/ClearConfirmModal";
import DateRangeModal from "./components/DateRangeModal";
import StaticLinkModal from "./components/StaticLinkModal";
import Toolbar from "./components/Toolbar";
import { availableFlags } from "./data/flags";
import { encodeDates, parseDatesParam } from "./utils/dateEncoding";

const AVAILABLE_YEARS = [2026, 2027, 2028, 2029, 2030];

function App() {
  // Initialize state from URL on first load
  const initialParams = new URLSearchParams(window.location.search);
  const isStaticMode = initialParams.get("static") === "true";
  const initialWeekDays =
    initialParams.get("weekDays") === "true" || isStaticMode;
  const initialYear = Number(initialParams.get("year")) || 2026;
  const initialTitle = initialParams.get("title") || "";
  let initialDates: MarkedDates = {};
  let needsUrlMigration = false;
  try {
    const datesParam = initialParams.get("dates");
    if (datesParam) {
      const result = parseDatesParam(datesParam);
      initialDates = result.dates;
      needsUrlMigration = result.migrated;
    }
  } catch (e) {
    console.error("Failed to load dates from URL", e);
  }

  const [year, setYear] = useState(initialYear);
  const [markedDates, setMarkedDates] = useState<MarkedDates>(initialDates);
  const [showRangeModal, setShowRangeModal] = useState(false);
  const [showStaticLinkModal, setShowStaticLinkModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showWeekDays, setShowWeekDays] = useState(initialWeekDays);
  const [title, setTitle] = useState(initialTitle);

  // Sync state to URL whenever markedDates, showWeekDays, or year change
  useEffect(() => {
    if (isStaticMode && !needsUrlMigration) return;

    const parts: string[] = [];
    if (Object.keys(markedDates).length > 0) {
      parts.push(`dates=${encodeDates(markedDates)}`);
    }
    if (year !== 2026) {
      parts.push(`year=${year}`);
    }
    if (showWeekDays) {
      parts.push("weekDays=true");
    }
    if (title) {
      parts.push(`title=${encodeURIComponent(title)}`);
    }
    if (isStaticMode) {
      parts.push("static=true");
    }

    const query = parts.join("&");
    const newUrl = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [markedDates, showWeekDays, isStaticMode, year, title]);

  const handleDateClick = (dateStr: string, flagId: string) => {
    setMarkedDates((prev: MarkedDates) => {
      const current = prev[dateStr] || [];
      const hasFlag = current.includes(flagId);

      if (hasFlag) {
        // Remove flag
        const updated = current.filter((id) => id !== flagId);
        if (updated.length === 0) {
          const newDates = { ...prev };
          delete newDates[dateStr];
          return newDates;
        }
        return { ...prev, [dateStr]: updated };
      } else {
        // Add flag
        return { ...prev, [dateStr]: [...current, flagId] };
      }
    });
  };

  const clearAllDates = () => {
    setMarkedDates({});
  };

  const handleAddDateRange = (
    startDate: string,
    endDate: string,
    flagId: string,
  ) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      alert("Start date must be before end date");
      return;
    }

    const newDates = { ...markedDates };
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const m = String(currentDate.getMonth() + 1).padStart(2, "0");
      const d = String(currentDate.getDate()).padStart(2, "0");
      const dateStr = `${m}-${d}`;
      const current = newDates[dateStr] || [];
      if (!current.includes(flagId)) {
        newDates[dateStr] = [...current, flagId];
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setMarkedDates(newDates);
    setShowRangeModal(false);
  };

  const createShareableLink = (isStatic: boolean, linkTitle: string) => {
    setTitle(linkTitle);
    const encoded = encodeDates(markedDates);
    const staticParam = isStatic ? "&static=true" : "";
    const weekDaysParam = isStatic || showWeekDays ? "&weekDays=true" : "";
    const yearParam = year !== 2026 ? `&year=${year}` : "";
    const titleParam = linkTitle
      ? `&title=${encodeURIComponent(linkTitle)}`
      : "";
    const url = `${window.location.origin}${window.location.pathname}?dates=${encoded}${yearParam}${titleParam}${staticParam}${weekDaysParam}`;

    // Copy to clipboard first
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });

    // Redirect to the URL
    window.location.href = url;
  };

  console.log("+++++++++++++++++++++");
  console.log("title", title);

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2">
      <div className="max-w-7xl mx-auto">
        {!isStaticMode && (
          <Toolbar
            showWeekDays={showWeekDays}
            onShowWeekDaysChange={setShowWeekDays}
            onAddDateRange={() => setShowRangeModal(true)}
            onCreateLink={() => setShowStaticLinkModal(true)}
            onClearAll={() => setShowClearConfirm(true)}
            linkCopied={linkCopied}
            year={year}
            availableYears={AVAILABLE_YEARS}
            onYearChange={setYear}
            title={title}
          />
        )}

        {isStaticMode && title && (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <h1 className="text-2xl font-bold text-center text-gray-800">
              {title}
            </h1>
          </div>
        )}

        <Calendar
          markedDates={markedDates}
          onDateClick={handleDateClick}
          availableFlags={availableFlags}
          isStatic={isStaticMode}
          showWeekDays={showWeekDays}
          year={year}
        />

        {showRangeModal && (
          <DateRangeModal
            availableFlags={availableFlags}
            year={year}
            onAddRange={handleAddDateRange}
            onClose={() => setShowRangeModal(false)}
          />
        )}

        {showStaticLinkModal && (
          <StaticLinkModal
            onCreateLink={createShareableLink}
            onClose={() => setShowStaticLinkModal(false)}
            currentTitle={title}
          />
        )}

        {showClearConfirm && (
          <ClearConfirmModal
            onConfirm={() => {
              clearAllDates();
              setShowClearConfirm(false);
            }}
            onClose={() => setShowClearConfirm(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
