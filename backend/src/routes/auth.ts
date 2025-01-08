import { Router, Request, Response } from "express";
import { User } from "../models/User";
import { AppDataSource } from "../config/database";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/auth";

const router = Router();
const userRepository = AppDataSource.getRepository(User);

interface LoginBody {
	username: string;
	password: string;
}

// Login route
router.post("/login", async (req: Request<{}, {}, LoginBody>, res: Response) => {
	try {
		const { username, password } = req.body;

		const user = await userRepository.findOne({ where: { username } });
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const isValid = await user.validatePassword(password);
		if (!isValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "1d" });

		return res.json({ token });
	} catch (error) {
		console.error("Login error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

// Get current user
router.get("/me", async (req: AuthRequest, res: Response) => {
	try {
		const user = await userRepository.findOne({
			where: { id: req.user?.userId },
			select: ["id", "username", "createdAt"],
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		return res.json(user);
	} catch (error) {
		console.error("Get user error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

export default router;
