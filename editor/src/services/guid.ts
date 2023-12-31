/**
 * generate a GUID
 */
export function guid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    // eslint-disable-next-line no-mixed-operators
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line no-mixed-operators, no-bitwise
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
