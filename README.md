# Sistema de Registro de Usuários

Este é o meu primeiro projeto Full-Stack. É uma aplicação web completa para registros de usuários, com front-end em **React + Vite** e back-end em **Node.js + Express + Prisma**, com a criação de uma API Rest.

---

## 🖥️ Deploy

- 🌐 Front-end: [https://front-sistema-registrador.onrender.com](https://front-sistema-registrador.onrender.com/)
- 🛠️ Back-end API: [https://sistema-registrador.onrender.com](https://sistema-registrador.onrender.com/)

---

## 📸 Funcionalidades Gerais

- Cadastro e Atualização de usuários com validações
- Listagem e Remoção de usuários
- Sistema de Busca e Filtragem
- Alerts que informam possíveis erros ou sucessos
- Integração entre front-end e back-end
- Banco de dados com Prisma e PostgreSQL
- Deploy automático no Render

---

## 📡 API - Funcionalidades

### 🔍 `GET /users`

- Lista todos os usuários cadastrados.

#### 🔎 Pesquisa:
```
GET /users?search=termo
```
- Pesquisa o termo em todos os campos (name, email, id, age).

#### 🎯 Pesquisa por campos específicos:
```
GET /users?search=termo&field=name&field=id&field=age&field=email
```
- Pesquisa o termo apenas nos campos especificados.

---

### ➕ `POST /users`

- Cadastra um novo usuário.

#### 📥 Corpo da requisição (`body`):
```json
{
  "age": 25,
  "name": "João Silva",
  "email": "joao@email.com"
}
```
> ⚠️ O campo `email` deve ser único.

---

### ✏️ `PUT /users/{id}`

- Atualiza os dados de um usuário existente.

#### 📥 Corpo da requisição (`body`):
```json
{
  "age": 30,
  "name": "Maria Souza",
  "email": "maria@email.com"
}
```
> ⚠️ O campo `email` também deve ser único.

---

### ❌ `DELETE /users/{id}`

- Remove um usuário com o ID especificado.

## 🚀 Tecnologias

### Front-end:
- React 19
- Vite
- Axios
- Bootstrap 5
- React Select

### Back-end:
- Node.js
- Express
- cors
- Prisma ORM
- dotenv

---

## ⚙️ Como rodar localmente

### 1. Clonar o repositório

```bash
https://github.com/dalessandro-dev/Sistema-Registrador.git
cd Sistema-Registrador
````

### 2. Configurar Back-end

Crie um arquivo `.env` dentro da pasta `back-end` com as seguintes variáveis:

```env
DATABASE_URL=  # sua URL do banco
DIRECT_URL=    # URL direta usada internamente pelo Prisma
PORT= # Porta se desejar configurar uma além da 3000
```

> Exemplo de URL: `postgresql://usuario:senha@localhost:5432/nome_do_banco`

Em seguida, rode o servidor:

```bash
cd back-end
node server.js
``` 
### 3. Configurar Front-end

Crie um arquivo `.env` dentro da pasta `front-end` com a seguinte variável (usando o link da API local):

```env
VITE_API_URL=http://localhost:PORTA_USADA
```

> Exemplo: `VITE_API_URL=http://localhost:3000`

Depois, inicie o projeto React:

```bash
cd front-end
npm run dev
```

Abra o link gerado no terminal (geralmente `http://localhost:5173`).

## 🧾 Licença

Este projeto está licenciado sob a licença MIT.

## 👤 Autor

Desenvolvido por **Dalessandro Gomes Davi**  
📧 Email: dalessandrogd.dev@gmail.com 
💼 GitHub: [@dalessandro-dev](https://github.com/dalessandro-dev)
