const Image = require('../models/Image');
const { cloudinary } = require('../config/cloudinary');

exports.uploadImage = async (req, res) => {
  try {
    console.log('body:', req.body);
    console.log('file:', req.file);
    
    const { name, folderId } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const targetFolder = (folderId && folderId !== 'null' && folderId !== 'undefined') ? folderId : null;

    const image = await Image.create({
      name,
      url: req.file.path,
      publicId: req.file.filename,
      size: req.file.size,
      folder: targetFolder,
      owner: req.user.id,
    });

    res.status(201).json(image);
  } catch (err) {
    console.error('Upload error:', err.message, err.stack);
    res.status(500).json({ message: err.message });
  }
};

exports.getImages = async (req, res) => {
  try {
    const { folderId } = req.query;
    const targetFolder = (folderId && folderId !== 'null' && folderId !== 'undefined') ? folderId : null;
    const images = await Image.find({ folder: targetFolder, owner: req.user.id });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findOne({ _id: req.params.id, owner: req.user.id });
    if (!image) return res.status(404).json({ message: 'Image not found' });

    await cloudinary.uploader.destroy(image.publicId);
    await image.deleteOne();

    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};