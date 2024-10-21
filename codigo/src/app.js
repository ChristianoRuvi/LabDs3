import express from 'express';
import cors from 'cors';
import path from 'path';
import alunoRoutes from './routes/alunoRoutes.js';
import empresaRoutes from './routes/empresaRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/alunos', alunoRoutes);
app.use('/api/empresas', empresaRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;