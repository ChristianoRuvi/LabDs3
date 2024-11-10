import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
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
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";


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
const db = getFirestore(app);

const COLLECTIONS = {
    aluno: 'alunos',
    professor: 'professores',
    empresa: 'empresas'
};

export async function buscarUsuario(userType, id) {
    try {
        const docRef = doc(db, COLLECTIONS[userType], id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error('Usuário não encontrado');
        }
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw error;
    }
}

export async function atualizarUsuario(userType, id, dados) {
    try {
        const docRef = doc(db, COLLECTIONS[userType], id);
        await updateDoc(docRef, dados);
        return true;
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
    }
}

export async function excluirUsuario(userType, id) {
    try {
        const docRef = doc(db, COLLECTIONS[userType], id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        throw error;
    }
}

export async function enviarMoedas(professorId, alunoId, quantidade, motivo) {
    try {
        // Buscar dados do professor
        const professorDoc = await getDoc(doc(db, COLLECTIONS.professor, professorId));
        const professorData = professorDoc.data();
        
        // Verificar saldo do professor
        if (professorData.saldoMoedas < quantidade) {
            throw new Error('Saldo insuficiente');
        }

        // Buscar dados do aluno
        const alunoDoc = await getDoc(doc(db, COLLECTIONS.aluno, alunoId));
        const alunoData = alunoDoc.data();

        // Atualizar saldo do professor
        await updateDoc(doc(db, COLLECTIONS.professor, professorId), {
            saldoMoedas: professorData.saldoMoedas - quantidade,
            transacoes: [...(professorData.transacoes || []), {
                destinatario: alunoData.nome,
                quantidade,
                motivo,
                data: new Date()
            }]
        });

        // Atualizar saldo do aluno
        await updateDoc(doc(db, COLLECTIONS.aluno, alunoId), {
            saldoMoedas: (alunoData.saldoMoedas || 0) + quantidade,
            transacoes: [...(alunoData.transacoes || []), {
                remetente: professorData.nome,
                quantidade,
                motivo,
                data: new Date()
            }]
        });

        return true;
    } catch (error) {
        console.error('Erro ao enviar moedas:', error);
        throw error;
    }
}

export async function listarAlunos() {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTIONS.aluno));
        const alunos = [];
        querySnapshot.forEach((doc) => {
            alunos.push({ id: doc.id, ...doc.data() });
        });
        return alunos;
    } catch (error) {
        console.error('Erro ao listar alunos:', error);
        throw error;
    }
}

export async function listarEmpresas() {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTIONS.empresa));
        const empresas = [];
        querySnapshot.forEach((doc) => {
            empresas.push({ id: doc.id, ...doc.data() });
        });
        return empresas;
    } catch (error) {
        console.error('Erro ao listar empresas:', error);
        throw error;
    }
}

export async function criarVantagem(empresaId, dadosVantagem) {
    try {
        const vantagemRef = await addDoc(collection(db, 'vantagens'), {
            empresaId,
            nome: dadosVantagem.nome,
            descricao: dadosVantagem.descricao,
            custo: parseInt(dadosVantagem.custo),
            imagem: dadosVantagem.imagem,
            dataCriacao: new Date()
        });
        return vantagemRef.id;
    } catch (error) {
        console.error('Erro ao criar vantagem:', error);
        throw error;
    }
}

export async function listarVantagens() {
    try {
        const querySnapshot = await getDocs(collection(db, 'vantagens'));
        const vantagens = [];
        querySnapshot.forEach((doc) => {
            vantagens.push({ id: doc.id, ...doc.data() });
        });
        return vantagens;
    } catch (error) {
        console.error('Erro ao listar vantagens:', error);
        throw error;
    }
}

export async function resgatarVantagem(alunoId, vantagemId) {
    try {
        const vantagemRef = doc(db, 'vantagens', vantagemId);
        const alunoRef = doc(db, 'alunos', alunoId);
        
        const vantagemDoc = await getDoc(vantagemRef);
        const alunoDoc = await getDoc(alunoRef);
        
        if (!vantagemDoc.exists() || !alunoDoc.exists()) {
            throw new Error('Vantagem ou aluno não encontrado');
        }

        const custoVantagem = vantagemDoc.data().custo;
        const saldoAluno = alunoDoc.data().saldoMoedas || 0;

        if (saldoAluno < custoVantagem) {
            throw new Error('Saldo insuficiente');
        }

        // Atualiza saldo do aluno
        await updateDoc(alunoRef, {
            saldoMoedas: saldoAluno - custoVantagem
        });

        // Registra o resgate
        await addDoc(collection(db, 'resgates'), {
            alunoId,
            vantagemId,
            dataResgate: new Date(),
            custoResgate: custoVantagem
        });

        return true;
    } catch (error) {
        console.error('Erro ao resgatar vantagem:', error);
        throw error;
    }
}

export async function excluirVantagem(vantagemId) {
    try {
        const vantagemRef = doc(db, 'vantagens', vantagemId);
        await deleteDoc(vantagemRef);
        return true;
    } catch (error) {
        console.error('Erro ao excluir vantagem:', error);
        throw error;
    }
}

export async function atualizarVantagem(vantagemId, dadosVantagem) {
    try {
        const vantagemRef = doc(db, 'vantagens', vantagemId);
        await updateDoc(vantagemRef, {
            nome: dadosVantagem.nome,
            descricao: dadosVantagem.descricao,
            custo: parseInt(dadosVantagem.custo),
            imagem: dadosVantagem.imagem
        });
        return true;
    } catch (error) {
        console.error('Erro ao atualizar vantagem:', error);
        throw error;
    }
}

export async function listarResgates(userId, userType) {
    try {
        const resgatesRef = collection(db, 'resgates');
        let querySnapshot;
        
        if (userType === 'aluno') {
            const q = query(resgatesRef, where('alunoId', '==', userId));
            querySnapshot = await getDocs(q);
        } else if (userType === 'empresa') {
            const vantagensSnapshot = await getDocs(
                query(collection(db, 'vantagens'), where('empresaId', '==', userId))
            );
            const vantagensIds = vantagensSnapshot.docs.map(doc => doc.id);
            
            if (vantagensIds.length > 0) {
                const q = query(resgatesRef, where('vantagemId', 'in', vantagensIds));
                querySnapshot = await getDocs(q);
            } else {
                return [];
            }
        }

        const resgates = [];
        for (const docSnapshot of querySnapshot.docs) {
            const resgate = docSnapshot.data();
            const vantagemRef = doc(db, 'vantagens', resgate.vantagemId);
            const vantagemDoc = await getDoc(vantagemRef);
            const vantagemData = vantagemDoc.data();
            
            let alunoData;
            if (userType === 'empresa') {
                const alunoRef = doc(db, 'alunos', resgate.alunoId);
                const alunoDoc = await getDoc(alunoRef);
                alunoData = alunoDoc.data();
            }

            resgates.push({
                id: docSnapshot.id,
                ...resgate,
                vantagem: vantagemData,
                aluno: alunoData,
                dataResgate: resgate.dataResgate.toDate()
            });
        }

        return resgates;
    } catch (error) {
        console.error('Erro ao listar resgates:', error);
        throw error;
    }
}

export { db };