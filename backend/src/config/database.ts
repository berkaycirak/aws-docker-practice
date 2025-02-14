import { DataSource } from "typeorm";
import { User } from "../models/User";
import { Post } from "../models/Post";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.POSTGRES_HOST,
	port: parseInt(process.env.POSTGRES_PORT || "5432"),
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	synchronize: process.env.NODE_ENV === "development",
	logging: false,
	entities: [User, Post],
	subscribers: [],
	migrations: [],
});
