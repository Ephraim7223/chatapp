import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import dotenv from 'dotenv';
dotenv.config()

export const protectedRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startWith("Bearer ")) {
            return res.status(401).json({ message : "Unauthorized"})
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized"})
        }
        if (!process.env.JWT_SECRET) {
            throw new Error ("JWT_SECRET env variable is not defined")
        }

        console.log("Token recieved", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log("Decoded token:", decoded); 

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            throw new Error ("User not found")
        }

        req.user = user;

        next()
        
    } catch (error) {
        res.status(500).json({message: error.message})
        console.error("Error in routeProtection")
    }
}