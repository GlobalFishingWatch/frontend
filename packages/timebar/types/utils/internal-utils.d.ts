export function getTime(dateISO: any): number;
export function clampToAbsoluteBoundaries(start: any, end: any, desiredDeltaMs: any, absoluteStart: any, absoluteEnd: any): {
    newStartClamped: any;
    newEndClamped: any;
    clamped: string;
};
export function getDeltaMs(start: any, end: any): number;
export function getDeltaDays(start: any, end: any): number;
export function isMoreThanADay(start: any, end: any): boolean;
export function getDefaultFormat(start: any, end: any): "MMM D YYYY" | "MMM D YYYY HH:mm";
export function stickToClosestUnit(date: any, unit: any): any;
