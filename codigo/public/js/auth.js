import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCFM7oN1gFntvJEFF0vl4YUcMA4gyAYaic",
    authDomain: "moeda-estudantil.firebaseapp.com",
    projectId: "moeda-estudantil",
    storageBucket: "moeda-estudantil.appspot.com",
    messagingSenderId: "282521658357",
    appId: "1:282521658357:web:f510ed58e6fb5ee8acb6bc",
    measurementId: "G-KH1TR5Z1N5"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Carregar empresas para o formulário de cadastro de aluno
async function carregarEmpresas() {
    const empresasSelect = document.getElementById('empresa');
    if (empresasSelect) {
        const empresasSnapshot = await getDocs(collection(db, "empresas"));
        empresasSelect.innerHTML = '<option value="">Selecione uma empresa</option>';
        empresasSnapshot.forEach((doc) => {
            const empresa = doc.data();
            empresasSelect.innerHTML += `<option value="${doc.id}">${empresa.nome}</option>`;
        });
    }
}
// Call this function when the page loads
document.addEventListener('DOMContentLoaded', carregarEmpresas);

// Cadastro de Aluno
const cadastroAlunoForm = document.getElementById('cadastroAlunoForm');
if (cadastroAlunoForm) {
    carregarEmpresas();
    cadastroAlunoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(cadastroAlunoForm);
        const alunoData = {};

        for (const [key, value] of formData.entries()) {
            if (!value) {
                console.error(`Campo ${key} está vazio`);
                alert(`Por favor, preencha o campo ${key}`);
                return;
            }
            alunoData[key] = value;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, alunoData.email, alunoData.password);
            delete alunoData.password;
            await setDoc(doc(db, "alunos", userCredential.user.uid), {
                ...alunoData,
                saldoMoedas: 0,
                dataCadastro: new Date()
            });
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
        const nome = cadastroEmpresaForm['nome'].value;
        const email = cadastroEmpresaForm['email'].value;
        const password = cadastroEmpresaForm['password'].value;
        const cnpj = cadastroEmpresaForm['cnpj'].value;
        const endereco = cadastroEmpresaForm['endereco'].value;
        const descricao = cadastroEmpresaForm['descricao'].value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "empresas", userCredential.user.uid), {
                nome, email, cnpj, endereco, descricao, dataCadastro: new Date()
            });
            window.location.href = 'dashboard-empresa.html';
        } catch (error) {
            console.error("Erro no cadastro:", error);
            alert("Erro no cadastro: " + error.message);
        }
    });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm['email'].value;
        const password = loginForm['password'].value;
        const userType = loginForm['userType'].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = userType === 'aluno' ? 'dashboard-aluno.html' : 'dashboard-empresa.html';
        } catch (error) {
            console.error("Erro no login:", error);
            alert("Erro no login: " + error.message);
        }
    });
}

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            window.location.href = 'login.html';
        } catch (error) {
            console.error("Erro no logout:", error);
            alert("Erro no logout: " + error.message);
        }
    });
}

export { auth, db };