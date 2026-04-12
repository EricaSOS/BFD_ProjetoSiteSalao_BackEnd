import { Router } from "express";
import {
  listServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from "../controllers/servicesController.js";

import { listProfessionalsByService } from "../controllers/professionalsController.js";


const router = Router();

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Listar todos os serviços ativos
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: Lista de serviços retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Corte Feminino
 *                   description:
 *                     type: string
 *                     example: Corte com finalização para valorizar seu estilo.
 *                   price:
 *                     type: number
 *                     example: 80
 *                   duration:
 *                     type: integer
 *                     example: 60
 *                   imageUrl:
 *                     type: string
 *                     example: /images/services/corte-feminino.jpg
 
 * /services/{id}:
 *   get:
 *     summary: Buscar um serviço pelo ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do serviço
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Serviço encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Corte Feminino
 *                 description:
 *                   type: string
 *                   example: Corte com finalização para valorizar seu estilo.
 *                 price:
 *                   type: number
 *                   example: 80
 *                 duration:
 *                   type: integer
 *                   example: 60
 *                 imageUrl:
 *                   type: string
 *                   example: /images/services/corte-feminino.jpg
 *       404:
 *         description: Serviço não encontrado

 * /services/{id}/professionals:
 *   get:
 *     summary: Listar profissionais de um serviço
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do serviço
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Lista de profissionais retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Ricardo Costa
 *                   photo:
 *                     type: string
 *                     example: /images/professionals/ricardo.jpg
 *                   specialty:
 *                     type: string
 *                     example: Cortes e barba
 *                   rating:
 *                     type: number
 *                     example: 4.9
 *                   whatsappPhone:
 *                     type: string
 *                     example: "5591999991111"
 *       404:
 *         description: Serviço não encontrado
 */
 /**
 * @swagger
 * /services:
 *   post:
 *     summary: Criar um novo serviço
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - duration
 *             properties:
 *               name:
 *                 type: string
 *                 example: Escova
 *               description:
 *                 type: string
 *                 example: Modelagem e finalização para diferentes ocasiões.
 *               imageUrl:
 *                 type: string
 *                 example: /images/services/escova.jpg
 *               price:
 *                 type: number
 *                 example: 50
 *               duration:
 *                 type: integer
 *                 example: 40
 *     responses:
 *       201:
 *         description: Serviço criado com sucesso
 *       400:
 *         description: Dados obrigatórios ausentes
 */
/**
 * @swagger
 * /services/{id}:
 *   patch:
 *     summary: Atualizar um serviço
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do serviço
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Corte Feminino Premium
 *               description:
 *                 type: string
 *                 example: Corte com finalização premium.
 *               imageUrl:
 *                 type: string
 *                 example: /images/services/corte-feminino-premium.jpg
 *               price:
 *                 type: number
 *                 example: 95
 *               duration:
 *                 type: integer
 *                 example: 70
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso
 *       404:
 *         description: Serviço não encontrado
 */
/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Inativar um serviço
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do serviço
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Serviço inativado com sucesso
 *       404:
 *         description: Serviço não encontrado
 */

router.get("/", listServices);
router.get("/:id/professionals", listProfessionalsByService);
router.get("/:id", getServiceById);
router.post("/", createService);
router.patch("/:id", updateService);
router.delete("/:id", deleteService);

export default router;