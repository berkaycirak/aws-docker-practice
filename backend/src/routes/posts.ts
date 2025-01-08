import { Router, Response } from "express";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { AppDataSource } from "../config/database";
import { checkAuth, AuthRequest } from "../middleware/auth";
import multer from "multer";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const router = Router();
const postRepository = AppDataSource.getRepository(Post);
const userRepository = AppDataSource.getRepository(User);

// Configure S3
const s3Client = new S3Client({
	region: process.env.AWS_REGION || "us-east-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
	},
});

// Configure multer for handling file uploads
const upload = multer({
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB limit
	},
	fileFilter: (_, file, cb) => {
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(new Error("Not an image! Please upload an image."));
		}
	},
});

// Create a new post
router.post("/", checkAuth, upload.single("image"), async (req: AuthRequest, res: Response) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "Please upload an image" });
		}

		if (!req.user?.userId) {
			return res.status(401).json({ message: "User not authenticated" });
		}

		const user = await userRepository.findOne({ where: { id: req.user.userId } });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const { description } = req.body;
		const fileExtension = req.file.mimetype.split("/")[1];
		const key = `uploads/${uuidv4()}.${fileExtension}`;

		// Upload to S3
		await s3Client.send(
			new PutObjectCommand({
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: key,
				Body: req.file.buffer,
				ContentType: req.file.mimetype,
			})
		);

		const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${
			process.env.AWS_REGION || "us-east-1"
		}.amazonaws.com/${key}`;

		// Create post in database
		const post = new Post();
		post.imageUrl = imageUrl;
		post.description = description;
		post.user = user;

		await postRepository.save(post);
		return res.status(201).json(post);
	} catch (error) {
		console.error("Error creating post:", error);
		return res.status(500).json({ message: "Error creating post" });
	}
});

// Get all posts
router.get("/", checkAuth, async (_: AuthRequest, res: Response) => {
	try {
		const posts = await postRepository.find({
			order: { createdAt: "DESC" },
			relations: ["user"],
		});

		// Generate pre-signed URLs for each post
		const postsWithSignedUrls = await Promise.all(
			posts.map(async (post) => {
				// Extract the key from the imageUrl
				const key = post.imageUrl.split(".amazonaws.com/")[1];

				// Generate pre-signed URL with maximum allowed expiration (7 days)
				const command = new GetObjectCommand({
					Bucket: process.env.AWS_BUCKET_NAME,
					Key: key,
				});
				const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 604800 }); // URL expires in 7 days

				return {
					...post,
					imageUrl: signedUrl,
				};
			})
		);

		return res.json(postsWithSignedUrls);
	} catch (error) {
		console.error("Error fetching posts:", error);
		return res.status(500).json({ message: "Error fetching posts" });
	}
});

export default router;
