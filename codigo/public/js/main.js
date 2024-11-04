import { auth, db } from './auth.js';
import { buscarUsuario, atualizarUsuario, excluirUsuario, enviarMoedas } from './crud.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const COLLECTIONS = {
    aluno: 'alunos',
    professor: 'professores',
    empresa: 'empresas'
};

// Adicione esta função no início do arquivo, junto com as outras funções de atualização
async function carregarDadosPerfil(userData) {
    const form = document.getElementById('perfilForm');
    if (form) {
        // Preenche cada campo do formulário com os dados do usuário
        for (const [key, value] of Object.entries(userData)) {
            const input = form.elements[key];
            if (input && key !== 'password' && key !== 'saldoMoedas' && key !== 'dataCadastro' && key !== 'transacoes') {
                input.value = value;
            }
        }
    }
}

// Funções de atualização do dashboard
function atualizarDashboardAluno(userData) {
    const nomeAluno = document.getElementById('nomeAluno');
    const saldoAtual = document.getElementById('saldoAtual');
    const instituicao = document.getElementById('instituicao');
    const curso = document.getElementById('curso');

    if (nomeAluno) nomeAluno.textContent = userData.nome;
    if (saldoAtual) saldoAtual.textContent = userData.saldoMoedas || 0;
    if (instituicao) instituicao.textContent = userData.instituicao;
    if (curso) curso.textContent = userData.curso;
}

function atualizarDashboardProfessor(userData) {
    const nomeProfessor = document.getElementById('nomeProfessor');
    const saldoAtual = document.getElementById('saldoAtual');
    const departamento = document.getElementById('departamento');
    const instituicao = document.getElementById('instituicao');

    if (nomeProfessor) nomeProfessor.textContent = userData.nome;
    if (saldoAtual) saldoAtual.textContent = userData.saldoMoedas || 0;
    if (departamento) departamento.textContent = userData.departamento;
    if (instituicao) instituicao.textContent = userData.instituicao;
}

function atualizarDashboardEmpresa(userData) {
    const nomeEmpresa = document.getElementById('nomeEmpresa');
    const cnpj = document.getElementById('cnpj');
    const endereco = document.getElementById('endereco');

    if (nomeEmpresa) nomeEmpresa.textContent = userData.nome;
    if (cnpj) cnpj.textContent = userData.cnpj;
    if (endereco) endereco.textContent = userData.endereco;
}

// Verificar autenticação
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const userType = localStorage.getItem('userType');
        try {
            const userData = await buscarUsuario(userType, user.uid);
            
            if (window.location.pathname.includes('dashboard')) {
                switch(userType) {
                    case 'aluno':
                        atualizarDashboardAluno(userData);
                        break;
                    case 'professor':
                        atualizarDashboardProfessor(userData);
                        break;
                    case 'empresa':
                        atualizarDashboardEmpresa(userData);
                        break;
                }
            } else if (window.location.pathname.includes('perfil')) {
                await carregarDadosPerfil(userData);
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }
});

// Formulário de envio de moedas (Professor)
const enviarMoedasForm = document.getElementById('enviarMoedasForm');
if (enviarMoedasForm) {
    enviarMoedasForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const alunoId = document.getElementById('alunoSelect').value;
        const quantidade = parseInt(document.getElementById('quantidade').value);
        const motivo = document.getElementById('motivo').value;

        if (!alunoId || !quantidade || !motivo) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        try {
            const professorId = auth.currentUser.uid;
            await enviarMoedas(professorId, alunoId, quantidade, motivo);
            alert('Moedas enviadas com sucesso!');
            window.location.reload();
        } catch (error) {
            alert('Erro ao enviar moedas: ' + error.message);
        }
    });
}

// Atualização de perfil
const perfilForm = document.getElementById('perfilForm');
if (perfilForm) {
    perfilForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userType = localStorage.getItem('userType');
        const userId = auth.currentUser.uid;
        
        const formData = new FormData(perfilForm);
        const dadosAtualizados = {};
        
        for (const [key, value] of formData.entries()) {
            if (value) dadosAtualizados[key] = value;
        }

        try {
            await atualizarUsuario(userType, userId, dadosAtualizados);
            alert('Perfil atualizado com sucesso!');
            window.location.reload();
        } catch (error) {
            alert('Erro ao atualizar perfil: ' + error.message);
        }
    });
}

// Exclusão de conta
const excluirContaBtn = document.getElementById('excluirContaBtn');
if (excluirContaBtn) {
    excluirContaBtn.addEventListener('click', async () => {
        if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
            try {
                const userType = localStorage.getItem('userType');
                const userId = auth.currentUser.uid;
                await excluirUsuario(userType, userId);
                await auth.currentUser.delete();
                localStorage.clear();
                window.location.href = 'index.html';
            } catch (error) {
                alert('Erro ao excluir conta: ' + error.message);
            }
        }
    });
}