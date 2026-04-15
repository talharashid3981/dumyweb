import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// Update CORS configuration to allow both localhost and your Vercel domain
app.use(cors({
  origin: ["https://dumyweb.vercel.app"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


console.log("frontend call come")

app.use(express.json());

app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Server running...");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});