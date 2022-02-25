import express, {Request, Response} from 'express'
import router from './routes/Route'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
var cors = require('cors')

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())
app.use(router)

app.listen(8000, () => {
    console.log("Connect done !!!");
})