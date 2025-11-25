import { Response } from 'express';
import { Notification } from './notifications.model';
import { AuthRequest } from '../../middleware/auth.middleware';

export const getNotifications = async (req: AuthRequest, res: Response) => {
    try {
        const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification) {
            if (notification.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized' });
            }
            notification.isRead = true;
            await notification.save();
            res.json(notification);
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const sendNotification = async (userId: string, message: string, type: 'info' | 'alert' | 'success' = 'info') => {
    try {
        await Notification.create({
            user: userId,
            message,
            type,
        } as any);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};
