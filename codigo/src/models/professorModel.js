import { db } from '../config/firebase.js';
import { collection, getDoc, updateDoc, doc, getDocs } from "firebase/firestore";

class ProfessorModel {
    static async buscarPorId(id) {
        try {
            const docRef = doc(db, "professores", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                throw new Error('Professor não encontrado');
            }
        } catch (error) {
            throw new Error('Erro ao buscar professor: ' + error.message);
        }
    }

    static async atualizar(id, dados) {
        try {
            const docRef = doc(db, "professores", id);
            await updateDoc(docRef, dados);
            return true;
        } catch (error) {
            throw new Error('Erro ao atualizar professor: ' + error.message);
        }
    }

    static async listarAlunos() {
        try {
            const querySnapshot = await getDocs(collection(db, "alunos"));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw new Error('Erro ao listar alunos: ' + error.message);
        }
    }

    static async enviarMoedas(professorId, alunoId, quantidade, motivo) {
        try {
            const professorRef = doc(db, "professores", professorId);
            const alunoRef = doc(db, "alunos", alunoId);
            
            const professorDoc = await getDoc(professorRef);
            const alunoDoc = await getDoc(alunoRef);
            
            if (!professorDoc.exists() || !alunoDoc.exists()) {
                throw new Error('Professor ou aluno não encontrado');
            }

            const saldoProfessor = professorDoc.data().saldoMoedas;
            if (saldoProfessor < quantidade) {
                throw new Error('Saldo insuficiente');
            }

            // Atualiza saldo do professor
            await updateDoc(professorRef, {
                saldoMoedas: saldoProfessor - quantidade
            });

            // Atualiza saldo do aluno
            await updateDoc(alunoRef, {
                saldoMoedas: (alunoDoc.data().saldoMoedas || 0) + quantidade
            });

            // Registra a transação
            const transacao = {
                tipo: 'envio',
                remetente: professorDoc.data().nome,
                destinatario: alunoDoc.data().nome,
                quantidade,
                motivo,
                data: new Date()
            };

            // Adiciona a transação ao histórico
            await Promise.all([
                updateDoc(professorRef, {
                    transacoes: [...(professorDoc.data().transacoes || []), transacao]
                }),
                updateDoc(alunoRef, {
                    transacoes: [...(alunoDoc.data().transacoes || []), transacao]
                })
            ]);

            return true;
        } catch (error) {
            throw new Error('Erro ao enviar moedas: ' + error.message);
        }
    }
}

export default ProfessorModel;