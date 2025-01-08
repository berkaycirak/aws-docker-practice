import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
	user?: {
		userId: string;
	};
}

export const checkAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ message: "No token provided" });
		}

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string };

		req.user = { userId: decoded.userId };
		return next();
	} catch (error) {
		return res.status(401).json({ message: "Invalid token" });
	}
};
