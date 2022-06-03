export function deepCopyList<T>(list: T[]) {
  return Object.assign([], list);
}
