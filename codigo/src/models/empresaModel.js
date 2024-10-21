import { db } from '../config/firebase.js';
import { collection, addDoc, getDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

class EmpresaModel {
  static async criar(dados) {
    try {
      const docRef = await addDoc(collection(db, "empresas"), dados);
      return docRef.id;
    } catch (error) {
      throw new Error('Erro ao criar empresa: ' + error.message);
    }
  }

  static async buscarPorId(id) {
    try {
      const docRef = doc(db, "empresas", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Empresa não encontrada');
      }
    } catch (error) {
      throw new Error('Erro ao buscar empresa: ' + error.message);
    }
  }

  static async atualizar(id, dados) {
    try {
      const docRef = doc(db, "empresas", id);
      await updateDoc(docRef, dados);
      return true;
    } catch (error) {
      throw new Error('Erro ao atualizar empresa: ' + error.message);
    }
  }

  static async excluir(id) {
    try {
      const docRef = doc(db, "empresas", id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      throw new Error('Erro ao excluir empresa: ' + error.message);
    }
  }
}

export default EmpresaModel;