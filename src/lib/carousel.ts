/** Steps a carousel index forward/backward with wrap-around. */
export const step = (i: number, len: number, d: 1 | -1): number =>
  (i + d + len) % len;
