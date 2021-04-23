import fs from 'fs';

export const checkImage = (id) => {
  const imagePath = './public/images/covers'; // hardcoded
  const imageFile = `${imagePath}/${id}.png`;
  const image = (fs.existsSync(imageFile)) ? String(id) : 'placeholder';
  return image;
};
