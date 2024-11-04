import ProfessorModel from '../models/professorModel.js';

class ProfessorController {
    static async buscarPorId(req, res) {
        try {
            const professor = await ProfessorModel.buscarPorId(req.params.id);
            res.json(professor);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    static async atualizar(req, res) {
        try {
            await ProfessorModel.atualizar(req.params.id, req.body);
            res.json({ message: 'Professor atualizado com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async listarAlunos(req, res) {
        try {
            const alunos = await ProfessorModel.listarAlunos();
            res.json(alunos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async enviarMoedas(req, res) {
        try {
            const { professorId, alunoId, quantidade, motivo } = req.body;
            await ProfessorModel.enviarMoedas(professorId, alunoId, quantidade, motivo);
            res.json({ message: 'Moedas enviadas com sucesso' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default ProfessorController;