import express from 'express';
import ProfessorController from '../controllers/professorController.js';

const router = express.Router();

router.get('/:id', ProfessorController.buscarPorId);
router.put('/:id', ProfessorController.atualizar);
router.get('/alunos/listar', ProfessorController.listarAlunos);
router.post('/enviar-moedas', ProfessorController.enviarMoedas);

export default router;