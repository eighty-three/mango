import ky from 'ky-universal';
const path = 'http://localhost:3001/images/covers'; // hardcoded

/* Probably unnecessary once MD is up and the images can
 * just be downloaded, ensuring there's always a cover image
 */
export const getImage = async (id) => {
  try {
    const req = await ky.get(`${path}/${id}.png`);
    return req.status;
  } catch (err) {
    return 404;
  }
};
