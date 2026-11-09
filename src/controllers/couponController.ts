import { Request, Response } from "express";
import { Coupon } from "../models/Coupon";
import { asyncHandler, ApiError, ApiResponse } from "../utils/apiUtils";

// 1. POST /coupons — Create Coupon
export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, discountPercent, expiresAt } = req.body;

  if (!code || !discountPercent || !expiresAt) {
    throw new ApiError(400, "All fields (code, discountPercent, expiresAt) are required");
  }

  if (typeof discountPercent !== "number" || discountPercent < 1 || discountPercent > 90) {
    throw new ApiError(400, "discountPercent must be a number between 1 and 90");
  }

  const existingCoupon = await Coupon.findOne({ code: code.toString().trim().toUpperCase() });
  if (existingCoupon) {
    throw new ApiError(400, "Coupon code already exists");
  }

  const coupon = await Coupon.create({
    code,
    discountPercent,
    expiresAt: new Date(expiresAt)
  });

  return res
    .status(201)
    .json(new ApiResponse(201, coupon, "Coupon created successfully"));
});

// 2. GET /coupons — Get All Coupons
export const getAllCoupons = asyncHandler(async (req: Request, res: Response) => {
  const coupons = await Coupon.find();
  return res
    .status(200)
    .json(new ApiResponse(200, coupons, "Coupons retrieved successfully"));
});

// 3. POST /coupons/apply — Apply Coupon
export const applyCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, amount } = req.body;

  // Validation: Amount checks
  if (amount === undefined || amount === null) {
    throw new ApiError(400, "Amount is required");
  }
  if (typeof amount !== "number" || isNaN(amount)) {
    throw new ApiError(400, "Amount must be a valid number");
  }
  if (amount < 0) {
    throw new ApiError(400, "Amount cannot be negative");
  }

  // Validation: Code check
  if (!code || typeof code !== "string" || code.trim() === "") {
    throw new ApiError(400, "Coupon code is required");
  }

  // Fetch coupon from DB
  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });
  if (!coupon) {
    throw new ApiError(404, "Coupon code does not exist");
  }

  // Validation: Expiry check
  if (new Date(coupon.expiresAt) < new Date()) {
    throw new ApiError(400, "Coupon has expired");
  }

  // Calculate discount
  const finalAmount = amount - (amount * coupon.discountPercent) / 100;
  const roundedFinalAmount = Math.round(finalAmount * 100) / 100;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        originalAmount: amount,
        discountPercent: coupon.discountPercent,
        finalAmount: roundedFinalAmount
      },
      "Coupon applied successfully"
    )
  );
});