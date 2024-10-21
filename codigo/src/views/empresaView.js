class EmpresaView {
    static renderizarPerfil(empresa) {
      return `
        <h2>${empresa.nome}</h2>
        <p>Email: ${empresa.email}</p>
        <p>CNPJ: ${empresa.cnpj}</p>
        <p>Endereço: ${empresa.endereco}</p>
        <p>Descrição: ${empresa.descricao}</p>
      `;
    }
  
    static renderizarListaVantagens(vantagens) {
      return vantagens.map(vantagem => `
        <li>
          <h3>${vantagem.nome}</h3>
          <p>${vantagem.descricao}</p>
          <p>Custo: ${vantagem.custo} moedas</p>
        </li>
      `).join('');
    }
  }
  
  export default EmpresaView;