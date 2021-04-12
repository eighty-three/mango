// Taken from MDN
export const sanitize = (str: string|null): string =>
  (!str|| typeof str !== 'string')
    ? ''
    : str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const pubStatus = (
  num: number
): string => { // Fix when MD is back up
  switch (num) {
    case 1:
      return 'ongoing';
    case 2:
      return 'complete';
    case 3:
      return 'cancelled';
    case 4:
      return 'hiatus';

    default:
      return 'ongoing';
  }
};
