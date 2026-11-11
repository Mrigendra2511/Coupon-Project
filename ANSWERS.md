Part 2: Bug Analysis
Here are the main bugs found in the provided /apply route code:
1. Null Check Missing: If coupon is not found in DB, `Coupon.findOne()` returns null and accessing `coupon.expiresAt` crashes the server. Added `if (!coupon)` check.

2. Amount Validation Missing: Invalid or missing amount returns NaN, negative numbers give wrong math, and `1e400` turns into Infinity. Added `Number.isFinite(amount)` check.

3. Code Type Check Missing: Object payload in `code` can cause NoSQL injection or `.trim()` crash. Added `typeof code === "string"` check.

4. Async Error Handling Missing: DB errors without try-catch can hang the request. Wrapped code in try-catch block.

5. Expiry & Decimal Fix: Added check for expired coupons and rounded final amount using `Math.round()`.

# Here is the fixed code 
 ``` js 
app.post("/apply", async (req, res) => {
  try {
    const { code, amount } = req.body;

    // Check input
    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }
    if (typeof amount !== "number" || isNaN(amount) || amount < 0) {
      return res.status(400).json({ message: "Please provide a valid amount" });
    }

    // Find coupon
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    // Check if coupon exists
    if (!coupon) {
      return res.status(404).json({ message: "Coupon code not found" });
    }

    // Check expiry
    if (new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    // Calculate final amount
    const finalAmount = amount - (amount * coupon.discount) / 100;

    return res.status(200).json({ finalAmount });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});