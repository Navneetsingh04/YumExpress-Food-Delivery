import express from "express";
import adminAuthMiddleware from "../middleware/adminAuth.js";
import {
  getOrdersOverview,
  getRevenueData,
  getCustomerAnalytics,
  getTopMetrics,
  getDashboardSummary
} from "../controllers/analyticsController.js";

const analyticsRouter = express.Router();

// Dashboard summary - overall stats
analyticsRouter.get("/summary", adminAuthMiddleware, getDashboardSummary);

// Orders analytics
analyticsRouter.get("/orders", adminAuthMiddleware, getOrdersOverview);

// Revenue analytics
analyticsRouter.get("/revenue", adminAuthMiddleware, getRevenueData);

// Customer analytics
analyticsRouter.get("/customers", adminAuthMiddleware, getCustomerAnalytics);

// Top metrics (items, categories)
analyticsRouter.get("/top-metrics", adminAuthMiddleware, getTopMetrics);

export default analyticsRouter;