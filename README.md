# 💰 Gestão Financeira Pessoal

Sistema fullstack de gestão financeira pessoal desenvolvido como desafio técnico.

## 🚀 Tecnologias

- **Backend:** NestJS + Mongoose
- **Banco de Dados:** MongoDB
- **Frontend:** Next.js + Tailwind CSS

---

## ⚙️ Como Executar

### Pré-requisitos

- Node.js 18+
- MongoDB rodando localmente ou MongoDB Atlas

### Backend
```bash
cd backend
npm install
npm run start:dev
```

> Servidor rodando em `http://localhost:3001`

### Frontend
```bash
cd frontend
npm install
npm run dev
```

> Aplicação rodando em `http://localhost:3000`

### Variáveis de Ambiente

Crie um arquivo `.env` dentro de `backend/`:
```env
MONGODB_URI=mongodb://localhost:27017/financeapp
JWT_SECRET=supersecret_mude_em_producao
JWT_EXPIRES_IN=7d
PORT=3001
```

Crie um arquivo `.env.local` dentro de `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 📡 Endpoints da API

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/signup` | Cadastro de usuário |
| POST | `/auth/login` | Login e geração de token JWT |

### Transações
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/transactions` | Criar transação |
| GET | `/transactions?month=2&year=2026` | Listar por mês/ano |
| DELETE | `/transactions/:id` | Remover transação |

### Saldo
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/balance?month=2&year=2026` | Saldo mensal |

---

## 🏗️ Decisões Técnicas

- **Despesas fixas sem duplicação:** em vez de criar uma cópia da despesa fixa para cada mês, ela é armazenada uma única vez no banco e retornada automaticamente em qualquer consulta mensal, mantendo o banco limpo
- **Edição via delete + create:** a edição foi implementada no frontend deletando a transação antiga e criando uma nova com os dados atualizados, evitando a necessidade de um endpoint PATCH no backend
- **Correção de fuso horário:** datas são enviadas com `T12:00:00` para evitar que o JavaScript interprete a data como UTC e cause deslocamento de um dia
- **Interceptor Axios:** o token JWT é injetado automaticamente em todas as requisições autenticadas via interceptor, centralizando a lógica de autenticação no cliente
- **Separação de módulos no backend:** cada domínio (`auth`, `users`, `transactions`) tem seu próprio módulo, service e controller, facilitando manutenção e escalabilidade

---

## 📸 Screenshots

### Tela de Login
![Login](./screenshots/login.png)

### Dashboard vazio
![Dashboard vazio](./screenshots/dashboard-vazio.png)

### Dashboard com transações
![Dashboard com transações](./screenshots/dashboard-transacoes.png)

### Formulário de nova transação
![Nova transação](./screenshots/nova-transacao.png)

### Editar transação
![Editar transação](./screenshots/editar-transacao.png)

### Despesas fixas em outro mês
![Despesas fixas](./screenshots/despesas-fixas.png)

---

## 📁 Estrutura do Projeto
```
Desafio Fullstack – Gestão Financeira/
├── backend/
│   └── src/
│       ├── auth/
│       │   ├── dto/
│       │   ├── auth.controller.ts
│       │   ├── auth.module.ts
│       │   ├── auth.service.ts
│       │   └── jwt.strategy.ts
│       ├── transactions/
│       │   ├── dto/
│       │   ├── transaction.schema.ts
│       │   ├── transactions.controller.ts
│       │   ├── transactions.module.ts
│       │   └── transactions.service.ts
│       ├── users/
│       │   ├── user.schema.ts
│       │   ├── users.module.ts
│       │   └── users.service.ts
│       ├── common/
│       │   └── jwt-auth.guard.ts
│       ├── app.module.ts
│       └── main.ts
└── frontend/
    └── src/
        ├── app/
        │   ├── dashboard/
        │   │   └── page.tsx
        │   ├── globals.css
        │   ├── layout.tsx
        │   └── page.tsx
        ├── components/
        │   └── TransactionForm.tsx
        ├── lib/
        │   ├── api.ts
        │   └── auth.ts
        └── types/
            └── index.ts
```
