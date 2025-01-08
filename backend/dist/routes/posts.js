"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Post_1 = require("../models/Post");
const User_1 = require("../models/User");
const database_1 = require("../config/database");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
const postRepository = database_1.AppDataSource.getRepository(Post_1.Post);
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});
const upload = (0, multer_1.default)({
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (_, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Not an image! Please upload an image."));
        }
    },
});
router.post("/", auth_1.checkAuth, upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image" });
        }
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const user = yield userRepository.findOne({ where: { id: req.user.userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { description } = req.body;
        const fileExtension = req.file.mimetype.split("/")[1];
        const key = `uploads/${(0, uuid_1.v4)()}.${fileExtension}`;
        yield s3Client.send(new client_s3_1.PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        }));
        const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com/${key}`;
        const post = new Post_1.Post();
        post.imageUrl = imageUrl;
        post.description = description;
        post.user = user;
        yield postRepository.save(post);
        return res.status(201).json(post);
    }
    catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ message: "Error creating post" });
    }
}));
router.get("/", auth_1.checkAuth, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield postRepository.find({
            order: { createdAt: "DESC" },
            relations: ["user"],
        });
        return res.json(posts);
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ message: "Error fetching posts" });
    }
}));
exports.default = router;
//# sourceMappingURL=posts.js.map