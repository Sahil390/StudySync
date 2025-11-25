import express from 'express';
import { createStudyMaterial, getStudyMaterials, getStudyMaterialById, deleteStudyMaterial } from './studyMaterial.controller';
import { protect, authorize } from '../../middleware/auth.middleware';
import upload from '../../middleware/upload.middleware';

const router = express.Router();

router.post('/', protect, authorize('teacher', 'admin'), upload.single('file'), createStudyMaterial);
router.get('/', getStudyMaterials);
router.get('/:id', getStudyMaterialById);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteStudyMaterial);

export default router;
