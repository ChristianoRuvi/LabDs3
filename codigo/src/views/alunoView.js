class AlunoView {
    static renderizarPerfil(aluno) {
      return `
        <h2>${aluno.nome}</h2>
        <p>Email: ${aluno.email}</p>
        <p>CPF: ${aluno.cpf}</p>
        <p>RG: ${aluno.rg}</p>
        <p>Endereço: ${aluno.endereco}</p>
        <p>Empresa: ${aluno.empresa}</p>
        <p>Curso: ${aluno.curso}</p>
      `;
    }
  
    static renderizarExtrato(transacoes) {
      return transacoes.map(transacao => `
        <li>
          <p>${transacao.tipo}: ${transacao.valor} moedas</p>
          <p>Data: ${new Date(transacao.data).toLocaleDateString()}</p>
          <p>Motivo: ${transacao.motivo}</p>
        </li>
      `).join('');
    }
  }
  
  export default AlunoView;