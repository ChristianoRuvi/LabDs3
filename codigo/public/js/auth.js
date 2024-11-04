import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB6t3M3pB1K7_v1BpgGWzcb0mcK96pAn8g",
    authDomain: "moeda-estudantil-final.firebaseapp.com",
    projectId: "moeda-estudantil-final",
    storageBucket: "moeda-estudantil-final.appspot.com",
    messagingSenderId: "804226385463",
    appId: "1:804226385463:web:2b66eefe4e40671f2a21b2",
    measurementId: "G-TT11ZLG44F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const COLLECTIONS = {
    aluno: 'alunos',
    professor: 'professores',
    empresa: 'empresas'
};

// Carregar instituições
async function carregarInstituicoes() {
    const instituicoesSelect = document.getElementById('instituicao');
    if (instituicoesSelect) {
        try {
            const response = await fetch('/data/instituicoes.json');
            const data = await response.json();
            instituicoesSelect.innerHTML = '<option value="">Selecione uma instituição</option>';
            data.instituicoes.forEach((instituicao) => {
                instituicoesSelect.innerHTML += `<option value="${instituicao}">${instituicao}</option>`;
            });
        } catch (error) {
            console.error("Erro ao carregar instituições:", error);
        }
    }
}

document.addEventListener('DOMContentLoaded', carregarInstituicoes);

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm['email'].value;
        const password = loginForm['password'].value;
        const userType = loginForm['userType'].value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userDoc = await getDoc(doc(db, COLLECTIONS[userType], user.uid));

            if (userDoc.exists()) {
                localStorage.setItem('userType', userType);
                localStorage.setItem('userId', user.uid);
                window.location.href = `dashboard-${userType}.html`;
            } else {
                let foundType = null;
                for (const [type, collection] of Object.entries(COLLECTIONS)) {
                    const docRef = await getDoc(doc(db, collection, user.uid));
                    if (docRef.exists()) {
                        foundType = type;
                        break;
                    }
                }

                if (foundType) {
                    await signOut(auth);
                    alert(`Tipo de usuário incorreto. Este usuário é do tipo "${foundType}".`);
                } else {
                    await signOut(auth);
                    alert('Usuário não encontrado em nenhuma coleção.');
                }
            }
        } catch (error) {
            console.error('Erro no login:', error);
            if (error.code === 'auth/user-not-found') {
                alert('Usuário não encontrado');
            } else if (error.code === 'auth/wrong-password') {
                alert('Senha incorreta');
            } else {
                alert('Erro no login: ' + error.message);
            }
        }
    });
}

// Cadastro de Aluno
const cadastroAlunoForm = document.getElementById('cadastroAlunoForm');
if (cadastroAlunoForm) {
    cadastroAlunoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(cadastroAlunoForm);
        const alunoData = {};

        for (const [key, value] of formData.entries()) {
            if (!value) {
                alert(`Por favor, preencha o campo ${key}`);
                return;
            }
            alunoData[key] = value;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, alunoData.email, alunoData.password);
            delete alunoData.password;
            await setDoc(doc(db, COLLECTIONS.aluno, userCredential.user.uid), {
                ...alunoData,
                saldoMoedas: 0,
                dataCadastro: new Date()
            });
            localStorage.setItem('userType', 'aluno');
            window.location.href = 'dashboard-aluno.html';
        } catch (error) {
            console.error("Erro no cadastro:", error);
            alert("Erro no cadastro: " + error.message);
        }
    });
}

// Cadastro de Empresa
const cadastroEmpresaForm = document.getElementById('cadastroEmpresaForm');
if (cadastroEmpresaForm) {
    cadastroEmpresaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(cadastroEmpresaForm);
        const empresaData = {};

        for (const [key, value] of formData.entries()) {
            if (!value) {
                alert(`Por favor, preencha o campo ${key}`);
                return;
            }
            empresaData[key] = value;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, empresaData.email, empresaData.password);
            delete empresaData.password;
            await setDoc(doc(db, COLLECTIONS.empresa, userCredential.user.uid), {
                ...empresaData,
                dataCadastro: new Date()
            });
            localStorage.setItem('userType', 'empresa');
            window.location.href = 'dashboard-empresa.html';
        } catch (error) {
            console.error("Erro no cadastro:", error);
            alert("Erro no cadastro: " + error.message);
        }
    });
}

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('userType');
            localStorage.removeItem('userId');
            window.location.href = 'login.html';
        } catch (error) {
            alert('Erro ao fazer logout: ' + error.message);
        }
    });
}

// Carregar alunos para o select
async function carregarAlunos() {
    const alunoSelect = document.getElementById('alunoSelect');
    if (alunoSelect) {
        try {
            const querySnapshot = await getDocs(collection(db, COLLECTIONS.aluno));
            alunoSelect.innerHTML = '<option value="">Selecione um aluno</option>';
            querySnapshot.forEach((doc) => {
                const aluno = doc.data();
                alunoSelect.innerHTML += `<option value="${doc.id}">${aluno.nome}</option>`;
            });
        } catch (error) {
            console.error("Erro ao carregar alunos:", error);
        }
    }
}

// Carregar extrato
async function carregarExtrato(userId) {
    const listaTransacoes = document.getElementById('listaTransacoes');
    if (listaTransacoes) {
        try {
            const userType = localStorage.getItem('userType');
            const userDoc = await getDoc(doc(db, COLLECTIONS[userType], userId));
            const transacoes = userDoc.data().transacoes || [];

            listaTransacoes.innerHTML = transacoes.map(transacao => {
                if (userType === 'professor') {
                    return `
                        <li>
                            <p>Enviado para: ${transacao.destinatario}</p>
                            <p>Quantidade: ${transacao.quantidade} moedas</p>
                            <p>Motivo: ${transacao.motivo}</p>
                            <p>Data: ${transacao.data.toDate().toLocaleDateString()}</p>
                        </li>
                    `;
                } else if (userType === 'aluno') {
                    return `
                        <li>
                            <p>Recebido de: ${transacao.remetente}</p>
                            <p>Quantidade: ${transacao.quantidade} moedas</p>
                            <p>Motivo: ${transacao.motivo}</p>
                            <p>Data: ${transacao.data.toDate().toLocaleDateString()}</p>
                        </li>
                    `;
                }
            }).join('');
        } catch (error) {
            console.error("Erro ao carregar extrato:", error);
        }
    }
}

// Verificar autenticação
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const userType = localStorage.getItem('userType');
        if (userType) {
            const userDoc = await getDoc(doc(db, COLLECTIONS[userType], user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();

                if (window.location.pathname.includes('dashboard')) {
                    if (userType === 'professor') {
                        document.getElementById('nomeProfessor').textContent = userData.nome;
                        document.getElementById('saldoAtual').textContent = userData.saldoMoedas;
                        await carregarAlunos();
                        await carregarExtrato(user.uid);
                    } else if (userType === 'aluno') {
                        document.getElementById('nomeAluno').textContent = userData.nome;
                        document.getElementById('saldoAtual').textContent = userData.saldoMoedas;
                        await carregarExtrato(user.uid);
                    } else if (userType === 'empresa') {
                        document.getElementById('nomeEmpresa').textContent = userData.nome;
                    }
                }
            }
        }
    } else {
        if (!window.location.pathname.includes('login.html') &&
            !window.location.pathname.includes('cadastro') &&
            !window.location.pathname.includes('index.html')) {
            window.location.href = 'login.html';
        }
    }
});

export { auth, db, carregarAlunos, carregarExtrato };