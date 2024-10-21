import express from 'express';
import EmpresaController from '../controllers/empresaController.js';

const router = express.Router();

router.post('/cadastro', EmpresaController.criar);
router.get('/:id', EmpresaController.buscarPorId);
router.put('/:id', EmpresaController.atualizar);
router.delete('/:id', EmpresaController.excluir);

export default router;