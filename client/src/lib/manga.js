import Router from 'next/router';
import ky from 'ky-universal';
import HOST from './host';
const api = `${HOST}/api/manga`;

export const getSeries = async (id) => {
  try {
    const req = await ky.get(`${api}/series/${id}`);
    const response = await req.json();
    return response;
  } catch (err) {
    return { error: 'Something went wrong' };
  }
};

export const getRandomSeries = async () => {
  try {
    const req = await ky.get(`${api}/series/random`);
    const response = await req.json();
    Router.replace(`/manga/${response.id}`);
  } catch (err) {
    return { error: 'Something went wrong' };
  }
};
