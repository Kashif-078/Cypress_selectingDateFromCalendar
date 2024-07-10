
export function getMonthIndex(month) {
    return new Date(`${month} 1, 2000`).getMonth();
}