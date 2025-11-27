import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import api from "@/lib/api";

interface Question {
    questionText: string;
    options: string[];
    correctOption: number;
}

const AdminQuiz = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [quizData, setQuizData] = useState({
        title: "",
        description: "",
        subject: "",
        grade: "11",
        chapter: "",
        timeLimit: 20,
    });

    const [questions, setQuestions] = useState<Question[]>([
        { questionText: "", options: ["", "", "", ""], correctOption: 0 }
    ]);

    const addQuestion = () => {
        setQuestions([...questions, { questionText: "", options: ["", "", "", ""], correctOption: 0 }]);
    };

    const removeQuestion = (index: number) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index));
        }
    };

    const updateQuestion = (index: number, field: keyof Question, value: any) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const handleSubmit = async () => {
        // Validation
        if (!quizData.title || !quizData.subject || !quizData.chapter) {
            toast({
                title: "Missing Information",
                description: "Please fill in all quiz details.",
                variant: "destructive",
            });
            return;
        }

        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].questionText || questions[i].options.some(opt => !opt)) {
                toast({
                    title: "Incomplete Questions",
                    description: `Please complete Question ${i + 1} and all its options.`,
                    variant: "destructive",
                });
                return;
            }
        }

        setLoading(true);
        try {
            await api.post("/quiz", {
                ...quizData,
                questions
            });

            toast({
                title: "Success!",
                description: "Quiz created successfully.",
            });
            navigate("/admin/materials"); // Or a dedicated quiz list page if we had one
        } catch (error: any) {
            console.error("Error creating quiz:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to create quiz.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in pb-12">
            <Button variant="ghost" onClick={() => navigate("/admin/materials")} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
            </Button>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Create New Quiz</h1>
                    <p className="text-slate-400">Build an adaptive quiz for students.</p>
                </div>
                <Button onClick={handleSubmit} disabled={loading} className="gap-2">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Publish Quiz
                </Button>
            </div>

            <div className="grid gap-8">
                {/* Quiz Metadata */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle>Quiz Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Quiz Title</Label>
                            <Input
                                placeholder="e.g., Thermodynamics Mastery Test"
                                value={quizData.title}
                                onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                                className="bg-slate-950 border-slate-800"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Select
                                    value={quizData.subject}
                                    onValueChange={(val) => setQuizData({ ...quizData, subject: val })}
                                >
                                    <SelectTrigger className="bg-slate-950 border-slate-800">
                                        <SelectValue placeholder="Select Subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Physics">Physics</SelectItem>
                                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                                        <SelectItem value="Biology">Biology</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Class</Label>
                                <Select
                                    value={quizData.grade}
                                    onValueChange={(val) => setQuizData({ ...quizData, grade: val })}
                                >
                                    <SelectTrigger className="bg-slate-950 border-slate-800">
                                        <SelectValue placeholder="Select Class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="11">Class 11</SelectItem>
                                        <SelectItem value="12">Class 12</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Chapter</Label>
                                <Input
                                    placeholder="e.g., Thermodynamics"
                                    value={quizData.chapter}
                                    onChange={(e) => setQuizData({ ...quizData, chapter: e.target.value })}
                                    className="bg-slate-950 border-slate-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Time Limit (minutes)</Label>
                                <Input
                                    type="number"
                                    value={quizData.timeLimit}
                                    onChange={(e) => setQuizData({ ...quizData, timeLimit: parseInt(e.target.value) })}
                                    className="bg-slate-950 border-slate-800"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Brief description of what this quiz covers..."
                                value={quizData.description}
                                onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                                className="bg-slate-950 border-slate-800"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Questions Builder */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Questions ({questions.length})</h2>
                        <Button variant="outline" onClick={addQuestion} className="gap-2">
                            <Plus className="h-4 w-4" /> Add Question
                        </Button>
                    </div>

                    {questions.map((q, qIndex) => (
                        <Card key={qIndex} className="bg-slate-900 border-slate-800 relative group">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex-1 space-y-2">
                                        <Label>Question {qIndex + 1}</Label>
                                        <Input
                                            placeholder="Enter question text..."
                                            value={q.questionText}
                                            onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
                                            className="bg-slate-950 border-slate-800 font-medium"
                                        />
                                    </div>
                                    {questions.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeQuestion(qIndex)}
                                            className="text-slate-500 hover:text-red-500 mt-8"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-slate-800">
                                    {q.options.map((opt, oIndex) => (
                                        <div key={oIndex} className="flex items-center gap-2">
                                            <div
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${q.correctOption === oIndex
                                                        ? "border-green-500 bg-green-500/20 text-green-500"
                                                        : "border-slate-600 hover:border-slate-400"
                                                    }`}
                                                onClick={() => updateQuestion(qIndex, "correctOption", oIndex)}
                                            >
                                                {q.correctOption === oIndex && <CheckCircle className="h-4 w-4" />}
                                            </div>
                                            <Input
                                                placeholder={`Option ${oIndex + 1}`}
                                                value={opt}
                                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                className={`bg-slate-950 border-slate-800 ${q.correctOption === oIndex ? "border-green-500/50" : ""
                                                    }`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex justify-center pt-8">
                    <Button onClick={handleSubmit} disabled={loading} size="lg" className="w-full md:w-auto min-w-[200px] gap-2">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Publish Quiz
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AdminQuiz;
