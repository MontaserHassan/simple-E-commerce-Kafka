import { Request, Response, NextFunction } from 'express';
import usersModel from '../models/users.model';
import jwt from 'jsonwebtoken';
import { Role } from '../interfaces/user.interface';


const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || '');
        const userData = await usersModel.findById(verified.id)         
        req.user = userData;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token.' });
    }
};
const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
    try {
        if (!token) return res.status(403).json({ error: 'Unauthorized access' }); 
        const verified = jwt.verify(token, process.env.JWT_SECRET || '');
        const userData = await usersModel.findById(verified.id) 
        if (userData.role !== Role.USER) return res.status(403).json({ error: 'Unauthorized access' });
        req.user = userData
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token.' });
    }
};

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
    try {
        if (!token) return res.status(403).json({ error: 'Unauthorized access' }); 
        const verified = jwt.verify(token, process.env.JWT_SECRET || '');
        const userData = await usersModel.findById(verified.id) 
        if (userData.role !== Role.ADMIN) return res.status(403).json({ error: 'Unauthorized access' });
        req.user = userData
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token.' });
    }
};


export {
    getCurrentUser,
    userAuth,
    adminAuth
};
