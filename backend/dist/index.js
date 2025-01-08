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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const auth_1 = __importDefault(require("./routes/auth"));
const User_1 = require("./models/User");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/auth", auth_1.default);
database_1.AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Database connected successfully");
    const userRepository = database_1.AppDataSource.getRepository(User_1.User);
    const adminUser = yield userRepository.findOne({ where: { username: "admin" } });
    if (!adminUser) {
        const newAdmin = new User_1.User();
        newAdmin.username = "admin";
        newAdmin.password = "admin";
        yield newAdmin.hashPassword();
        yield userRepository.save(newAdmin);
        console.log("Admin user created");
    }
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}))
    .catch((error) => {
    console.error("Error during initialization:", error);
});
//# sourceMappingURL=index.js.map