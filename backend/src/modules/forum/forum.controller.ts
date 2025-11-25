import { Request, Response } from 'express';
import { Question } from './forum.model';
import { AuthRequest } from '../../middleware/auth.middleware';

export const createQuestion = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, tags } = req.body;
        const question = await Question.create({
            title,
            description,
            tags,
            askedBy: req.user._id,
        });
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getQuestions = async (req: Request, res: Response) => {
    try {
        const questions = await Question.find()
            .populate('askedBy', 'name')
            .sort({ createdAt: -1 });
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getQuestionById = async (req: Request, res: Response) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('askedBy', 'name')
            .populate('answers.answeredBy', 'name');
        if (question) {
            question.views += 1;
            await question.save();
            res.json(question);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const addAnswer = async (req: AuthRequest, res: Response) => {
    try {
        const { text } = req.body;
        const question = await Question.findById(req.params.id);

        if (question) {
            const answer = {
                text,
                answeredBy: req.user._id,
                upvotes: [],
                isVerified: false,
            };
            question.answers.push(answer as any);
            await question.save();
            res.status(201).json(question);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const upvoteAnswer = async (req: AuthRequest, res: Response) => {
    try {
        const { questionId, answerId } = req.params;
        const question = await Question.findById(questionId);

        if (question) {
            const answer = (question.answers as any).id(answerId);
            if (answer) {
                if (answer.upvotes.includes(req.user._id)) {
                    return res.status(400).json({ message: 'Already upvoted' });
                }
                answer.upvotes.push(req.user._id);
                await question.save();
                res.json(question);
            } else {
                res.status(404).json({ message: 'Answer not found' });
            }
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const verifyAnswer = async (req: AuthRequest, res: Response) => {
    try {
        const { questionId, answerId } = req.params;
        const question = await Question.findById(questionId);

        if (question) {
            const answer = (question.answers as any).id(answerId);
            if (answer) {
                answer.isVerified = true;
                await question.save();
                res.json(question);
            } else {
                res.status(404).json({ message: 'Answer not found' });
            }
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
