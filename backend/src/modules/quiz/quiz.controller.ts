import { Request, Response } from 'express';
import { Quiz, QuizAttempt } from './quiz.model';
import { AuthRequest } from '../../middleware/auth.middleware';
import { User } from '../auth/auth.model';

export const createQuiz = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, board, grade, subject, chapter, topic, questions } = req.body;

        const quiz = await Quiz.create({
            title,
            description,
            board,
            grade,
            subject,
            chapter,
            topic,
            questions,
            createdBy: req.user._id,
        });

        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getQuizzes = async (req: Request, res: Response) => {
    try {
        const { board, grade, subject, chapter, topic } = req.query;
        const query: any = {};

        if (board) query.board = board;
        if (grade) query.grade = grade;
        if (subject) query.subject = subject;
        if (chapter) query.chapter = chapter;
        if (topic) query.topic = topic;

        const quizzes = await Quiz.find(query).populate('createdBy', 'name');
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getQuizById = async (req: Request, res: Response) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name');
        if (quiz) {
            res.json(quiz);
        } else {
            res.status(404).json({ message: 'Quiz not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const attemptQuiz = async (req: AuthRequest, res: Response) => {
    try {
        const { quizId, answers } = req.body; // answers: [{ questionIndex: number, selectedOption: number }]
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        let score = 0;
        const processedAnswers = answers.map((ans: any) => {
            const question = quiz.questions[ans.questionIndex];
            const isCorrect = question.correctOption === ans.selectedOption;
            if (isCorrect) score++;
            return {
                questionId: (question as any)._id,
                selectedOption: ans.selectedOption,
                isCorrect,
            };
        });

        const attempt = await QuizAttempt.create({
            student: req.user._id,
            quiz: quizId,
            score,
            totalQuestions: quiz.questions.length,
            answers: processedAnswers,
        });

        // Update User XP
        const user = await User.findById(req.user._id);
        if (user) {
            user.xp += score * 10; // 10 XP per correct answer
            await user.save();
        }

        res.status(201).json(attempt);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
