# Todo Backend API

API backend para gerenciamento de tarefas (To-Do), construída com **NestJS**, seguindo princípios de **DDD** e **Clean Architecture**.

---

## 🛠 Tecnologias

- Node.js + TypeScript
- NestJS
- PostgreSQL / SQLite
- JWT para autenticação
- TypeORM
- Pino para logging
- Swagger para documentação
- Jest para testes unitários e de integração

---

## 📂 Estrutura do Projeto

## ⚡ Funcionalidades

- CRUD de tarefas (Create, Read, Update, Delete)
- Autenticação com JWT
- Logging centralizado (Pino)
- Validação com `class-validator`
- Testes unitários e de integração com Jest
- Documentação Swagger

---

## 🚀 Como Rodar

### Pré-requisitos

- Node.js >= 20
- npm
- Banco de dados PostgreSQL ou SQLite

## Documentação

### Acesse a documentação em:

http://localhost:3000/api

### Exemplos de Endpoints

POST /users/register → Criar usuário

POST /users/login → Autenticar usuário

POST /tasks → Criar tarefa

GET /tasks → Listar tarefas do usuário

PUT /tasks/:id → Atualizar tarefa

DELETE /tasks/:id → Deletar tarefa

### Instalação

```bash
git clone <seu-repo>
cd todo-backend
npm install
```
