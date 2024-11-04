class ProfessorView {
    static renderizarPerfil(professor) {
        return `
            <h2>${professor.nome}</h2>
            <p>Email: ${professor.email}</p>
            <p>CPF: ${professor.cpf}</p>
            <p>Departamento: ${professor.departamento}</p>
            <p>Instituição: ${professor.instituicao}</p>
            <p>Saldo de Moedas: ${professor.saldoMoedas}</p>
        `;
    }

    static renderizarExtrato(transacoes) {
        return transacoes.map(transacao => `
            <li>
                <p>Enviado para: ${transacao.destinatario}</p>
                <p>Quantidade: ${transacao.quantidade} moedas</p>
                <p>Motivo: ${transacao.motivo}</p>
                <p>Data: ${new Date(transacao.data).toLocaleDateString()}</p>
            </li>
        `).join('');
    }

    static renderizarListaAlunos(alunos) {
        return alunos.map(aluno => `
            <option value="${aluno.id}">${aluno.nome} - ${aluno.curso}</option>
        `).join('');
    }
}

export default ProfessorView;