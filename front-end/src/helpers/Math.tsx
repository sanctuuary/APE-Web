/* eslint-disable import/prefer-default-export */

/**
 * Limit a number to be within a range of a lower and upper value.
 * ```
 * lower <= num <= upper
 * ```
 * @param num The number.
 * @param lower The lower limit for the number.
 * @param upper The upper limit for the number.
 * @returns A value between the lower and upper limit.
 */
export function clamp(num: number, lower: number, upper: number): number {
  return Math.max(Math.min(num, upper), lower);
}
