import type { Request, Response } from "express";
import { generateToken } from "../auth/generateToken.js";

export async function loginAdmin(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      throw new Error("Admin credentials are not configured.");
    }

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required."
      });
    }

    if (username !== adminUsername || password !== adminPassword) {
      return res.status(401).json({
        error: "Invalid username or password."
      });
    }

    const token = generateToken(username);

    return res.status(200).json({
      message: "Login successful.",
      token
    });
  } catch (error) {
    console.error("Error logging in admin:", error);

    return res.status(500).json({
      error: "Error logging in."
    });
  }
}