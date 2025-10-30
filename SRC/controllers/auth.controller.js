import User from '../models/user.model.js';
import { regValidator, loginValidator } from '../validators/auth.js';
import { hashPassword, comparePassword, needsRehash } from '../utils/passwordManager.js';
import { 
    generateAccessToken, 
    generateRefreshToken, 
    setAuthCookies,
    clearAuthCookies,
    verifyRefreshToken
} from '../utils/generatetoken.js';

export const signup = async (req, res) => {
    try {
        const validationResult = regValidator.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationResult.error.issues
            });
        }

        const { userName, email, phoneNumber, password, firstName, lastName, DOB, gender } = req.body;

        const existingUser = await User.findOne({
            $or: [{ userName }, { email }, { phoneNumber }]
        }).select('userName email phoneNumber');

        if (existingUser) {
            const field = existingUser.userName === userName ? 'username' :
                         existingUser.email === email ? 'email' : 'phone number';
            return res.status(409).json({
                success: false,
                message: `User with this ${field} already exists`
            });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phoneNumber,
            DOB,
            gender
        });

        await newUser.save();

        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        setAuthCookies(res, accessToken, refreshToken);

        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: userResponse,
            accessToken
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        if (user.isSuspended) {
            return res.status(403).json({
                success: false,
                message: 'Account suspended. Please contact support.'
            });
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        if (await needsRehash(user.password)) {
            user.password = await hashPassword(password);
            await user.save();
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        setAuthCookies(res, accessToken, refreshToken);

        user.lastLogin = new Date();
        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: userResponse,
            accessToken
        });

    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token not found'
            });
        }

        const decoded = verifyRefreshToken(refreshToken);

        const user = await User.findById(decoded.userId);

        if (!user || user.isSuspended) {
            return res.status(401).json({
                success: false,
                message: 'User not found or suspended'
            });
        }

        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        setAuthCookies(res, newAccessToken, newRefreshToken);

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            accessToken: newAccessToken
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired refresh token'
        });
    }
};


export const logout = async (req, res) => {
    try {
        clearAuthCookies(res);
        
        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed'
        });
    }
};
