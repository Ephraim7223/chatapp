import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { connectDB } from './SRC/DB/database.js'
import router from './SRC/routes/index.js'

dotenv.config()
const app = express()

app.use(cors({ origin: "*" }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/api/v1', router)

const startServer = async => {
    const PORT = process.env.PORT || 2456
    connectDB ()
    try {
        app.listen(PORT, () => {
            console.log(" chat app running successfully");
        } )
    } catch (error) {
        
    }
}

startServer()

app.get("/", (req, res) => {
    res.send(" WELCOME ");
})