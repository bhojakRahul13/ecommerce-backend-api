# E-commerce Backend API

This project is a RESTful backend for an e-commerce platform built with Node.js, Express, Sequelize, and MySQL.

## Features

* Customer registration and login
* JWT authentication
* Admin product management (CRUD)
* Guest cart using cart token
* Login required before checkout
* Stripe sandbox payment integration
* Request validation using Express Validator

## Tech Stack

* Node.js
* Express.js
* MySQL
* Sequelize ORM
* JWT
* Express Validator
* Stripe

## Project Setup

### Clone the repository

```bash
git clone <repository-url>
cd <project-folder>
```

### Install dependencies

```bash
npm install
```

### Create environment file

Create a `.env` file using `.env.example`.

### Run database migrations

```bash
npx sequelize-cli db:migrate
```

### Run seeders

```bash
npx sequelize-cli db:seed:all
```

### Start the server

```bash
npm run dev
```

The server will start on:

```
http://localhost:3000
```

## Environment Variables

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=
DB_USER=
DB_PASSWORD=

JWT_SECRET=
JWT_EXPIRES_IN=1d

STRIPE_SECRET_KEY=

CLIENT_URL=http://localhost:3000
```

## API Endpoints

### Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |

### Products

| Method | Endpoint          | Access |
| ------ | ----------------- | ------ |
| GET    | /api/products     | Public |
| GET    | /api/products/:id | Public |
| POST   | /api/products     | Admin  |
| PATCH  | /api/products/:id | Admin  |
| DELETE | /api/products/:id | Admin  |

### Cart

| Method | Endpoint                   | Access         |
| ------ | -------------------------- | -------------- |
| POST   | /api/cart/items            | Public         |
| GET    | /api/cart                  | Public         |
| PATCH  | /api/cart/items/:productId | Public         |
| DELETE | /api/cart/items/:productId | Public         |
| POST   | /api/cart/checkout         | Logged-in User |

## Payment

Stripe Sandbox is used for payment processing.

Test card:

```
Card Number: 4242 4242 4242 4242
Expiry Date: Any future date
CVV: Any 3 digits
ZIP: Any 5 digits
```

## Notes

* Guests can add products to their cart using a cart token.
* Authentication is required before checkout.
* Admin credentials are created using a database seeder.
* Product listing supports pagination, search, and sorting.

## Author

Rahul Bhojak

/***********************CARD***********************/

Brand	Number	CVC	Date
Visa	4242424242424242	Any 3 digits	Any future date
Visa (debit)	4000056655665556	Any 3 digits	Any future date
Mastercard	5555555555554444	Any 3 digits	Any future date
Mastercard (2-series)	2223003122003222	Any 3 digits	Any future date
Mastercard (debit)	5200828282828210	Any 3 digits	Any future date
