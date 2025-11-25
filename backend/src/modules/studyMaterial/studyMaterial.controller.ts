import { Request, Response } from 'express';
import { StudyMaterial } from './studyMaterial.model';
import { AuthRequest } from '../../middleware/auth.middleware';
import cloudinary from '../../config/cloudinary';
import fs from 'fs';

export const createStudyMaterial = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, type, url, board, grade, subject, chapter, topic, tags } = req.body;
        let materialUrl = url;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: 'auto',
                folder: 'studysync/materials',
            });
            materialUrl = result.secure_url;
            // Remove file from local storage
            fs.unlinkSync(req.file.path);
        }

        const material = await StudyMaterial.create({
            title,
            description,
            type,
            url: materialUrl,
            board,
            grade,
            subject,
            chapter,
            topic,
            tags: tags ? tags.split(',') : [],
            uploadedBy: req.user._id,
        });

        res.status(201).json(material);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getStudyMaterials = async (req: Request, res: Response) => {
    try {
        const { board, grade, subject, chapter, topic, tags, search } = req.query;
        const query: any = {};

        if (board) query.board = board;
        if (grade) query.grade = grade;
        if (subject) query.subject = subject;
        if (chapter) query.chapter = chapter;
        if (topic) query.topic = topic;
        if (tags) query.tags = { $in: (tags as string).split(',') };
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const materials = await StudyMaterial.find(query).populate('uploadedBy', 'name');
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getStudyMaterialById = async (req: Request, res: Response) => {
    try {
        const material = await StudyMaterial.findById(req.params.id).populate('uploadedBy', 'name');
        if (material) {
            material.views += 1;
            await material.save();
            res.json(material);
        } else {
            res.status(404).json({ message: 'Material not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteStudyMaterial = async (req: AuthRequest, res: Response) => {
    try {
        const material = await StudyMaterial.findById(req.params.id);

        if (material) {
            if (material.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to delete this material' });
            }

            await material.deleteOne();
            res.json({ message: 'Material removed' });
        } else {
            res.status(404).json({ message: 'Material not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
