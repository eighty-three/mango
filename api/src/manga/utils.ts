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
      return 'Ongoing';
    case 2:
      return 'Complete';
    case 3:
      return 'Cancelled';
    case 4:
      return 'Hiatus';

    default:
      return 'Ongoing';
  }
};
