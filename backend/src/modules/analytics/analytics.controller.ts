import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { QuizAttempt } from '../quiz/quiz.model';
import { StudyMaterial } from '../studyMaterial/studyMaterial.model';
import { Question } from '../forum/forum.model';

export const getAnalytics = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user._id;

        // Quiz Performance
        const attempts = await QuizAttempt.find({ student: userId }).populate('quiz');
        const totalQuizzes = attempts.length;
        const totalScore = attempts.reduce((acc, curr) => acc + curr.score, 0);
        const totalPossibleScore = attempts.reduce((acc, curr) => acc + curr.totalQuestions, 0);
        const averageAccuracy = totalPossibleScore > 0 ? (totalScore / totalPossibleScore) * 100 : 0;

        // Subject-wise Performance
        const subjectPerformance: any = {};
        attempts.forEach((attempt: any) => {
            const subject = attempt.quiz.subject;
            if (!subjectPerformance[subject]) {
                subjectPerformance[subject] = { score: 0, total: 0 };
            }
            subjectPerformance[subject].score += attempt.score;
            subjectPerformance[subject].total += attempt.totalQuestions;
        });

        const subjectAnalytics = Object.keys(subjectPerformance).map((subject) => ({
            subject,
            accuracy: (subjectPerformance[subject].score / subjectPerformance[subject].total) * 100,
        }));

        // Forum Activity
        const questionsAsked = await Question.countDocuments({ askedBy: userId });

        // Study Material Views (This would require a separate tracking model for user views, 
        // but for now we can just return global stats or skip it as per requirements "Track student progress")
        // Assuming we want to track what the student has viewed, we would need a UserActivity model.
        // For now, let's stick to Quiz performance as the main analytic.

        res.json({
            totalQuizzes,
            averageAccuracy,
            subjectAnalytics,
            questionsAsked,
            xp: req.user.xp,
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
