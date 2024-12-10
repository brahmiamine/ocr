import { Router } from "express";
import { uploadPDFAndAnalyze } from "../controllers/chatController";
import fileUpload from "../middlewares/fileUpload";

const router = Router();

// Route to upload and analyze a PDF
router.post("/upload", fileUpload.single("file"), uploadPDFAndAnalyze);

export default router;
