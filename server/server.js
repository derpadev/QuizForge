import express from "express";
import cors from "cors";
import quizRoutes from "./routes/quizRoutes.js"
import mockRoutes from "./routes/mockRoute.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/quiz", quizRoutes);
app.use("/api/mock", mockRoutes)

app.listen(PORT, () => {
  console.log("Server is running on PORT: ", PORT);
});
