import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import aiRoutes from "./routes/aiRoutes.js";


const app = express();

app.use(cors({
  origin: "http://localhost:5173", // apne frontend port ke mutabiq update kar lo
  credentials: true,
}));

app.use(express.json());


app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Server running...");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});