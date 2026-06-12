const Folder = require('../models/Folder');

// Create folder
exports.createFolder = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const folder = await Folder.create({
      name,
      owner: req.user.id,
      parent: parent || null,
    });
    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get folders (root level or children of a parent)
exports.getFolders = async (req, res) => {
  try {
    const { parentId } = req.query;
    const folders = await Folder.find({
      owner: req.user.id,
      parent: parentId || null,
    });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete folder
exports.deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, owner: req.user.id });
    if (!folder) return res.status(404).json({ message: 'Folder not found' });
    await folder.deleteOne();
    res.json({ message: 'Folder deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFolderSize = async (req, res) => {
  try {
    const Image = require('../models/Image');
    const getFolderSizeRecursive = async (folderId, userId) => {
      const images = await Image.find({ folder: folderId, owner: userId });
      const imageSize = images.reduce((sum, img) => sum + img.size, 0);

      const subfolders = await Folder.find({ parent: folderId, owner: userId });
      let subfolderSize = 0;
      for (const sub of subfolders) {
        subfolderSize += await getFolderSizeRecursive(sub._id, userId);
      }

      return imageSize + subfolderSize;
    };

    const totalSize = await getFolderSizeRecursive(req.params.id, req.user.id);
    res.json({ folderId: req.params.id, size: totalSize });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};