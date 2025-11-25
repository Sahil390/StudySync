import mongoose, { Schema, Document } from 'mongoose';

export interface IStudyMaterial extends Document {
    title: string;
    description: string;
    type: 'pdf' | 'youtube' | 'link';
    url: string;
    board: string;
    grade: string;
    subject: string;
    chapter: string;
    topic: string;
    tags: string[];
    views: number;
    uploadedBy: mongoose.Schema.Types.ObjectId;
}

const StudyMaterialSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        type: { type: String, enum: ['pdf', 'youtube', 'link'], required: true },
        url: { type: String, required: true },
        board: { type: String, required: true },
        grade: { type: String, required: true },
        subject: { type: String, required: true },
        chapter: { type: String, required: true },
        topic: { type: String, required: true },
        tags: [{ type: String }],
        views: { type: Number, default: 0 },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

export const StudyMaterial = mongoose.model<IStudyMaterial>('StudyMaterial', StudyMaterialSchema);
