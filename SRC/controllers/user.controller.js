import User from "../models/user.model.js"


export const getAllUsers = async (req,res) => {
    try {
        const users = await User.find()
        if (!users) {
            res.status(404).json({message: "No users in the DB"})
            console.log("No users in the DB");
        } else {
            res.status(200).json({message: "users found successfully", users})
        }
    } catch (error) {
        res.status(500).json({message: error.message})
        console.log("error found", error);
    }
}
export const getSingleUser = async (req, res) => {
    try {
        const singleUser = await User.findById(req.params.id)
        if (!singleUser) {
            res.status(404).json({message: "user not found"})
            console.log(`user with ${id} not found`);
        } else {
            res.status(200).json({message: "user found successfully", singleUser})
        }
    } catch (error) {
        res.status(500).json({message: error.message})
        console.log("error found", error);
    }
}

export const deleteAllUsers = async (req,res) => {
        try {
        const users = await User.deleteMany()
        if (!users) {
            res.status(404).json({message: "No users in the DB"})
            console.log("No users in the DB");
        } else {
            res.status(200).json({message: "users deleted successfully", users})
        }
    } catch (error) {
        res.status(500).json({message: error.message})
        console.log("error found", error);
    }
}
export const deleteSingleUser = async (req, res) => {
        try {
        const singleUser = await User.findByIdAndDelete(req.params.id)
        if (!singleUser) {
            res.status(404).json({message: "user not found"})
            console.log(`user with ${id} not found`);
        } else {
            res.status(200).json({message: "user deleted successfully", singleUser})
        }
    } catch (error) {
        res.status(500).json({message: error.message})
        console.log("error found", error);
    }
}

export const followAndUnfollow = async (req, res) => {}
export const suspend = async ( ) => {}
