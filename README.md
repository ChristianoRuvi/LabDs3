# Sistema de Mérito
O Sistema de Mérito é uma aplicação web que conecta alunos, professores e empresas para reconhecer e recompensar o desempenho acadêmico

## Integrantes
- Davi Andrade
- Alexandre Breedveld
- Breno de Oliveira
- Christiano Ruvieri

## Orientadores
- Cristiano de Macêdo Neto

Antes de começar, certifique-se de ter atendido aos seguintes requisitos:

- Node.js (v14 ou superior)
- npm (geralmente vem com o Node.js)
- Uma conta e projeto Firebase configurados

## Instalação

1. Clone o repositório:
   ```
   git clone
   cd sistema-de-merito
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure o Firebase:
   - Crie um novo projeto Firebase no Console do Firebase
   - Ative a Autenticação e o Firestore no seu projeto Firebase
   - Copie o objeto de configuração do Firebase
   - Substitua o objeto `firebaseConfig` com sua configuração

## Estrutura do Projeto

O projeto está estruturado da seguinte forma:

- `public/`: Contém todos os arquivos frontend (HTML, CSS, JavaScript do lado do cliente)
- `src/`: Contém os arquivos backend (servidor Node.js/Express, controladores, modelos)
- `package.json`: Define as dependências e scripts do projeto

## Executando a Aplicação

Para executar a aplicação, siga estes passos:

1. Inicie o servidor:
   ```
   npm start
   ```

2. Abra seu navegador web e acesse `http://localhost:3000`

# Histórias de Usuário - Sistema de Moeda Estudantil

### Aluno

1. *Como aluno, desejo me cadastrar no sistema para poder participar do programa de méritos estudantil e acumular moedas.*
2. *Como aluno, desejo receber notificações por email sempre que ganhar moedas, para acompanhar meu progresso.*
3. *Como aluno, desejo consultar meu extrato de moedas para monitorar meu saldo e as transações realizadas.*
4. *Como aluno, desejo trocar minhas moedas por benefícios oferecidos pelos parceiros do programa.*
5. *Como aluno, desejo receber um email contendo o cupom digital após resgatar um benefício, para facilitar o uso.*

### Professor

6. *Como professor, desejo distribuir moedas aos meus alunos para recompensar o bom desempenho acadêmico e incentivar a participação.*
7. *Como professor, desejo consultar meu saldo de moedas disponíveis para saber quantas posso distribuir aos alunos.*
8. *Como professor, desejo visualizar o histórico de distribuição de moedas para acompanhar as recompensas concedidas.*

### Empresa Parceira

9. *Como empresa parceira, desejo me cadastrar no sistema para oferecer benefícios e promoções exclusivas aos alunos participantes.*
10. *Como empresa parceira, desejo cadastrar novos benefícios no sistema, incluindo a descrição e uma imagem do produto ou serviço oferecido.*
11. *Como empresa parceira, desejo receber uma confirmação por email sempre que um aluno resgatar um benefício, para facilitar o controle das trocas.*

### Geral

12. *Como usuário (aluno, professor ou empresa), desejo fazer login no sistema para acessar as funcionalidades específicas do meu perfil.*
13. *Como administrador, desejo cadastrar novas instituições de ensino no sistema para expandir o programa.*
14. *Como administrador, desejo pré-cadastrar professores no sistema para agilizar o processo de adesão ao programa.*
15. *Como sistema, desejo adicionar automaticamente 1000 moedas ao saldo dos professores no início de cada semestre, para garantir que eles possam distribuir recompensas aos alunos.*
