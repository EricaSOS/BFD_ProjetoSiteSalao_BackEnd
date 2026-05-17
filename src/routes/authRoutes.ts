import { Router } from "express";
import { loginAdmin } from "../controllers/authController.js";

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login administrativo
 *     description: Autentica o administrador e retorna um token JWT para acessar rotas protegidas.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: senha-super-segura
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       400:
 *         description: Usuário e senha são obrigatórios
 *       401:
 *         description: Usuário ou senha inválidos
 *       500:
 *         description: Erro ao realizar login
 */

router.post("/auth/login", loginAdmin);

export default router;