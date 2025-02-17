/**
 * Assigns a numeric value to the set range. The range of values is considered to be closed in a ring.
 */
function cycleRestrict(value: number, min: number, max: number): number {
    return value - Math.floor((value - min) / (max - min)) * (max - min);
}

/**
 * Restricts an input numeric value to the set minimum and maximum limits.
 */
function restrict(value: number, min: number, max: number): number {
    return Math.max(Math.min(value, max), min);
}

export {cycleRestrict, restrict};
