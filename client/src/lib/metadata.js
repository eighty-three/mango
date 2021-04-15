import ky from 'ky-universal';
import HOST from './host';
const api = `${HOST}/api/metadata`;

export const updateNotes = async (md_id, notes) => {
  try {
    const req = await ky.post(
      `${api}/notes/update`,
      { json: { md_id, notes }}
    );

    const response = await req.json();
    return response;
  } catch (err) {
    return { error: 'Something went wrong' };
  }
};

export const getNotes = async () => {
  try {
    const req = await ky.get(`${api}/notes`);
    const response = await req.json();
    return response;
  } catch (err) {
    return { error: 'Something went wrong' };
  }
};

export const getIDs = async () => {
  try {
    const req = await ky.get(`${api}/id`);
    const response = await req.json();
    return response.IDs;
  } catch (err) {
    return { error: 'Something went wrong' };
  }
};
