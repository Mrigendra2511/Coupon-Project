import { Router } from "express";
import {
  createCoupon,
  getAllCoupons,
  applyCoupon
} from "../controllers/couponController";

const router = Router();

router.route("/coupons").post(createCoupon).get(getAllCoupons);
router.route("/coupons/apply").post(applyCoupon);

export default router;