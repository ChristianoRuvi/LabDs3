import { db } from '../config/firebase.js';
import { collection, addDoc, getDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";

class AlunoModel {
    static async criar(dados) {
        try {
            const { nome, email, cpf, rg, endereco, empresa, curso } = dados;
            const alunoData = {
                nome,
                email,
                cpf,
                rg,
                endereco,
                empresa,
                curso,
                saldoMoedas: 0,
                dataCadastro: new Date()
            };
            const docRef = await addDoc(collection(db, "alunos"), alunoData);
            return docRef.id;
        } catch (error) {
            throw new Error('Erro ao criar aluno: ' + error.message);
        }
    }

    static async buscarPorId(id) {
        try {
            const docRef = doc(db, "alunos", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                throw new Error('Aluno não encontrado');
            }
        } catch (error) {
            throw new Error('Erro ao buscar aluno: ' + error.message);
        }
    }

    static async atualizar(id, dados) {
        try {
            const docRef = doc(db, "alunos", id);
            await updateDoc(docRef, dados);
            return true;
        } catch (error) {
            throw new Error('Erro ao atualizar aluno: ' + error.message);
        }
    }

    static async excluir(id) {
        try {
            const docRef = doc(db, "alunos", id);
            await deleteDoc(docRef);
            return true;
        } catch (error) {
            throw new Error('Erro ao excluir aluno: ' + error.message);
        }
    }

    static async listarEmpresas() {
        try {
            const querySnapshot = await getDocs(collection(db, "empresas"));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw new Error('Erro ao listar empresas: ' + error.message);
        }
    }
}

export default AlunoModel;
