# 💇 Companhia da Beleza — Backend

<p align="center">

API REST desenvolvida para o sistema **Companhia da Beleza**, contemplando agendamento online, autenticação administrativa, controle de profissionais, despesas, pagamentos e integração com frontend.

**Node.js • TypeScript • Express • Supabase PostgreSQL • Swagger • JWT**

</p>

---

## 📋 Sobre o projeto

Este repositório contém o backend do sistema **Companhia da Beleza**, desenvolvido durante o **Programa Bolsa Futuro Digital (BFD 2025)**.

A API foi estruturada para atender tanto o fluxo público de agendamento quanto a área administrativa do sistema, permitindo comunicação com o frontend por meio de rotas REST.

---

## ✨ Funcionalidades principais

### Área pública

- Listagem de serviços;
- Listagem de profissionais;
- Consulta de horários disponíveis;
- Criação de agendamentos;
- Geração automática de mensagem para WhatsApp.

### Área administrativa

- Login administrativo via JWT;
- Listagem e gerenciamento de agendamentos;
- Gerenciamento de profissionais;
- Controle de despesas;
- Controle de pagamentos;
- Dashboard integrado ao frontend.

---

## 🚀 Tecnologias utilizadas

| Tecnologia | Finalidade |
|------------|------------|
| Node.js | Runtime JavaScript |
| TypeScript | Tipagem estática |
| Express | Framework backend |
| Supabase PostgreSQL | Banco de dados |
| JWT | Autenticação administrativa |
| Swagger | Documentação da API |
| Helmet | Segurança HTTP |
| CORS | Controle de origem |
| Express Rate Limit | Proteção contra excesso de requisições |
| Render | Deploy do backend |

---

## 📁 Estrutura do projeto

```txt
src
│
├── auth
├── controllers
├── database
├── docs
├── infrastructure
├── middlewares
├── routes
├── schemas
├── seeds
├── utils
└── server.ts
```

---

## 🔐 Autenticação

A área administrativa utiliza autenticação baseada em **JWT**.

Após o login, o token deve ser enviado no cabeçalho das requisições protegidas:

```http
Authorization: Bearer <token>
```

---

## 📚 Documentação da API

A documentação interativa está disponível via Swagger.

Ambiente local:

```txt
http://localhost:3000/api-docs
```

Ambiente publicado:

```txt
https://bfd-projeto-salao-backend.onrender.com/api-docs
```

> Algumas rotas administrativas exigem autenticação via JWT.

---

## 📦 Rotas principais

### Auth

| Método | Endpoint |
|--------|----------|
| POST | `/auth/login` |

---

### Services

| Método | Endpoint |
|--------|----------|
| GET | `/services` |
| GET | `/services/{id}` |
| POST | `/services` |
| PATCH | `/services/{id}` |
| DELETE | `/services/{id}` |

---

### Professionals

| Método | Endpoint |
|--------|----------|
| GET | `/professionals` |
| GET | `/professionals?serviceId={id}` |
| GET | `/professionals/{id}/available-times?date=YYYY-MM-DD` |
| POST | `/professionals` |
| DELETE | `/professionals/{id}` |

---

### Appointments

| Método | Endpoint |
|--------|----------|
| GET | `/appointments` |
| POST | `/appointments` |
| PATCH | `/appointments/{id}/confirm` |
| PATCH | `/appointments/{id}/cancel` |
| GET | `/schedule/day?date=YYYY-MM-DD` |

---

### Expenses

| Método | Endpoint |
|--------|----------|
| GET | `/expenses` |
| POST | `/expenses` |
| DELETE | `/expenses/{id}` |

---

### Payments

| Método | Endpoint |
|--------|----------|
| GET | `/payments` |
| POST | `/payments` |
| DELETE | `/payments/{id}` |

---

## 🗄 Banco de dados

O projeto utiliza **PostgreSQL via Supabase**.

Principais tabelas:

- `services`
- `professionals`
- `professional_services`
- `appointments`
- `professional_schedules`
- `professional_unavailable_dates`
- `business_closures`
- `expenses`
- `payments`

---

## ⚙️ Regras de negócio

- Apenas agendamentos com status `pending` e `confirmed` bloqueiam horários;
- Agendamentos cancelados liberam automaticamente o horário;
- A disponibilidade considera:
  - agenda semanal do profissional;
  - múltiplos intervalos por dia;
  - indisponibilidade parcial do profissional;
  - fechamento parcial ou total do salão;
  - agendamentos já existentes;
  - duração do serviço;
- O backend gera a mensagem de confirmação para envio via WhatsApp.

---

## ▶️ Como executar localmente

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto:

```env
NODE_ENV=development
PORT=3000

DATABASE_URL=postgresql://usuario:senha@host:porta/database

FRONTEND_URL=http://localhost:5173

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=troque-esta-chave-em-producao

RECEPTION_WHATSAPP_PHONE=5591999999999

KEEP_ALIVE_ENABLED=false
KEEP_ALIVE_URL=https://bfd-projeto-salao-backend.onrender.com
KEEP_ALIVE_INTERVAL=4
KEEP_ALIVE_START=6
KEEP_ALIVE_END=23
KEEP_ALIVE_WEEKDAYS=1-6
KEEP_ALIVE_TIMEZONE=America/Belem
```

Execute em modo desenvolvimento:

```bash
npm run dev
```

Servidor local:

```txt
http://localhost:3000
```

---

## ☁️ Deploy

O backend está publicado no Render.

URL base:

```txt
https://bfd-projeto-salao-backend.onrender.com
```

Health check:

```txt
https://bfd-projeto-salao-backend.onrender.com/healthz
```

Documentação Swagger:

```txt
https://bfd-projeto-salao-backend.onrender.com/api-docs
```

---

## 🩺 Health check

A API possui uma rota leve para verificação de disponibilidade:

```txt
GET /healthz
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

---

## 🧩 Integração com frontend

Este backend foi desenvolvido para integração com o frontend React/Vite do sistema Companhia da Beleza.

Fluxo público esperado:

```txt
Serviço
↓
Profissional
↓
Data e horário
↓
Dados do cliente
↓
Resumo e WhatsApp
```

---

## 👩‍💻 Desenvolvimento

Backend desenvolvido por:

**Érica Santos Oliveira da Silva**

Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas  
Instituto Federal do Pará — IFPA  
Programa Bolsa Futuro Digital — BFD 2025

---

## 📄 Observações

Este projeto foi desenvolvido para fins acadêmicos, demonstração técnica, entrega de projeto e composição de portfólio profissional.