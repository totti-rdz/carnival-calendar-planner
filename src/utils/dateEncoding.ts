import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import type { MarkedDates } from "../components/MonthView";

// Month mapping: a=01(Jan) .. l=12(Dec)
const MONTH_TO_CHAR = "_abcdefghijkl"; // index 1-12
const CHAR_TO_MONTH: Record<string, number> = {};
for (let i = 1; i <= 12; i++) CHAR_TO_MONTH[MONTH_TO_CHAR[i]] = i;

function monthChar(mm: string): string {
  return MONTH_TO_CHAR[parseInt(mm, 10)];
}

function monthNum(ch: string): string {
  return String(CHAR_TO_MONTH[ch]).padStart(2, "0");
}

function nextDayMMDD(mmdd: string): string {
  const month = parseInt(mmdd.substring(0, 2), 10);
  const day = parseInt(mmdd.substring(2, 4), 10);
  const date = new Date(2000, month - 1, day + 1);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${m}${d}`;
}

/**
 * Encode MarkedDates into a compact string.
 * Format: flagId:token,token;flagId2:token
 * Tokens:
 *   Single date:       f26        (month-char + DD)
 *   Same-month range:  f26+28     (month-char + DD + DD)
 *   Cross-month range: c31-d14    (month-char + DD - month-char + DD)
 */
function encodeCompact(markedDates: MarkedDates): string {
  // Invert: flag -> sorted MMDD strings
  const flagDates: Record<string, string[]> = {};
  for (const [dateStr, flags] of Object.entries(markedDates)) {
    const mmdd = dateStr.replace("-", ""); // "05-15" -> "0515"
    for (const flag of flags) {
      if (!flagDates[flag]) flagDates[flag] = [];
      flagDates[flag].push(mmdd);
    }
  }

  const parts: string[] = [];
  for (const flag of Object.keys(flagDates).sort()) {
    const dates = flagDates[flag].sort();
    if (dates.length === 0) continue;

    // Merge adjacent dates into ranges (as MMDD pairs)
    const ranges: [string, string][] = [];
    let rangeStart = dates[0];
    let rangeEnd = dates[0];

    for (let i = 1; i < dates.length; i++) {
      if (dates[i] === nextDayMMDD(rangeEnd)) {
        rangeEnd = dates[i];
      } else {
        ranges.push([rangeStart, rangeEnd]);
        rangeStart = dates[i];
        rangeEnd = dates[i];
      }
    }
    ranges.push([rangeStart, rangeEnd]);

    // Format each range as a token (days as 1-2 digits)
    const tokens: string[] = [];
    for (const [s, e] of ranges) {
      const sMM = s.substring(0, 2);
      const sDay = String(parseInt(s.substring(2, 4), 10));
      if (s === e) {
        // Single date: f6
        tokens.push(`${monthChar(sMM)}${sDay}`);
      } else {
        const eMM = e.substring(0, 2);
        const eDay = String(parseInt(e.substring(2, 4), 10));
        if (sMM === eMM) {
          // Same-month range: f6+8
          tokens.push(`${monthChar(sMM)}${sDay}+${eDay}`);
        } else {
          // Cross-month range: c31-d14
          tokens.push(`${monthChar(sMM)}${sDay}-${monthChar(eMM)}${eDay}`);
        }
      }
    }

    parts.push(`${flag}:${tokens.join(",")}`);
  }

  return parts.join(";");
}

/**
 * Decode a compact string back into MarkedDates.
 */
function decodeCompact(encoded: string): MarkedDates {
  if (!encoded) return {};

  const markedDates: MarkedDates = {};
  const flagParts = encoded.split(";");

  function addDate(mmdd: string, flag: string) {
    const key = `${mmdd.substring(0, 2)}-${mmdd.substring(2, 4)}`;
    if (!markedDates[key]) markedDates[key] = [];
    if (!markedDates[key].includes(flag)) markedDates[key].push(flag);
  }

  function expandRange(startMMDD: string, endMMDD: string, flag: string) {
    let cur = startMMDD;
    while (cur <= endMMDD) {
      addDate(cur, flag);
      cur = nextDayMMDD(cur);
    }
  }

  for (const part of flagParts) {
    const colonIdx = part.indexOf(":");
    if (colonIdx === -1) continue;

    const flag = part.substring(0, colonIdx);
    const rangesStr = part.substring(colonIdx + 1);
    if (!flag || !rangesStr) continue;

    const tokens = rangesStr.split(",");
    for (const token of tokens) {
      const plusIdx = token.indexOf("+");
      const dashIdx = token.indexOf("-");

      if (plusIdx !== -1) {
        // Same-month range: f6+8 or f26+28
        const mc = token[0];
        const mm = monthNum(mc);
        const startDD = token.substring(1, plusIdx).padStart(2, "0");
        const endDD = token.substring(plusIdx + 1).padStart(2, "0");
        expandRange(`${mm}${startDD}`, `${mm}${endDD}`, flag);
      } else if (dashIdx !== -1) {
        // Cross-month range: c31-d14 or c3-d1
        const startMC = token[0];
        const startDD = token.substring(1, dashIdx).padStart(2, "0");
        const endMC = token[dashIdx + 1];
        const endDD = token.substring(dashIdx + 2).padStart(2, "0");
        expandRange(`${monthNum(startMC)}${startDD}`, `${monthNum(endMC)}${endDD}`, flag);
      } else {
        // Single date: f6 or f26
        const mc = token[0];
        const dd = token.substring(1).padStart(2, "0");
        addDate(`${monthNum(mc)}${dd}`, flag);
      }
    }
  }

  return markedDates;
}

/**
 * Encode MarkedDates into an LZ-compressed, URL-safe string.
 * First compacts into range notation, then LZ-compresses.
 */
export function encodeDates(markedDates: MarkedDates): string {
  const compact = encodeCompact(markedDates);
  if (!compact) return "";
  return compressToEncodedURIComponent(compact);
}

/**
 * Convert old JSON MarkedDates (YYYY-MM-DD keys) to year-agnostic (MM-DD keys).
 */
function migrateJsonDates(jsonDates: MarkedDates): MarkedDates {
  const result: MarkedDates = {};
  for (const [dateStr, flags] of Object.entries(jsonDates)) {
    // "2026-05-15" -> "05-15"
    const key = dateStr.substring(5);
    if (!result[key]) result[key] = [];
    for (const flag of flags) {
      if (!result[key].includes(flag)) result[key].push(flag);
    }
  }
  return result;
}

export function parseDatesParam(datesParam: string): { dates: MarkedDates; migrated: boolean } {
  if (!datesParam) return { dates: {}, migrated: false };

  // Old format: URI-encoded JSON (double-encoded)
  try {
    const decoded = decodeURIComponent(datesParam);
    if (decoded.startsWith("{")) {
      return { dates: migrateJsonDates(JSON.parse(decoded) as MarkedDates), migrated: true };
    }
  } catch {
    // Not double-encoded JSON
  }

  // Old format: raw JSON
  try {
    if (datesParam.startsWith("{")) {
      return { dates: migrateJsonDates(JSON.parse(datesParam) as MarkedDates), migrated: true };
    }
  } catch {
    // Not JSON
  }

  // LZ-compressed format (current)
  try {
    const decompressed = decompressFromEncodedURIComponent(datesParam);
    if (decompressed) {
      return { dates: decodeCompact(decompressed), migrated: false };
    }
  } catch {
    // Not LZ-compressed
  }

  return { dates: {}, migrated: false };
}
