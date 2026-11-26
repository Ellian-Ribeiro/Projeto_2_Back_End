# Projeto 2 — E-commerce Web (Express.js, MVC, MongoDB e Sessões)

## Temática
**E-commerce** (evolução direta do Projeto 1 da disciplina EC48B — Programação Web Back-End).

## Integrante
- Ellian Maciel Moreira Ribeiro

## Descrição da Aplicação
Aplicação Web Back-End construída com **Node.js**, **Express.js**, **EJS** (templates) e **MongoDB Driver**, organizada sob o padrão **MVC (Model-View-Controller)**. A aplicação disponibiliza gerenciamento completo (CRUD) de **Categorias**, **Vendedores** e **Produtos**, além de cadastro de usuários, autenticação com senhas protegidas por hash (`crypto.scrypt`) e controle de acesso baseado em sessões (`express-session`).

## Entidades Utilizadas (Coleções MongoDB)
1. **Categoria** (`categorias`): `nome`, `descricao`
2. **Vendedor** (`vendedores`): `nome`, `email`, `documento`
3. **Produto** (`produtos`): `nome`, `preco`, `categoriaId`, `vendedorId`, `descricao`
4. **Usuario** (`usuarios`): `nome`, `email`, `senhaHash`, `criadoEm`

## Funcionalidades Implementadas
- **Autenticação e Sessões:** cadastro de usuários (com senha hasheada via `crypto`), login, proteção de rotas por middleware de sessão e logout.
- **CRUD Completo via Rotas Express.js:** cadastro, listagem/busca, visualização detalhada, atualização e exclusão para Produtos, Categorias e Vendedores.
- **Parâmetros GET e POST:**
  - `GET`: busca e filtragem via query string (ex.: `/produtos?busca=phone&categoriaId=...`) e consulta individual por parâmetro de rota (`/produtos/:id`).
  - `POST`: envio de dados para login, cadastro, criação, atualização e exclusão de registros.
- **Validação no Back-End:** verificação de campos obrigatórios, preço numérico positivo, formato de e-mail, validação de `ObjectId`, existência de registros relacionados e credenciais de login.
- **Tratamento de Exceções e Logs:** captura de falhas sem derrubar o servidor e gravação automática em `logs/errors.log` com data, horário, tipo, mensagem e operação.

## Organização dos Arquivos
- `app.js`: ponto de entrada da aplicação Express, sessões, EJS e middlewares globais.
- `src/database/database.js`: conexão com o MongoDB utilizando o MongoDB Driver.
- `src/models/`: classes `Categoria`, `Vendedor`, `Produto` e `Usuario`.
- `src/controllers/`: processamento das requisições HTTP e respostas às views.
- `src/routes/`: definição das rotas Express de autenticação e entidades.
- `src/middlewares/authMiddleware.js`: verificação de sessão ativa para rotas protegidas.
- `src/utils/logger.js`: registro de erros em `logs/errors.log`.
- `src/utils/password.js`: geração e verificação de hash de senhas com `crypto`.
- `src/views/`: templates EJS da interface Web.
- `public/css/style.css`: folha de estilos da aplicação.
- `logs/errors.log`: histórico de erros registrados pela aplicação.

## 📁 Estrutura do Projeto

```text
projeto2/
├── src/
│   ├── database/
│   │   └── database.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── password.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Categoria.js
│   │   ├── Vendedor.js
│   │   ├── Produto.js
│   │   └── Usuario.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoriaController.js
│   │   ├── vendedorController.js
│   │   └── produtoController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoriaRoutes.js
│   │   ├── vendedorRoutes.js
│   │   └── produtoRoutes.js
│   └── views/
│       ├── partials/
│       │   ├── header.ejs
│       │   └── footer.ejs
│       ├── index.ejs
│       ├── login.ejs
│       ├── register.ejs
│       ├── produtos.ejs
│       ├── produto-detalhe.ejs
│       ├── categorias.ejs
│       ├── vendedores.ejs
│       └── erro.ejs
├── public/
│   └── css/
│       └── style.css
├── logs/
│   └── errors.log
├── app.js
├── package.json
└── README.md
```

## 📦 Dependências Necessárias
- **Node.js** (v18 ou superior — testado no Node.js v24.11.1)
- **MongoDB Community Server** (em execução local na porta padrão `27017`)
- **Dependências do projeto (`package.json`):** `express`, `express-session`, `ejs`, `mongodb` e `nodemon` (devDependency).

---

## 🛠️ Configuração do MongoDB
1. Certifique-se de que o serviço do **MongoDB** esteja em execução localmente em `mongodb://127.0.0.1:27017`.
2. A aplicação utiliza o banco de dados **`ecommerce_pw1`** (criado automaticamente ao inserir os dados, mantendo continuidade com o Projeto 1).
3. *(Opcional)* Caso deseje alterar a URI ou o nome do banco, configure as variáveis de ambiente `MONGO_URI` e `MONGO_DB`.

---

## 🚀 Instalação e Execução

1. Acesse o diretório raiz do projeto (`projeto2/`) e instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor:
   ```bash
   # Execução padrão (node app.js)
   npm start

   # Ou execução em modo desenvolvimento (nodemon app.js)
   npm run dev
   ```

3. Ao iniciar com sucesso, o terminal exibirá:
   ```text
   Usuário padrão criado: admin@ecommerce.com / 123456
   Servidor E-commerce PW2 rodando em http://localhost:3000
   ```

4. Acesse no navegador: **`http://localhost:3000`**

---

## 🧪 Orientações para Testar as Rotas e Funcionalidades

| Recurso | Método / Rota | Como Testar |
| :--- | :--- | :--- |
| **Página Inicial** | `GET /` | Acesse a raiz da aplicação para navegar entre os módulos. |
| **Categorias** | `GET /categorias` | Cadastre, edite e exclua categorias (recomenda-se cadastrar antes de criar produtos). |
| **Vendedores** | `GET /vendedores` | Cadastre, edite e exclua vendedores informando nome, e-mail válido e documento. |
| **Produtos (CRUD)** | `GET /produtos` | Cadastre produtos vinculando uma categoria e um vendedor existentes; teste edição e exclusão. |
| **Busca e Filtro** | `GET /produtos?busca=...` | Utilize os campos de busca por nome ou filtro por categoria na listagem de produtos. |
| **Detalhe do Produto** | `GET /produtos/:id` | Clique em um produto da lista para visualizar seus dados completos. |
| **Validações e Logs** | `POST` / `GET` inválido | Tente cadastrar preço negativo, e-mail inválido ou acessar `/produtos/id-invalido` e verifique o registro gravado em `logs/errors.log`. |

---

## 🔐 Instruções para Testar o Login e Funcionalidades Protegidas

1. **Bloqueio de Acesso Sem Autenticação:**
   - Sem estar logado, tente acessar diretamente uma rota protegida pelo `authMiddleware.js` (ex.: `http://localhost:3000/produtos`).
   - **Resultado esperado:** registro da tentativa em `logs/errors.log` e redirecionamento automático para `/auth/login` com mensagem de erro.

2. **Login com o Usuário Padrão (criado automaticamente na primeira execução):**
   - Acesse `http://localhost:3000/auth/login` e utilize as credenciais iniciais:
     - **E-mail:** `admin@ecommerce.com`
     - **Senha:** `123456`

3. **Cadastro de Novo Usuário:**
   - Acesse `http://localhost:3000/auth/register`, informe **Nome**, **E-mail** e **Senha** e envie o formulário (`POST /auth/register`).
   - Em seguida, realize o login em `http://localhost:3000/auth/login` com o novo usuário criado.

4. **Encerramento de Sessão (Logout):**
   - Clique no botão **Sair** na barra de navegação (`POST /auth/logout`).
   - **Resultado esperado:** encerramento da sessão ativa no servidor e bloqueio imediato das rotas protegidas.