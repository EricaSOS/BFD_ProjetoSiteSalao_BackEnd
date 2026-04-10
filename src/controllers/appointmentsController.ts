import type { Request, Response } from "express";
import { getDb } from "../database/db.js";

export async function listAppointments(req: Request, res: Response) {
  try {
    const db = await getDb();

    const appointments = await db.all(
      `SELECT * FROM agendamentos ORDER BY data, horario`
    );

    return res.status(200).json(appointments);
  } catch (error) {
    console.error("Error listing appointments:", error);
    return res.status(500).json({
      error: "Error listing appointments."
    });
  }
}

export async function createAppointment(req: Request, res: Response) {
  try {
    const {
      cliente_nome,
      cliente_telefone,
      cliente_email,
      servico_id,
      profissional_id,
      data,
      horario
    } = req.body;

    // 1. Validar campos obrigatórios
    if (
      !cliente_nome ||
      !cliente_telefone ||
      !servico_id ||
      !profissional_id ||
      !data ||
      !horario
    ) {
      return res.status(400).json({
        error:
          "Required fields: cliente_nome, cliente_telefone, servico_id, profissional_id, data, horario."
      });
    }

    const db = await getDb();

    // 2. Verificar se o serviço existe
    const service = await db.get(
      `SELECT * FROM servicos WHERE id = ? AND ativo = 1`,
      [servico_id]
    );

    if (!service) {
      return res.status(404).json({
        error: "Service not found."
      });
    }

    // 3. Verificar se o profissional existe
    const professional = await db.get(
      `SELECT * FROM profissionais WHERE id = ? AND ativo = 1`,
      [profissional_id]
    );

    if (!professional) {
      return res.status(404).json({
        error: "Professional not found."
      });
    }

    // 4. Verificar se o profissional faz esse serviço
    const professionalService = await db.get(
      `SELECT * FROM profissional_servico
       WHERE profissional_id = ? AND servico_id = ?`,
      [profissional_id, servico_id]
    );

    if (!professionalService) {
      return res.status(400).json({
        error: "This professional does not provide the selected service."
      });
    }

    // 5. Verificar conflito de horário
    const conflictingAppointment = await db.get(
      `SELECT * FROM agendamentos
       WHERE profissional_id = ?
         AND data = ?
         AND horario = ?
         AND status IN ('pending', 'confirmed')`,
      [profissional_id, data, horario]
    );

    if (conflictingAppointment) {
      return res.status(400).json({
        error: "This time slot is no longer available."
      });
    }

    // 6. Gerar mensagem do WhatsApp
    const whatsappMessage =
`Olá! Gostaria de confirmar meu agendamento.

*Detalhes do Agendamento*
Serviço: ${service.nome}
Profissional: ${professional.nome}
Data: ${data}
Horário: ${horario}
Valor: R$ ${service.preco}

*Meus Dados*
Nome: ${cliente_nome}
Telefone: ${cliente_telefone}
E-mail: ${cliente_email ?? "Não informado"}`;

    // 7. Data de criação
    const createdAt = new Date().toISOString();

    // 8. Salvar o agendamento
    const result = await db.run(
      `INSERT INTO agendamentos (
        cliente_nome,
        cliente_telefone,
        cliente_email,
        servico_id,
        profissional_id,
        servico_nome,
        profissional_nome,
        data,
        horario,
        valor,
        status,
        mensagem_whatsapp,
        criado_em
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cliente_nome,
        cliente_telefone,
        cliente_email ?? null,
        servico_id,
        profissional_id,
        service.nome,
        professional.nome,
        data,
        horario,
        service.preco,
        "pending",
        whatsappMessage,
        createdAt
      ]
    );

    // 9. Buscar o agendamento criado
    const newAppointment = await db.get(
      `SELECT * FROM agendamentos WHERE id = ?`,
      [result.lastID]
    );

    // 10. Retornar resposta pensada para a tela "Quase lá!"
    return res.status(201).json({
      id: newAppointment.id,
      status: newAppointment.status,
      summary: {
        serviceName: newAppointment.servico_nome,
        professionalName: newAppointment.profissional_nome,
        date: newAppointment.data,
        time: newAppointment.horario,
        price: newAppointment.valor
      },
      customer: {
        name: newAppointment.cliente_nome,
        phone: newAppointment.cliente_telefone,
        email: newAppointment.cliente_email
      },
      whatsappMessage: newAppointment.mensagem_whatsapp
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return res.status(500).json({
      error: "Error creating appointment."
    });
  }
}

export async function cancelAppointment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { motivo_cancelamento } = req.body;

    const db = await getDb();

    // 1. Verificar se o agendamento existe
    const appointment = await db.get(
      `SELECT * FROM agendamentos WHERE id = ?`,
      [id]
    );

    if (!appointment) {
      return res.status(404).json({
        error: "Appointment not found."
      });
    }

    // 2. Verificar se já está cancelado
    if (appointment.status === "cancelled") {
      return res.status(400).json({
        error: "Appointment is already cancelled."
      });
    }

    // 3. Atualizar status para cancelled
    const cancelledAt = new Date().toISOString();

    await db.run(
      `UPDATE agendamentos
       SET status = ?, cancelado_em = ?, motivo_cancelamento = ?
       WHERE id = ?`,
      [
        "cancelled",
        cancelledAt,
        motivo_cancelamento ?? null,
        id
      ]
    );

    // 4. Buscar o registro atualizado
    const updatedAppointment = await db.get(
      `SELECT * FROM agendamentos WHERE id = ?`,
      [id]
    );

    return res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return res.status(500).json({
      error: "Error cancelling appointment."
    });
  }
}