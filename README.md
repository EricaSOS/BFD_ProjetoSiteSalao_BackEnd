# BFD_ProjetoSiteSalao_BackEnd
Projeto desenvolvido para Residência do Bolsa Futuro Digital. Cliente Salão Wilson Hair.

# 💇‍♀️ Beauty Salon Booking API

API REST para sistema de agendamento de salão de beleza, desenvolvida com **Node.js**, **TypeScript**, **Express** e **SQLite**.

Este projeto foi construído como parte do programa **Bolsa Futuro Digital**, com foco em boas práticas de backend, organização de código e integração com frontend.

---

# 🚀 Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- SQLite
- Swagger (documentação da API)

---

# 📁 Estrutura do Projeto

```bash
src/
  controllers/      # Regras de negócio
  routes/           # Definição das rotas
  database/         # Conexão e inicialização do banco
  seeds/            # Dados iniciais
  utils/            # Funções auxiliares (datas, horários)
  docs/             # Configuração do Swagger
  server.ts         # Arquivo principal da aplicação
  ```
---

# 📌 Funcionalidades

## 🧾 Services (Serviços)

- Listar serviços
- Buscar serviço por ID
- Criar serviço
- Atualizar serviço
- Inativar serviço (soft delete)

# 👩‍🔧 Professionals (Profissionais)

- Listar profissionais por serviço
- Consultar horários disponíveis por profissional e data

# 📅 Appointments (Agendamentos)

- Criar agendamento
- Listar agendamentos (com filtros)
- Confirmar agendamento
- Cancelar agendamento

# 📊 Schedule (Agenda do Dia)

- Consultar agenda agrupada por profissional

# ⚙️ Regras de Negócio
- Apenas agendamentos com status pending e confirmed bloqueiam horários
- Agendamentos cancelados liberam automaticamente o horário
- A disponibilidade considera:
    - agenda semanal do profissional
    - múltiplos intervalos por dia
    - indisponibilidade parcial do profissional
    - fechamento parcial ou total do salão
    - agendamentos já existentes
---

# ▶️ Como Executar o Projeto
1. Instalar dependências
npm install
2. Rodar o projeto
npm run dev
3. Acessar o servidor
http://localhost:3000
---

# 📚 Documentação da API (Swagger)

Após iniciar o servidor, acesse:

http://localhost:3000/api-docs

A interface Swagger permite:

- visualizar todas as rotas
- testar endpoints
- entender os dados de entrada e saída
---

# 🔗 Rotas Principais
## Services
Método	Rota
GET	/services
GET	/services/{id}
GET	/services/{id}/professionals
POST	/services
PATCH	/services/{id}
DELETE	/services/{id}

## Professionals
Método	Rota
GET	/professionals/{id}/available-times?date=YYYY-MM-DD

## Appointments
Método	Rota
GET	/appointments
POST	/appointments
PATCH	/appointments/{id}/confirm
PATCH	/appointments/{id}/cancel

## Schedule
Método	Rota
GET	/schedule/day?date=YYYY-MM-DD
---

# 📦 Banco de Dados

Principais tabelas:

- services
- professionals
- professional_services
- appointments
- professional_schedules
- professional_unavailable_dates
- business_closures
---

## 🧩 Integração com Frontend

O backend foi estruturado para integração com frontend em:
React
Vite
MUI
Tailwind

Fluxo esperado:
Seleção de serviço
Seleção de profissional
Escolha de data e horário
Preenchimento de dados do cliente
Confirmação e envio via WhatsApp
---

# 👩‍💻 Autoria

## Projeto desenvolvido por:

**Érica Santos Oliveira da Silva**
Estudante de Análise e Desenvolvimento de Sistemas (IFPA)
Programa Bolsa Futuro Digital