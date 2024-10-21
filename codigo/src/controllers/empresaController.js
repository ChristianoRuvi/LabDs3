import EmpresaModel from '../models/empresaModel.js';

class EmpresaController {
    static async criar(req, res) {
        try {
            const id = await EmpresaModel.criar(req.body);
            res.status(201).json({ id, message: 'Empresa criada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const empresa = await EmpresaModel.buscarPorId(req.params.id);
            res.json(empresa);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    static async atualizar(req, res) {
        try {
            await EmpresaModel.atualizar(req.params.id, req.body);
            res.json({ message: 'Empresa atualizada com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async excluir(req, res) {
        try {
            await EmpresaModel.excluir(req.params.id);
            res.json({ message: 'Empresa excluída com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default EmpresaController;