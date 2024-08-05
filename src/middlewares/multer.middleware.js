import multer from 'multer'
import {v4 as uuid} from 'uuid'
import path from 'path'
const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null,'./public/temp/')
    },
    filename:(req, file, cb)=>{
        cb(null,uuid()+path.extname(file.originalname))
    }
})

export const upload = multer({storage})