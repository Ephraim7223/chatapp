import cryptoHash from "crypto"
import User from "../models/user.model.js"
import { regValidator } from "../validators/auth.js"
import { generateToken } from "../utils/generatetoken.js"

function hashValue (value) {
    const hash = cryptoHash.createHash('sha256')
    hash.update(value)
    return hash.digest('hex')
}

function comparePasswords (inputpass, hashedPass) {
    return hashValue(inputpass) === hashedPass
}

export const signup = async (req, res)=> {
    const registerResults = regValidator.safeParse(req.body)
    if (!registerResults.success) {
        res.status(400).json((registerResults.error.issues))
    }
    try {
        const {userName, email, phoneNumber} = req.body
        const {password, firstName, lastName ,DOB, gender } = req.body

        const existingUser = await User.findOne( {$or :[{userName}, {email}, {phoneNumber}]})
        if (existingUser) {
            return res.status(409).send({message: 'User already exists', existingUser})
        }

        const encryption = hashValue(password)

        const newUser = new User({
            userName,
            email,
            password: encryption,
            firstName,
            phoneNumber,
            lastName,
            DOB,
            gender
        })

        await newUser.save()
        res.status(201).json({message: 'User created succesfully', newUser})
        console.log('User created succesfully');   
    } catch (error) {
        res.status(500)
        console.log("error", error);
    }
}

export const signin = async (req, res)=> {
    try {
        const {email, password} = req.body
        const user = await User.findOne({$or :[{email}, {password}]})
        if (!user) {
           return res.status(404).json({message: "User not found"})
        }  
        if (user.isSuspended) {
            return res.status(403).json({message: "user suspended"})
        }

        const comparePass = comparePasswords(password, user.password)
        if (!comparePass) {
            res.status(400).json({message: "Password is incorrect"})
        }

        const accessToken = generateToken(user._id, res)
         res.status(200).json({message: "LOGIN SUCCESSFUL", accessToken})
         console.log("Login successful" ,user);
    } catch (error) {
        res.status(500)
        console.log("error", error);
    }
}