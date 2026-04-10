/**
 * Merge class names (shadcn-style). Extend with `clsx` + `tailwind-merge` later if needed.
 */
export function cn(
  ...inputs: Array<string | undefined | null | false>
): string {
  return inputs.filter(Boolean).join(" ");
}
