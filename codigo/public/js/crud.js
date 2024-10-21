import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";

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
const db = getFirestore(app);

export async function buscarUsuario(colecao, id) {
    try {
        const docRef = doc(db, colecao, id);
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

export async function atualizarUsuario(colecao, id, dados) {
    try {
        const docRef = doc(db, colecao, id);
        const updatedData = { ...dados };
        if (updatedData.empresa) {
            updatedData.empresa = updatedData.empresa || null;
        }
        await updateDoc(docRef, updatedData);
        return true;
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
    }
}

export async function excluirUsuario(colecao, id) {
    try {
        const docRef = doc(db, colecao, id);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        throw error;
    }
}