const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'image-' + uniqueSuffix + extension);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

app.use(express.json());

app.get('/api/status', (req, res) => {
  res.json({ status: 'online', message: 'Image upload API is running' });
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image was uploaded or file is not an image'
      });
    }

    const imageDetails = {
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: `/images/${req.file.filename}`
    };

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: imageDetails
    });
  } catch (error) {
    console.error('Error handling upload:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing image upload',
      error: error.message
    });
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
  next();
});

app.use('/images', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Image upload API running at http://localhost:${port}`);
});