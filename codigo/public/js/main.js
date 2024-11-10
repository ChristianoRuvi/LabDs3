import { auth, db } from './auth.js';
import { 
    doc, 
    getDoc, 
    updateDoc, 
    deleteDoc, 
    collection, 
    getDocs, 
    addDoc,
    query,
    where 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { 
    buscarUsuario, 
    atualizarUsuario, 
    excluirUsuario, 
    enviarMoedas,
    criarVantagem,
    listarVantagens,
    resgatarVantagem,
    atualizarVantagem,
    excluirVantagem,
    listarResgates,
} from './crud.js';

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
        await carregarVantagens();
        await carregarResgates();
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

// Formulário de cadastro de vantagem (Empresa)
const vantagemForm = document.getElementById('vantagemForm');
if (vantagemForm) {
    vantagemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(vantagemForm);
        const vantagemData = {};
        
        for (const [key, value] of formData.entries()) {
            vantagemData[key] = value;
        }

        try {
            const empresaId = auth.currentUser.uid;
            await criarVantagem(empresaId, vantagemData);
            alert('Vantagem cadastrada com sucesso!');
            vantagemForm.reset();
            await carregarVantagens();
        } catch (error) {
            alert('Erro ao cadastrar vantagem: ' + error.message);
        }
    });
}

async function carregarVantagens() {
    const listaVantagens = document.getElementById('listaVantagens');
    if (listaVantagens) {
        try {
            const vantagens = await listarVantagens();
            const userType = localStorage.getItem('userType');
            const userId = auth.currentUser.uid;

            listaVantagens.innerHTML = vantagens.map(vantagem => `
                <div class="vantagem-card" id="vantagem-${vantagem.id}">
                    <img src="${vantagem.imagem}" alt="${vantagem.nome}">
                    <h4>${vantagem.nome}</h4>
                    <p>${vantagem.descricao}</p>
                    <p>Custo: ${vantagem.custo} moedas</p>
                    ${userType === 'aluno' ? 
                        `<button onclick="resgatarVantagem('${vantagem.id}')">Resgatar</button>` :
                        userType === 'empresa' && vantagem.empresaId === userId ?
                        `<div class="vantagem-acoes">
                            <button onclick="editarVantagem('${vantagem.id}')">Editar</button>
                            <button onclick="excluirVantagem('${vantagem.id}')" class="btn-deletar">Excluir</button>
                         </div>` : 
                        ''}
                </div>
            `).join('');
        } catch (error) {
            console.error('Erro ao carregar vantagens:', error);
        }
    }
}

window.resgatarVantagem = async (vantagemId) => {
    try {
        const userId = auth.currentUser.uid;
        await resgatarVantagem(userId, vantagemId);
        
        // Get updated user data and update the balance display
        const userData = await buscarUsuario('aluno', userId);
        const saldoAtual = document.getElementById('saldoAtual');
        if (saldoAtual) {
            saldoAtual.textContent = userData.saldoMoedas;
        }
        
        alert('Vantagem resgatada com sucesso!');
        await carregarVantagens();
        await carregarResgates();
    } catch (error) {
        alert('Erro ao resgatar vantagem: ' + error.message);
    }
};

// Adicionar funções globais para editar e excluir vantagens
window.editarVantagem = async (vantagemId) => {
    const vantagemCard = document.getElementById(`vantagem-${vantagemId}`);
    const vantagens = await listarVantagens();
    const vantagem = vantagens.find(v => v.id === vantagemId);

    if (vantagem) {
        vantagemCard.innerHTML = `
            <form id="editarVantagemForm-${vantagemId}" class="editar-vantagem-form">
                <input type="text" name="nome" value="${vantagem.nome}" required>
                <textarea name="descricao" required>${vantagem.descricao}</textarea>
                <input type="number" name="custo" value="${vantagem.custo}" min="1" required>
                <input type="url" name="imagem" value="${vantagem.imagem}" required>
                <div class="form-actions">
                    <button type="submit">Salvar</button>
                    <button type="button" onclick="carregarVantagens()">Cancelar</button>
                </div>
            </form>
        `;

        const form = document.getElementById(`editarVantagemForm-${vantagemId}`);
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const dadosAtualizados = Object.fromEntries(formData.entries());

            try {
                await atualizarVantagem(vantagemId, dadosAtualizados);
                alert('Vantagem atualizada com sucesso!');
                await carregarVantagens();
            } catch (error) {
                alert('Erro ao atualizar vantagem: ' + error.message);
            }
        });
    }
};

window.excluirVantagem = async (vantagemId) => {
    if (confirm('Tem certeza que deseja excluir esta vantagem?')) {
        try {
            await excluirVantagem(vantagemId);
            alert('Vantagem excluída com sucesso!');
            await carregarVantagens();
        } catch (error) {
            alert('Erro ao excluir vantagem: ' + error.message);
        }
    }
};

async function carregarResgates() {
    const listaResgates = document.getElementById('listaResgates');
    if (listaResgates) {
        try {
            const userType = localStorage.getItem('userType');
            const userId = auth.currentUser.uid;
            const resgates = await listarResgates(userId, userType);

            listaResgates.innerHTML = resgates.map(resgate => {
                const data = resgate.dataResgate.toLocaleDateString();
                
                if (userType === 'empresa') {
                    return `
                        <li class="resgate-item">
                            <p>${resgate.aluno.nome} resgatou "${resgate.vantagem.nome}" 
                            por ${resgate.custoResgate} moedas em ${data}</p>
                        </li>
                    `;
                } else {
                    return `
                        <li class="resgate-item">
                            <p>Você resgatou "${resgate.vantagem.nome}" 
                            por ${resgate.custoResgate} moedas em ${data}</p>
                        </li>
                    `;
                }
            }).join('');

            if (resgates.length === 0) {
                listaResgates.innerHTML = '<li class="resgate-item"><p>Nenhum resgate encontrado.</p></li>';
            }
        } catch (error) {
            console.error('Erro ao carregar resgates:', error);
        }
    }
}