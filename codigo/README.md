# Sistema de Mérito

O Sistema de Mérito é uma aplicação web que conecta alunos, professores e empresas para reconhecer e recompensar o desempenho acadêmico

## Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação](#instalação)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Executando a Aplicação](#executando-a-aplicação)
5. [Funcionalidades](#funcionalidades)
6. [Contribuindo](#contribuindo)
7. [Licença](#licença)

## Pré-requisitos

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
   - Substitua o objeto `firebaseConfig` com sua configuração:

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

## Funcionalidades

### Para Alunos

- Criar e gerenciar um perfil de aluno
- Visualizar e atualizar informações pessoais
- Verificar o saldo de moedas de mérito
- Visualizar histórico de transações
- Navegar e resgatar recompensas oferecidas por empresas parceiras

### Para Empresas

- Criar e gerenciar um perfil de empresa
- Oferecer recompensas aos alunos
- Visualizar histórico de resgates

### Funcionalidades Gerais

- Autenticação de usuários (login/logout)
- Design responsivo para vários tamanhos de tela
