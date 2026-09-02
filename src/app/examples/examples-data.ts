// Examples in page order with their keyword tags. Drives both the per-card
// tag chips (`getTags`) and the jump-to tag cloud at the top (`getTagNav`).
export const EXAMPLES: { title: string; tags: string[] }[] = [
  { title: "SimpleCalendar", tags: ["prebuilt", "one import", "single"] },
  { title: "DatePicker", tags: ["prebuilt", "manual input", "one import"] },
  { title: "MonthPicker", tags: ["prebuilt", "months grid", "one import"] },
  { title: "Quarter board", tags: ["prebuilt", "3 months", "range"] },
  { title: "The basics", tags: ["single", "starter"] },
  { title: "Week picker", tags: ["unit: week", "spans"] },
  { title: "Shift blocks", tags: ["multi-range", "maxRanges"] },
  { title: "Business days", tags: ["exclude", "segments", "range"] },
  {
    title: "German locale + labels",
    tags: ["locale", "labels", "week numbers"],
  },
  { title: "Controlled scheme", tags: ["scheme", "dark mode", "toggle"] },
  {
    title: "Pinned toolbar actions",
    tags: ["toolbar", "push", "smart layout"],
  },
  { title: "Stay booking", tags: ["range", "booking", "presets"] },
  { title: "Flight search", tags: ["range", "tracks", "mobile"] },
  { title: "Two-month stay search", tags: ["range", "2 months", "desktop"] },
  {
    title: "Six-month availability",
    tags: ["read-only", "6 months", "availability"],
  },
  { title: "Delivery slots", tags: ["multiple", "capacity"] },
  {
    title: "Limited drop window",
    tags: ["single", "hideOutOfRange", "disabled", "clock"],
  },
  { title: "Appointment booking", tags: ["single", "time", "scheduling"] },
  { title: "Analytics dashboard", tags: ["range", "presets", "reports"] },
  { title: "Support quick dates", tags: ["single", "presets", "support"] },
  { title: "Holiday planner", tags: ["multiple", "presets", "holidays"] },
  { title: "Brand theme picker", tags: ["single", "createTheme", "brand"] },
  {
    title: "Branded preset rail",
    tags: ["single", "createTheme", "per-module theme"],
  },
  {
    title: "Dense product filter",
    tags: ["range", "createAppearance", "dashboard"],
  },
  { title: "Vacation request", tags: ["range", "constraints", "HR"] },
  { title: "Sprint planning", tags: ["range", "presets", "planning"] },
  { title: "Invoice due date", tags: ["single", "manual input", "billing"] },
  { title: "Archive year browser", tags: ["years grid", "archive"] },
  { title: "Campaign month picker", tags: ["months grid", "campaign"] },
  { title: "Time slot picker", tags: ["time", "slots"] },
  { title: "Global meeting time", tags: ["single", "time zone", "hour12"] },
  { title: "Profile birthday", tags: ["single", "tracks", "birthday"] },
  { title: "Blackout calendar", tags: ["range", "disabled", "operations"] },
  { title: "Launch day", tags: ["read-only", "status"] },
  { title: "Month wheel + day grid", tags: ["single", "wheel", "2 cols"] },
  {
    title: "Drum triggers in toolbar",
    tags: ["toolbar", "wheel", "compact triggers"],
  },
  { title: "Quarter-hour slots", tags: ["time", "step", "15 min"] },
  { title: "Lunar phase strip", tags: ["single", "lunar"] },
  {
    title: "Weather forecast",
    tags: ["renderDay", "custom cell", "custom calendar"],
  },
  {
    title: "Activity heatmap",
    tags: ["renderDay", "heatmap", "custom calendar"],
  },
  { title: "Ticket prices", tags: ["renderDay", "pricing", "custom calendar"] },
  { title: "Event dots", tags: ["renderDay", "events", "custom calendar"] },
];

/** The four prebuilt cards lead the page; the rest are composed from modules. */
export const PREBUILT_COUNT = 4;
export const COMPOSED_COUNT = EXAMPLES.length - PREBUILT_COUNT;
