import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const NODE_ENV = process.env.NODE_ENV || 'development';

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('JWT secrets must be defined in environment variables');
}

export const generateAccessToken = (userId) => {
    return jwt.sign(
        { userId, type: 'access' },
        JWT_SECRET,
        { expiresIn: '15m' }
    );
};

export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId, type: 'refresh' },
        JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};

export const setAuthCookies = (res, accessToken, refreshToken) => {
    const cookieOptions = {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
    };

    res.cookie('accessToken', accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
};

export const clearAuthCookies = (res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
};

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired access token');
    }
};

export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};

