/**
 * Step definitions for the check-in flow.
 * Paths match the route segments so the sidebar and dock highlight correctly.
 */
export const STEPS = [
  { id: "STEP_01", label: "Distress & Affect", path: "/check-in/daily-metrics" },
  { id: "STEP_02", label: "Context Tags", path: "/check-in/contextual-factors" },
  { id: "STEP_03", label: "Open Reflection", path: "/check-in/clinical-narrative" },
  { id: "STEP_04", label: "Domain Focus", path: "/check-in/weekly-domain" },
  { id: "STEP_05", label: "Stampley Synthesis", path: "/check-in/stampley-support" },

] as const;

export type StepPath = (typeof STEPS)[number]["path"];