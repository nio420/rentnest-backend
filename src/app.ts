import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth/auth.route";
import { notFoundRoute } from "./middleware/notFoundRoute";
import { globalErrorHandler } from "./middleware/globalErrorhandler";
import { categoryRouter } from "./modules/category/category.route";
import { propertyRouter } from "./modules/property/property.route";
import { rentalLandlordRouter } from "./modules/rental/rental.landlord.route";
import { rentalTenantRouter } from "./modules/rental/rental.tenant.route";
import { paymentRouter } from "./modules/payment/payment.route";
import { paymentController } from "./modules/payment/payment.controller";
import { reviewRouter } from "./modules/review/review.route";
import { adminRouter } from "./modules/admin/admin.route";

const app: Application = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}))

// webhook
app.post(
    "/api/payments/confirm", 
    express.raw({ type: () => true }), 
    paymentController.confirmPayment
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.send("RentNest Backend Working!");
})

app.use("/api/auth", authRouter)
app.use("/api/categories", categoryRouter)
app.use("/api", propertyRouter)
app.use("/api/landlord/requests", rentalLandlordRouter)
app.use("/api/rentals", rentalTenantRouter)
app.use("/api/payments", paymentRouter)
app.use("/api/reviews", reviewRouter)
app.use("/api/admin", adminRouter)

app.use(notFoundRoute)
app.use(globalErrorHandler)

export default app;