# Coupon API

A RESTful API built with **Node.js, TypeScript, Express.js, and MongoDB** for creating discount coupons, managing coupon details, and applying discounts to order amounts.

The API includes input validation, duplicate coupon prevention, expiry date checks, and consistent API responses.

## Features

- **Create Coupons:** Create discount coupons with a unique code, discount percentage, and expiry date.
- **List Coupons:** Retrieve all available coupons.
- **Apply Discounts:** Apply a valid coupon to an order amount and calculate the final price.
- **Input Validation:** Validate request data and return meaningful error messages.
- **Unique Coupon Codes:** Coupon codes are stored in uppercase, making them case-insensitive (`save10` and `SAVE10` are treated as the same code).
- **Expiry Validation:** Prevent the use of expired coupons.
- **Consistent API Responses:** Centralized error handling and response utilities.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| TypeScript | Type safety |
| Express.js | REST API framework |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |

## Project Structure

```text
src/
├── controllers/
│   └── couponController.ts
├── models/
│   └── Coupon.ts
├── routes/
│   └── couponRoute.ts
├── utils/
│   └── apiUtils.ts
├── app.ts
└── index.ts
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Mrigendra2511/Coupon-Project.git
```

2. Navigate to the project directory:

```bash
cd Coupon-Project
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
```

5. Start the development server:

```bash
npm run dev
```

The API will be available at:

`http://localhost:8000`

## API Documentation

### Base URL

`http://localhost:8000`

### 1. Create a Coupon

**Endpoint:** `POST /coupons`

Creates a new discount coupon.

**Request Body:**

```json
{
  "code": "SAVE10",
  "discountPercent": 10,
  "expiresAt": "2027-12-31"
}
```

**Validation Rules:**

- `code` must be a non-empty string.
- `discountPercent` must be between 1 and 90.
- `expiresAt` must be a valid future date.
- Coupon codes must be unique.

**Success Response:** `201 Created`

Returns the newly created coupon.

### 2. Get All Coupons

**Endpoint:** `GET /coupons`

Retrieves the list of all coupons.

**Success Response:** `200 OK`

Returns the available coupon records.

### 3. Apply a Coupon

**Endpoint:** `POST /coupons/apply`

Applies a discount coupon to an order amount.

**Request Body:**

```json
{
  "code": "SAVE10",
  "amount": 1000
}
```

**Success Response:** `200 OK`

```json
{
  "originalAmount": 1000,
  "discountPercent": 10,
  "finalAmount": 900
}
```

The final amount is rounded to two decimal places.

**Validation Rules:**

- Coupon code must exist.
- Coupon must not be expired.
- Amount must be a valid, non-negative number.
- Amount must not exceed 1 trillion.

## Error Handling

| Status Code | Description |
|---|---|
| 400 | Missing or invalid request data |
| 400 | Expiry date is not in the future |
| 400 | Coupon code already exists |
| 400 | Coupon has expired |
| 400 | Invalid or out-of-range order amount |
| 404 | Coupon code does not exist |

## Testing with cURL

**Create a coupon:**

```bash
curl -X POST http://localhost:8000/coupons \
-H "Content-Type: application/json" \
-d '{"code":"SAVE10","discountPercent":10,"expiresAt":"2027-12-31"}'
```

**Apply a coupon:**

```bash
curl -X POST http://localhost:8000/coupons/apply \
-H "Content-Type: application/json" \
-d '{"code":"SAVE10","amount":1000}'
```

## Future Improvements

- Add authentication and authorization.
- Implement automated API tests.
- Introduce coupon usage limits.
- Add minimum order amount restrictions.
- Implement pagination for coupon listing.
- Build a frontend interface.
- Deploy the API to a cloud platform.

## Author

**Mrigendra Mohak Saxena**

- GitHub: [@Mrigendra2511](https://github.com/Mrigendra2511)
- LinkedIn: [Mrigendra Mohak Saxena](https://www.linkedin.com/in/mrigendra-mohak-saxena-48749a278/)

---

*Built as a backend project to practice REST API development, TypeScript, Express.js, and MongoDB.*