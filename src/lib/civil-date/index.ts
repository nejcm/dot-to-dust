import { format } from 'date-fns';

// Civil date = local-calendar YYYY-MM-DD with no timezone semantics.
// Single source of truth for parsing and validating civil dates so that the
// DOB intake (preferences store) and the date math (life-math) cannot drift —
// previously each owned its own validation with different code, allowing the
// intake to accept dates that life-math would reject.

const CIVIL_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

// Parse a civil YYYY-MM-DD string as local midnight, avoiding UTC interpretation.
// Throws on malformed input or invalid calendar dates (e.g. 2023-02-31) instead
// of silently normalizing — callers downstream must never observe a date that
// has been quietly shifted to a different day.
//
// Note: years 0–99 are rejected by the round-trip check because the Date
// constructor maps them to 1900–1999 (two-arg form), making round-trip fail.
// That is the correct outcome for a DOB app — no supported use cases below 1900.
export function parseCivilDate(s: string): Date {
  const match = CIVIL_DATE_RE.exec(s);
  if (!match) throw new Error(`Invalid civil date format: ${s}`);
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    throw new Error(`Invalid civil date: ${s}`);
  }
  return date;
}

export function isCivilDate(value: string): boolean {
  try {
    parseCivilDate(value);
    return true;
  }
  catch (e) {
    if (e instanceof Error) return false;
    throw e; // re-throw non-Error throws so programming errors surface
  }
}

export function toCivilDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function todayCivilDate(): string {
  return toCivilDateString(new Date());
}

export function isPastOrTodayCivilDate(value: string, today = todayCivilDate()): boolean {
  return isCivilDate(value) && value <= today;
}
