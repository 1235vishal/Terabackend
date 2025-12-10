const fs = require('fs');
const multer = require('multer');
const path = require('path');

const heroDir = path.join(process.cwd(), 'uploads', 'hero');
if (!fs.existsSync(heroDir)) {
    fs.mkdirSync(heroDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, heroDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
        cb(null, `${Date.now()}_${base}${ext}`);
    },
});

function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
}

const uploadHero = multer({ storage, fileFilter });

module.exports = uploadHero;
