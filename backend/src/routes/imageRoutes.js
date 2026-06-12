const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const { uploadImage, getImages, deleteImage } = require('../controllers/imageController');

router.use(protect);

router.post('/', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, uploadImage);

router.get('/', getImages);
router.delete('/:id', deleteImage);

module.exports = router;