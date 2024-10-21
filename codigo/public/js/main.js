import { auth, db } from './auth.js';
import { buscarUsuario, atualizarUsuario, excluirUsuario } from './crud.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Verificar autenticação
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const userType = window.location.pathname.includes('aluno') ? 'alunos' : 'empresas';
        try {
            const userData = await buscarUsuario(userType, user.uid);
            console.log('Fetched user data:', userData);  
            preencherPerfil(userData);
            if (userType === 'alunos') {
                atualizarDashboardAluno(userData);
            } else {
                atualizarDashboardEmpresa(userData);
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
            alert('Erro ao carregar dados do usuário. Por favor, tente novamente mais tarde.');
        }
    } else {
        window.location.href = 'index.html';
    }
});

async function preencherPerfil(userData) {
    const form = document.getElementById('perfilForm');
    if (form) {
        for (const [key, value] of Object.entries(userData)) {
            const input = form.elements[key];
            if (input && key !== 'email' && key !== 'password') {
                if (input.tagName === 'SELECT') {
                    await populateSelect(input, key, value);
                } else {
                    input.value = value;
                }
            }
        }

        // Remove email field if it exists
        const emailField = form.elements['email'];
        if (emailField) {
            emailField.parentNode.remove();
        }
    }
}

async function populateSelect(selectElement, key, value) {
    if (key === 'empresa') {
        const empresas = await listarEmpresas();
        selectElement.innerHTML = '<option value="">Selecione uma empresa</option>';
        empresas.forEach(empresa => {
            const option = document.createElement('option');
            option.value = empresa.id;
            option.textContent = empresa.nome;
            option.selected = empresa.id === value;
            selectElement.appendChild(option);
        });
    }
}

async function listarEmpresas() {
    try {
        const snapshot = await getDocs(collection(db, 'empresas'));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Erro ao listar empresas:', error);
        return [];
    }
}

// Atualizar perfil
perfilForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
        const userType = window.location.pathname.includes('aluno') ? 'alunos' : 'empresas';
        const formData = new FormData(perfilForm);
        const dados = Object.fromEntries(formData.entries());
        
        console.log('Dados a serem atualizados:', dados); 
        
        try {
            await atualizarUsuario(userType, user.uid, dados);
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            alert('Erro ao atualizar perfil. Por favor, tente novamente.');
        }
    }
});

// Excluir conta
const excluirContaBtn = document.getElementById('excluirConta');
if (excluirContaBtn) {
    excluirContaBtn.addEventListener('click', async () => {
        if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
            const user = auth.currentUser;
            if (user) {
                const userType = window.location.pathname.includes('aluno') ? 'alunos' : 'empresas';
                try {
                    await excluirUsuario(userType, user.uid);
                    await user.delete();
                    alert('Conta excluída com sucesso.');
                    window.location.href = 'login.html';
                } catch (error) {
                    console.error('Erro ao excluir conta:', error);
                    alert('Erro ao excluir conta. Por favor, tente novamente.');
                }
            }
        }
    });
}

// Atualizar dashboard do aluno
function atualizarDashboardAluno(userData) {
    const nomeAluno = document.getElementById('nomeAluno');
    const saldoAtual = document.getElementById('saldoAtual');
    const listaTransacoes = document.getElementById('listaTransacoes');
    const listaVantagens = document.getElementById('listaVantagens');

    if (nomeAluno) nomeAluno.textContent = userData.nome;
    if (saldoAtual) saldoAtual.textContent = userData.saldoMoedas;

}

// Atualizar dashboard da empresa
function atualizarDashboardEmpresa(userData) {
    const nomeEmpresa = document.getElementById('nomeEmpresa');
    const listaVantagens = document.getElementById('listaVantagens');

    if (nomeEmpresa) nomeEmpresa.textContent = userData.nome;

}