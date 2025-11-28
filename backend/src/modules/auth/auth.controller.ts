import { Request, Response } from 'express';
import { User } from './auth.model';
import { generateToken } from '../../utils/jwt';
import { AuthRequest } from '../../middleware/auth.middleware';

export const register = async (req: Request, res: Response) => {
    const { name, email, password, username } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const user = await User.create({
            name,
            email,
            password,
            username,
            role: 'student' // Default role
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken((user._id as unknown) as string, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken((user._id as unknown) as string, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.grade = req.body.grade || user.grade;
            user.board = req.body.board || user.board;
            // Username update could be added here if desired, but usually requires uniqueness check

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                grade: updatedUser.grade,
                board: updatedUser.board,
                xp: updatedUser.xp,
                badges: updatedUser.badges,
                token: generateToken((updatedUser._id as unknown) as string, updatedUser.role),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
