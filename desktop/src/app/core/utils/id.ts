export function uid(prefix = "msg"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
