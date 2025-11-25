import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'student' | 'teacher' | 'admin';
    grade?: string;
    board?: string;
    subjects?: string[];
    xp: number;
    badges: string[];
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
        grade: { type: String },
        board: { type: String },
        subjects: [{ type: String }],
        xp: { type: Number, default: 0 },
        badges: [{ type: String }],
    },
    { timestamps: true }
);

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
});

UserSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password!);
};

export const User = mongoose.model<IUser>('User', UserSchema);
