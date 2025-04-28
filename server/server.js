import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import connectCloudnary from "./config/cloudinary.js";
import "./config/instrument.js";
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from "./controllers/webhooks.js";
import { clerkMiddleware } from "@clerk/express";

//Routes
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
//Intitialize the app
const app = express();

// Connect to the database
await connectDB();
await connectCloudnary();

//Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

//Routes
app.get("/", (req, res) => {
  res.send("JobHub backend server is running!");
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post("/webhooks", clerkWebhooks);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

//Listen to the server
const PORT = process.env.PORT || 5000;

//Error handling

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

Sentry.setupExpressErrorHandler(app);
//Export the app
export default app;
