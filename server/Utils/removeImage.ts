import fs from 'fs';

const defaultsImages = ['default.jpg'];

const removeImage = (oldPhoto: string | undefined, nameFolder: string) => {
  if (oldPhoto?.endsWith('.jpeg')) {
    const imageDir =
      oldPhoto &&
      fs.statSync(`./public/img/${nameFolder}/${oldPhoto}`, {
        throwIfNoEntry: false,
      });

    if (imageDir && !defaultsImages.includes(oldPhoto))
      fs.unlinkSync(`./public/img/${nameFolder}/${oldPhoto}`);
  }
};

export default removeImage;
