export function generateID(): string {
  return Math.random()
    .toString(16)
    .substr(2);
}
