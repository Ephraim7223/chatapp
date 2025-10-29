import express from "express"
import { deleteAllUsers, deleteSingleUser, followAndUnfollow, getAllUsers, getSingleUser, suspend } from "../controllers/user.controller.js"

const route = express.Router()

route.get('/', getAllUsers)
route.get('/:id', getSingleUser)
route.delete('/', deleteAllUsers)
route.delete('/:id', deleteSingleUser)
route.patch('/follow/:id', followAndUnfollow)
route.patch('/suspend/:id', suspend)

export default route