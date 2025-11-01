import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { verifyAccessToken } from '../utils/tokenManager.js';

export const protectedRoute = async (req, res, next) => {
    try {
        let token;

        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } 
        else if (req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const decoded = verifyAccessToken(token);

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isSuspended) {
            return res.status(403).json({
                success: false,
                message: 'Account suspended'
            });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error('Auth middleware error:', error);

        if (error.message.includes('expired')) {
            return res.status(401).json({
                success: false,
                message: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
        }

        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

export const optionalAuth = async (req, res, next) => {
    try {
        let token;

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (token) {
            const decoded = verifyAccessToken(token);
            const user = await User.findById(decoded.userId).select('-password');
            
            if (user && !user.isSuspended) {
                req.user = user;
            }
        }

        next();
    } catch (error) {
        next();
    }
};

export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }

        next();
    };
};