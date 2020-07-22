const path = require('path')
const router = require('express').Router()
const multer = require('multer')
const STORAGE_PATH = path.join(__dirname, '/file_uploads')

/** TODO: Improvents on naming of files for Consistent file storoge
    TODO: Move upload folder
**/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, STORAGE_PATH)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const filename = toSnakeCase(path.basename(file.originalname, ext)) + '_' + Date.now() + ext

    // eslint-disable-next-line
    console.log('storage: ', file)
    cb(null, filename)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype.includes('spreadsheetml') || file.mimetype.includes('excel')) {
    cb(null, true)
  } else {
    // cb(null, false)
    cb(new Error('Only excel files are allowed'))
  }
}

const upload = multer({ storage, fileFilter })

// TODO handle different file types other than that specified

// Upload route
router.post('/upload', upload.single('file'), (req, res, next) => {
  try {
    return res.status(201).json({
      message: 'File uploded successfully'
    })
  } catch (error) {
    // eslint-disable-next-line
    console.error(error)

    // eslint-disable-next-line
    console.log(error)

    res.send(400)
  }
})

// TODO: move to Utilities
function toSnakeCase (string) {
  return string
    .split(/(?=[A-Z])/).join('_')
    .toLowerCase()
    .replace(/ +/g, '')
}

module.exports = router
