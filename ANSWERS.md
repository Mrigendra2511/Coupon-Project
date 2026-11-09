# Part 2: Code Review and Bug Analysis

Here are the issues found in the provided Express route `/apply`:

## 1. No check if coupon exists (Null Error / App Crash)
- **Problem:** If the user enters a coupon code that does not exist in the database, `Coupon.findOne()` will return `null`. On the very next line, accessing `coupon.expiresAt` will throw a `TypeError: Cannot read properties of null` and crash the server.
- **Fix:** Add a check to verify `if (!coupon)` before accessing any property.

## 2. No validation on `amount`
- **Problem:** `req.body.amount` is directly used in calculations without checking its type or value.
  - If `amount` is missing or not a number (e.g. string), the math output will be `NaN`.
  - If `amount` is negative, it will calculate an incorrect discount.
- **Fix:** Validate that `amount` is present, is a number, and is greater than 0.

## 3. Missing `try-catch` for Async DB Call
- **Problem:** Database calls can fail due to connection issues. Since there is no `try-catch` block or error handler, any database error will result in an unhandled promise rejection and keep the request hanging.
- **Fix:** Wrap the logic in a `try-catch` block and return a 500 status code on failure.

## 4. Missing check for `code` in request body
- **Problem:** If `req.body.code` is not sent by client, `Coupon.findOne({ code: undefined })` still executes an unnecessary query to MongoDB.
- **Fix:** Check if `req.body.code` exists before querying DB.

---

## Fixed Code:

```js
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