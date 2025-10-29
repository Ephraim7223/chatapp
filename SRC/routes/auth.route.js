import express from 'express'
import { signin, signup } from '../controllers/auth.controller.js'

const route = express.Router()

route.post('/register', signup)
route.post('/login', signin)

export default route