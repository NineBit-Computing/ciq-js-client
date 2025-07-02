export function formatError(ex: unknown): string {
  if (ex instanceof Error) {
    return ex.message;
  }
  return String(ex);
}