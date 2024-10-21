import AlunoModel from '../models/alunoModel.js';

class AlunoController {
    static async criar(req, res) {
        try {
            const id = await AlunoModel.criar(req.body);
            res.status(201).json({ id, message: 'Aluno criado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const aluno = await AlunoModel.buscarPorId(req.params.id);
            res.json(aluno);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    static async atualizar(req, res) {
        try {
            await AlunoModel.atualizar(req.params.id, req.body);
            res.json({ message: 'Aluno atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async excluir(req, res) {
        try {
            await AlunoModel.excluir(req.params.id);
            res.json({ message: 'Aluno excluído com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async listarEmpresas(req, res) {
        try {
            const empresas = await AlunoModel.listarEmpresas();
            res.json(empresas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default AlunoController;