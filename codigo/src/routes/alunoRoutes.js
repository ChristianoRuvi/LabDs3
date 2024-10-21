import express from 'express';
import AlunoController from '../controllers/alunoController.js';

const router = express.Router();

router.post('/cadastro', AlunoController.criar);
router.get('/:id', AlunoController.buscarPorId);
router.put('/:id', AlunoController.atualizar);
router.delete('/:id', AlunoController.excluir);

export default router;