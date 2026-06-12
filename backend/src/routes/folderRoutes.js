const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { createFolder, getFolders, deleteFolder,getFolderSize } = require('../controllers/folderController');

router.use(protect);

router.get('/:id/size', getFolderSize);
router.post('/', createFolder);
router.get('/', getFolders);
router.delete('/:id', deleteFolder);

module.exports = router;