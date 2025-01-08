import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import { User } from "./models/User";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

// Initialize database and create admin user
AppDataSource.initialize()
	.then(async () => {
		console.log("Database connected successfully");

		// Create admin user if it doesn't exist
		const userRepository = AppDataSource.getRepository(User);
		const adminUser = await userRepository.findOne({ where: { username: "admin" } });

		if (!adminUser) {
			const newAdmin = new User();
			newAdmin.username = "admin";
			newAdmin.password = "admin";
			await newAdmin.hashPassword();
			await userRepository.save(newAdmin);
			console.log("Admin user created");
		}

		// Start server
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error("Error during initialization:", error);
	});
