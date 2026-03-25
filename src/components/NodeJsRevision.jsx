import { useState, useEffect } from 'react';

import { useAuth } from '../context/AuthContext';
import { saveProgress, getProgress } from "../services/axiosConfig.js"
import LoginPage from './LoginPage.jsx';


const courseData = [
  {
    id: 1,
    title: "Node.js Fundamentals",
    emoji: "🟢",
    color: "#22c55e",
    topics: [
      {
        name: "What is Node.js?",
        notes: [
          "Node.js is a runtime that lets you run JavaScript outside the browser — on your server/computer.",
          "It's built on Chrome's V8 engine and uses an event-driven, non-blocking I/O model.",
          "Single-threaded but handles thousands of requests using the Event Loop."
        ],
        example: `// Simple Node.js script
console.log("Hello from Node!");

// Node can read files, make HTTP requests, etc.
const os = require('os');
console.log("Platform:", os.platform());
console.log("Free memory:", os.freemem());`,
        task: "Create a file `info.js` that prints your OS platform, total memory, and current date/time to the console.",
        solution: `const os = require('os');
const date = new Date();

console.log("Platform:", os.platform());
console.log("Total Memory:", (os.totalmem() / 1024 / 1024 / 1024).toFixed(2), "GB");
console.log("Date & Time:", date.toLocaleString());`
      },
      {
        name: "Modules & require()",
        notes: [
          "Node uses CommonJS modules. Every file is its own module.",
          "Use `require()` to import, `module.exports` to export.",
          "Built-in modules: fs, path, os, http, events — no install needed."
        ],
        example: `// math.js - exporting
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
module.exports = { add, subtract };

// app.js - importing
const math = require('./math');
console.log(math.add(5, 3));    // 8
console.log(math.subtract(5, 3)); // 2`,
        task: "Create a `greet.js` module that exports a `greet(name)` function. Import and use it in `app.js`.",
        solution: `// greet.js
function greet(name) {
  return \`Hello, \${name}! Welcome to Node.js.\`;
}
module.exports = { greet };

// app.js
const { greet } = require('./greet');
console.log(greet("Abdul Rab")); // Hello, Abdul Rab! Welcome to Node.js.`
      },
      {
        name: "File System (fs module)",
        notes: [
          "`fs` module lets you read, write, delete files.",
          "Use `fs.readFileSync()` for synchronous (blocking) and `fs.readFile()` for async.",
          "Always handle errors in async operations."
        ],
        example: `const fs = require('fs');

// Write a file
fs.writeFileSync('note.txt', 'Hello World!');

// Read a file (sync)
const data = fs.readFileSync('note.txt', 'utf-8');
console.log(data); // Hello World!

// Read async (non-blocking)
fs.readFile('note.txt', 'utf-8', (err, data) => {
  if (err) throw err;
  console.log(data);
});`,
        task: "Write a script that creates a file `log.txt`, writes 'Server started at [current time]' to it, then reads and prints it.",
        solution: `const fs = require('fs');
const time = new Date().toLocaleString();

fs.writeFileSync('log.txt', \`Server started at \${time}\`);

const content = fs.readFileSync('log.txt', 'utf-8');
console.log(content);`
      }
    ]
  },
  {
    id: 2,
    title: "HTTP & Express Basics",
    emoji: "🚀",
    color: "#3b82f6",
    topics: [
      {
        name: "Creating HTTP Server (raw Node)",
        notes: [
          "Node's `http` module lets you create a server without any framework.",
          "Every request has `req` (request info) and `res` (what you send back).",
          "This is what Express.js wraps and simplifies."
        ],
        example: `const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!');
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});`,
        task: "Create a raw Node HTTP server that returns different messages for `/` and `/about` routes.",
        solution: `const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  
  if (req.url === '/') {
    res.end('Welcome to Home Page!');
  } else if (req.url === '/about') {
    res.end('This is the About Page!');
  } else {
    res.writeHead(404);
    res.end('Page Not Found');
  }
});

server.listen(3000, () => console.log('Running on port 3000'));`
      },
      {
        name: "Express.js Setup & Routing",
        notes: [
          "Express is a minimal framework on top of Node's http module.",
          "Install: `npm install express`",
          "Routes follow the pattern: `app.METHOD(PATH, HANDLER)`"
        ],
        example: `const express = require('express');
const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello Express!');
});

app.get('/users', (req, res) => {
  res.json({ users: ['Abdul', 'Ali', 'Ahmed'] });
});

app.listen(3000, () => console.log('Server on port 3000'));`,
        task: "Create an Express app with routes: GET `/`, GET `/books` (returns 3 book titles as JSON), GET `/books/:id` (returns book by id).",
        solution: `const express = require('express');
const app = express();
app.use(express.json());

const books = [
  { id: 1, title: "Clean Code" },
  { id: 2, title: "You Don't Know JS" },
  { id: 3, title: "Node.js Design Patterns" }
];

app.get('/', (req, res) => res.send('Books API'));

app.get('/books', (req, res) => res.json(books));

app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ msg: 'Book not found' });
  res.json(book);
});

app.listen(3000, () => console.log('Running on 3000'));`
      },
      {
        name: "Request Object (req). Use Postman or Thunder Client now",
        notes: [
          "`req.params` — URL parameters like `/users/:id`",
          "`req.query` — Query strings like `/search?name=node`",
          "`req.body` — Request body (POST/PUT). Needs `express.json()` middleware."
        ],
        example: `app.get('/search', (req, res) => {
  const { name } = req.query; // /search?name=Abdul
  res.json({ searching: name });
});

app.get('/user/:id', (req, res) => {
  const { id } = req.params; // /user/42
  res.json({ userId: id });
});

app.post('/user', (req, res) => {
  const { name, email } = req.body; // JSON body
  res.json({ created: { name, email } });
});`,
        task: "Create a route GET `/filter` that accepts `?genre=fiction&year=2020` query params and returns them in a JSON response.",
        solution: `app.get('/filter', (req, res) => {
  const { genre, year } = req.query;
  res.json({
    message: "Filter applied",
    filters: { genre, year }
  });
});
// Test: GET /filter?genre=fiction&year=2020`
      }
    ]
  },
  {
    id: 3,
    title: "Middleware",
    emoji: "🔗",
    color: "#f59e0b",
    topics: [
      {
        name: "What is Middleware?",
        notes: [
          "Middleware = functions that run BETWEEN the request and response.",
          "It has access to `req`, `res`, and `next()` (calls the next middleware).",
          "Use cases: logging, auth checks, parsing body, error handling."
        ],
        example: `// Custom logger middleware
const logger = (req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next(); // MUST call next() or request hangs!
};

app.use(logger); // Apply to ALL routes

app.get('/', (req, res) => {
  res.send('Home');
});`,
        task: "Create a middleware that logs method, URL, and time for every request. Apply it globally.",
        solution: `const express = require('express');
const app = express();

const logger = (req, res, next) => {
  const time = new Date().toLocaleTimeString();
  console.log(\`[\${time}] \${req.method} \${req.url}\`);
  next();
};

app.use(logger);

app.get('/', (req, res) => res.send('Hello!'));
app.listen(3000);`
      },
      {
        name: "Auth Middleware (protect routes)",
        notes: [
          "You can apply middleware to specific routes only.",
          "Check for a token/header, if missing → reject with 401.",
          "This is the pattern used in JWT authentication."
        ],
        example: `// Auth middleware
const protect = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ msg: 'No token, access denied' });
  }
  // In real app: verify JWT here
  next();
};

// Apply only to protected routes
app.get('/dashboard', protect, (req, res) => {
  res.json({ data: 'Secret dashboard data' });
});

app.get('/public', (req, res) => {
  res.send('Anyone can see this');
});`,
        task: "Create a middleware `checkApiKey` that checks for header `x-api-key: mysecret123`. Protect a `/private` route with it.",
        solution: `const checkApiKey = (req, res, next) => {
  const key = req.headers['x-api-key'];
  if (key !== 'mysecret123') {
    return res.status(403).json({ msg: 'Invalid API Key' });
  }
  next();
};

app.get('/private', checkApiKey, (req, res) => {
  res.json({ secret: 'Top secret data!' });
});`
      },
      {
        name: "Error Handling Middleware",
        notes: [
          "Express error middleware takes 4 params: `(err, req, res, next)`.",
          "Place it LAST after all routes.",
          "Use `next(err)` anywhere to pass errors to it."
        ],
        example: `// Throw error from route
app.get('/crash', (req, res, next) => {
  const err = new Error('Something broke!');
  err.status = 500;
  next(err); // Pass to error handler
});

// Error handler (4 params — MUST have all 4)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.message
  });
});`,
        task: "Create a route that throws a custom error 'Book not found' with status 404, and a global error handler that returns it as JSON.",
        solution: `app.get('/book/99', (req, res, next) => {
  const err = new Error('Book not found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    error: err.message
  });
});`
      }
    ]
  },
  {
    id: 4,
    title: "REST API Design",
    emoji: "📡",
    color: "#8b5cf6",
    topics: [
      {
        name: "CRUD with Express",
        notes: [
          "CRUD = Create, Read, Update, Delete → maps to POST, GET, PUT/PATCH, DELETE.",
          "This is the foundation of any REST API like your bookstore project.",
          "Use proper HTTP status codes: 200 OK, 201 Created, 404 Not Found, 400 Bad Request."
        ],
        example: `let books = [{ id: 1, title: "Clean Code", author: "Martin" }];
let nextId = 2;

// READ all
app.get('/books', (req, res) => res.json(books));

// READ one
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).json({ msg: 'Not found' });
  res.json(book);
});

// CREATE
app.post('/books', (req, res) => {
  const book = { id: nextId++, ...req.body };
  books.push(book);
  res.status(201).json(book);
});

// UPDATE
app.put('/books/:id', (req, res) => {
  const idx = books.findIndex(b => b.id == req.params.id);
  if (idx === -1) return res.status(404).json({ msg: 'Not found' });
  books[idx] = { ...books[idx], ...req.body };
  res.json(books[idx]);
});

// DELETE
app.delete('/books/:id', (req, res) => {
  books = books.filter(b => b.id != req.params.id);
  res.json({ msg: 'Deleted' });
});`,
        task: "Build a complete CRUD API for a 'todos' resource. Each todo: `{ id, title, completed }`. All 5 routes.",
        solution: `let todos = [{ id: 1, title: 'Learn Node', completed: false }];
let nextId = 2;

app.get('/todos', (req, res) => res.json(todos));

app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  if (!todo) return res.status(404).json({ msg: 'Not found' });
  res.json(todo);
});

app.post('/todos', (req, res) => {
  const todo = { id: nextId++, completed: false, ...req.body };
  todos.push(todo);
  res.status(201).json(todo);
});

app.put('/todos/:id', (req, res) => {
  const idx = todos.findIndex(t => t.id == req.params.id);
  if (idx === -1) return res.status(404).json({ msg: 'Not found' });
  todos[idx] = { ...todos[idx], ...req.body };
  res.json(todos[idx]);
});

app.delete('/todos/:id', (req, res) => {
  todos = todos.filter(t => t.id != req.params.id);
  res.json({ msg: 'Todo deleted' });
});`
      },
      {
        name: "Express Router (organize routes)",
        notes: [
          "As your app grows, put routes in separate files using `express.Router()`.",
          "This is how your bookstore project should be structured.",
          "Keeps code clean and follows separation of concerns."
        ],
        example: `// routes/books.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ books: [] }));
router.post('/', (req, res) => res.json({ msg: 'Created' }));

module.exports = router;

// app.js (main file)
const bookRoutes = require('./routes/books');
app.use('/books', bookRoutes);
// Now GET /books → hits router.get('/')`,
        task: "Refactor your todos API into a separate `routes/todos.js` file using express.Router, and mount it in `app.js`.",
        solution: `// routes/todos.js
const express = require('express');
const router = express.Router();
let todos = [];

router.get('/', (req, res) => res.json(todos));
router.post('/', (req, res) => {
  const todo = { id: Date.now(), ...req.body };
  todos.push(todo);
  res.status(201).json(todo);
});

module.exports = router;

// app.js
const todoRoutes = require('./routes/todos');
app.use('/todos', todoRoutes);`
      }
    ]
  },
  {
    id: 5,
    title: "PostgreSQL & Sequelize",
    emoji: "🐘",
    color: "#336791",
    topics: [
      {
        name: "Connect to PostgreSQL",
        notes: [
          "Sequelize is an ORM (Object Relational Mapping) library for SQL databases including PostgreSQL.",
          "Install: `npm install sequelize pg pg-hstore`",
          "Always connect and authenticate before starting the server."
        ],
        example: `const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mybookstore', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

sequelize.authenticate()
  .then(() => console.log('PostgreSQL connected!'))
  .catch(err => console.log('Connection error:', err));

// In real apps, use .env file
// new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS)`,
        task: "Create an Express app that connects to PostgreSQL and logs 'DB Connected' then 'Server Started'.",
        solution: `const express = require('express');
const { Sequelize } = require('sequelize');

const app = express();
app.use(express.json());

const sequelize = new Sequelize('testdb', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

sequelize.authenticate()
  .then(() => {
    console.log('DB Connected');
    app.listen(3000, () => console.log('Server Started'));
  })
  .catch(err => console.log(err));`
      },
      {
        name: "Schema & Model",
        notes: [
          "Model = defines the table structure (like a blueprint for a SQL table).",
          "Sequelize auto-creates/syncs tables using `sequelize.sync()`.",
          "Sequelize validates and maps JS objects to SQL rows automatically."
        ],
        example: `const { Sequelize, DataTypes } = require('sequelize');

// 1. Define Model (acts as Schema + Model combined)
const Book = sequelize.define('Book', {
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, defaultValue: 0 },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

// 2. Sync model with DB (creates table if not exists)
await sequelize.sync();

// 3. Use it
const newBook = await Book.create({ title: 'Clean Code', author: 'Martin' });`,
        task: "Create a Sequelize model for a `User` with: name (required), email (required, unique), age (integer), createdAt (auto date).",
        solution: `const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  age: { type: DataTypes.INTEGER },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

await sequelize.sync();
module.exports = User;`
      },
      {
        name: "CRUD with Sequelize",
        notes: [
          "Create: `Model.create(data)`",
          "Read: `Model.findAll()`, `Model.findByPk(id)`",
          "Update: `Model.update(data, { where: { id } })` or instance `.save()`",
          "Delete: `Model.destroy({ where: { id } })`"
        ],
        example: `// CREATE
app.post('/books', async (req, res) => {
  const book = await Book.create(req.body);
  res.status(201).json(book);
});

// READ
app.get('/books', async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
});

// UPDATE
app.put('/books/:id', async (req, res) => {
  await Book.update(req.body, { where: { id: req.params.id } });
  const book = await Book.findByPk(req.params.id);
  res.json(book);
});

// DELETE
app.delete('/books/:id', async (req, res) => {
  await Book.destroy({ where: { id: req.params.id } });
  res.json({ msg: 'Deleted' });
});`,
        task: "Build a full CRUD API for books using Sequelize. Wrap DB calls in try/catch for error handling.",
        solution: `app.post('/books', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/books/:id', async (req, res) => {
  try {
    const [updated] = await Book.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ msg: 'Not found' });
    const book = await Book.findByPk(req.params.id);
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    await Book.destroy({ where: { id: req.params.id } });
    res.json({ msg: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});`
      }
    ]
  },
  {
    id: 6,
    title: "Authentication (JWT)",
    emoji: "🔐",
    color: "#ef4444",
    topics: [
      {
        name: "JWT Auth Flow",
        notes: [
          "JWT = JSON Web Token. It's like a digital ID card — server gives it on login, you show it on every request.",
          "No sessions needed — the token itself contains user info (like userId).",
          "Install: `npm install jsonwebtoken bcryptjs`",
          "Token has 3 parts: Header (algo) . Payload (data) . Signature (verification) — all base64 encoded.",
          "Always store JWT_SECRET in .env — never hardcode it in your code.",
          "Common expiry values: '1h' for short sessions, '7d' for remember me.",
          "If token is expired or tampered → `jwt.verify()` throws an error automatically."
        ],
        example: `const jwt = require('jsonwebtoken');

// ✅ GENERATE TOKEN (on login)
const token = jwt.sign(
  { userId: 5, email: 'abdul@example.com' },  // payload (what to store)
  process.env.JWT_SECRET,                      // secret key
  { expiresIn: '7d' }                          // expires in 7 days
);

// ✅ VERIFY TOKEN (on protected routes)
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded.userId);   // 5
  console.log(decoded.email);    // abdul@example.com
} catch (err) {
  console.log('Token invalid or expired!');
}

// ❌ If someone changes the token → verify throws error
// ❌ If token expired → verify throws error`,
        task: "Write two functions: `generateToken(userId, email)` that creates a JWT valid for 7 days, and `verifyToken(token)` that returns decoded data or null if invalid. Test both.",
        solution: `const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate token
function generateToken(userId, email) {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify token safely
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null; // token invalid or expired
  }
}

// Test it
const token = generateToken(5, 'abdul@example.com');
console.log('Token:', token);

const decoded = verifyToken(token);
console.log('UserId:', decoded?.userId);   // 5
console.log('Email:', decoded?.email);     // abdul@example.com

const bad = verifyToken('faktoken123');
console.log('Bad token result:', bad);     // null`
      },
      {
        name: "Register & Login Routes",
        notes: [
          "NEVER store plain passwords in DB — always hash with bcrypt before saving.",
          "`bcrypt.hash(password, 10)` → converts 'mypass123' to a random long string.",
          "`bcrypt.compare(inputPassword, storedHash)` → checks if they match (returns true/false).",
          "On login: find user by email → compare password → if match, send JWT token.",
          "For PostgreSQL, use Sequelize `User.findOne({ where: { email } })` instead of MongoDB's `findOne({ email })`.",
          "The `protect` middleware runs before protected routes — it checks the token and adds `req.user`.",
          "Authorization header format: `Bearer eyJhbGci...` — always split by space to get the token part.",
          "Use `.select` or exclude password field when attaching user to `req.user` — never send password to frontend."
        ],
        example: `const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Sequelize model

// ✅ REGISTER
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Hash the password (10 = salt rounds, higher = slower but safer)
  const hashed = await bcrypt.hash(password, 10);

  // Save to PostgreSQL
  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({ msg: 'User created', userId: user.id });
});

// ✅ LOGIN
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find user in PostgreSQL
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

  // Compare entered password with hashed DB password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

  // Generate token with userId
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token });
});`,
        task: "Write the `protect` middleware that reads `Authorization: Bearer <token>`, verifies JWT, finds the user from PostgreSQL by decoded userId, and attaches them to `req.user`. Use it to protect a `/me` route.",
        solution: `const protect = async (req, res, next) => {
  // Step 1: Get the header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  // Step 2: Extract token (remove "Bearer " prefix)
  const token = authHeader.split(' ')[1];

  try {
    // Step 3: Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 4: Get user from PostgreSQL (exclude password)
    const user = await User.findOne({
      where: { id: decoded.userId },
      attributes: { exclude: ['password'] }  // don't send password
    });

    if (!user) return res.status(401).json({ msg: 'User not found' });

    req.user = user;  // attach user to request
    next();           // move to next handler

  } catch (err) {
    res.status(401).json({ msg: 'Token invalid or expired' });
  }
};

// Protect a route — protect runs first, then handler
app.get('/me', protect, (req, res) => {
  res.json(req.user);  // returns logged in user's data
});

// Protect any route the same way
app.get('/dashboard', protect, (req, res) => {
  res.json({ msg: \`Welcome \${req.user.name}!\` });
});`
      }
    ]
  },
  {
    id: 7,
    title: "Project Structure & Best Practices",
    emoji: "🏗️",
    color: "#6366f1",
    topics: [
      {
        name: "Professional Folder Structure",
        notes: [
          "Good structure = each file has one job. Routes define paths, Controllers have logic, Models define DB tables.",
          "MVC Pattern: Model (DB) → Controller (logic) → Route (URL mapping).",
          "Never write DB queries directly inside route files — move them to controllers.",
          "config/db.js handles the Sequelize connection — import it once in app.js.",
          "middleware/ folder holds reusable functions like `protect` (JWT check), error handler, etc.",
          "Keeping models in separate files makes it easy to add relationships (User has many Posts, etc.).",
          "In PostgreSQL projects, also add a `migrations/` folder for DB schema changes over time."
        ],
        example: `my-api/
├── config/
│   └── db.js               // Sequelize connection setup
├── controllers/
│   └── bookController.js   // All book-related logic
├── models/
│   └── Book.js             // Sequelize model (table definition)
├── routes/
│   └── bookRoutes.js       // URL → controller mapping
├── middleware/
│   └── auth.js             // JWT protect middleware
├── .env                    // DB credentials, JWT secret
├── .gitignore              // ignore node_modules, .env
└── app.js                  // Entry point

// ✅ bookController.js — logic lives here
const { Book } = require('../models');

exports.getAllBooks = async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
};

exports.createBook = async (req, res) => {
  const book = await Book.create(req.body);
  res.status(201).json(book);
};

// ✅ bookRoutes.js — only URL mapping
const router = require('express').Router();
const { getAllBooks, createBook } = require('../controllers/bookController');

router.get('/', getAllBooks);
router.post('/', createBook);

module.exports = router;`,
        task: "Refactor a books API into MVC structure using PostgreSQL/Sequelize. Separate: DB config, Book model, book controller (getBooks + createBook), book routes, and wire it all in app.js.",
        solution: `// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  { host: 'localhost', dialect: 'postgres' }
);

module.exports = sequelize;

// models/Book.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Book = sequelize.define('Book', {
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Book;

// controllers/bookController.js
const Book = require('../models/Book');

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// routes/bookRoutes.js
const router = require('express').Router();
const { getBooks, createBook } = require('../controllers/bookController');

router.get('/', getBooks);
router.post('/', createBook);

module.exports = router;

// app.js
require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
app.use(express.json());
app.use('/books', bookRoutes);

sequelize.sync()  // creates tables if not exist
  .then(() => app.listen(process.env.PORT, () => {
    console.log('Server started on port', process.env.PORT);
  }));`
      },
      {
        name: "Environment Variables (.env)",
        notes: [
          "Never hardcode DB password, JWT secret, or port in your code — use .env file.",
          "Install: `npm install dotenv` then call `require('dotenv').config()` at the very top of app.js.",
          "ALWAYS add `.env` to `.gitignore` — if you push it to GitHub, your secrets are exposed.",
          "For PostgreSQL you need: DB_NAME, DB_USER, DB_PASS, DB_HOST in .env.",
          "`process.env.KEY` is how you read .env values anywhere in your code.",
          "If a .env value is missing, your app can crash silently — always provide fallback with `|| default`.",
          "In production (deployment), set env variables in the hosting platform (Railway, Render, etc.) — not in .env file."
        ],
        example: `// .env file — never commit this!
PORT=3000
DB_NAME=bookstore
DB_USER=postgres
DB_PASS=yourpassword
DB_HOST=localhost
JWT_SECRET=supersecretkey123

// app.js — must be FIRST line
require('dotenv').config();

const port = process.env.PORT || 3000;       // fallback to 3000
const dbName = process.env.DB_NAME;
const jwtSecret = process.env.JWT_SECRET;

console.log('Port:', port);       // 3000
console.log('DB:', dbName);       // bookstore

// config/db.js — uses env vars for Sequelize
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false   // disables SQL query logs in terminal
  }
);

module.exports = sequelize;`,
        task: "Set up dotenv in a PostgreSQL project. Move PORT, DB_NAME, DB_USER, DB_PASS, DB_HOST and JWT_SECRET to .env. Use them in app.js and config/db.js. Add .env to .gitignore.",
        solution: `// .env
PORT=3000
DB_NAME=bookstore
DB_USER=postgres
DB_PASS=mypassword
DB_HOST=localhost
JWT_SECRET=myverysecretjwtkey

// .gitignore
node_modules
.env

// config/db.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
  }
);

module.exports = sequelize;

// app.js
require('dotenv').config();  // must be first!
const express = require('express');
const sequelize = require('./config/db');

const app = express();
app.use(express.json());

sequelize.authenticate()
  .then(() => console.log('DB Connected'))
  .catch(err => console.log('DB Error:', err));

app.listen(process.env.PORT || 3000, () => {
  console.log(\`Server running on port \${process.env.PORT}\`);
});`
      }
    ]
  }
];

export default function NodeRevisionCourse() {
  const [activeModule, setActiveModule] = useState(0);
  const [activeTopic, setActiveTopic] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [activeTab, setActiveTab] = useState("notes");

  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(true);



  const module = courseData[activeModule];
  const topic = module.topics[activeTopic];
  const topicKey = `${activeModule}-${activeTopic}`;

  const markDone = () => {
    setCompletedTopics(prev => new Set([...prev, topicKey]));
  };

  const totalTopics = courseData.reduce((a, m) => a + m.topics.length, 0);
  const progress = Math.round((completedTopics.size / totalTopics) * 100);



  // Load progress from backend on login
  useEffect(() => {
    if (user) {
      getProgress().then(res => {
        const { module_index, topic_index, completed_topics } = res.data;
        setActiveModule(module_index);
        setActiveTopic(topic_index);
        setCompletedTopics(new Set(completed_topics ? completed_topics.split(',') : []));
      });
    }
  }, [user]);

  // Save progress whenever something changes
  useEffect(() => {
    if (user) {
      saveProgress({
        module_index: activeModule,
        topic_index: activeTopic,
        completed_topics: [...completedTopics].join(',')
      });
    }
  }, [activeModule, activeTopic, completedTopics]);

  // Show login page first
  if (showLogin && !user) {
    return <LoginPage onGuest={() => setShowLogin(false)} />;
  }


  return (
    <div style={{ fontFamily: "'Fira Code', 'Courier New', monospace", background: "#0f1117", minHeight: "100vh", color: "#e2e8f0" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a1d2e 0%, #0f1117 100%)",
        borderBottom: "1px solid #1e2330",
        padding: "16px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <style>{`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulseGreen { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    .header-btn:hover { background: #1e2330 !important; border-color: #4ade80 !important; color: #4ade80 !important; transform: translateY(-1px); }
    .logout-btn:hover { background: #2d1f1f !important; border-color: #f87171 !important; color: #f87171 !important; transform: translateY(-1px); }
    .header-btn, .logout-btn { transition: all 0.2s ease !important; }
    .user-chip:hover { background: #252836 !important; }
    .user-chip { transition: background 0.2s ease !important; }
  `}</style>

        {/* Left — Title */}
        <div style={{ animation: "fadeIn 0.5s ease" }}>
          <div style={{ fontSize: "11px", color: "#4ade80", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "2px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", animation: "pulseGreen 2s infinite" }} />
      // Abdul Rab's
          </div>
          <div style={{ fontSize: "22px", fontWeight: "bold", color: "#fff" }}>
            Node.js, Express & PostgreSQL Revision
          </div>
        </div>

        {/* Right */}
        <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: "20px", animation: "fadeIn 0.5s ease 0.1s both" }}>

          {/* Progress */}
          <div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "6px" }}>
              {completedTopics.size}/{totalTopics} topics done
            </div>
            <div style={{ width: "160px", height: "6px", background: "#1e2330", borderRadius: "3px" }}>
              <div style={{
                width: `${progress}%`, height: "100%",
                background: "linear-gradient(90deg, #4ade80, #22c55e)",
                borderRadius: "3px", transition: "width 0.6s ease"
              }} />
            </div>
            <div style={{ fontSize: "10px", color: "#4ade80", marginTop: "4px" }}>{progress}% complete</div>
          </div>

          {/* Auth section */}
          {user ? (
            // Logged in — show username + logout
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div className="user-chip" style={{
                display: "flex", alignItems: "center", gap: "7px",
                background: "#1a1d2e", border: "1px solid #1e2330",
                padding: "5px 12px", borderRadius: "20px", cursor: "default"
              }}>
                <span style={{ fontSize: "14px" }}>👤</span>
                <span style={{ fontSize: "12px", color: "#e2e8f0", fontWeight: "600" }}>{user.username}</span>
              </div>
              <button
                className="logout-btn"
                onClick={logout}
                style={{
                  padding: "6px 14px", background: "transparent",
                  border: "1px solid #334155", borderRadius: "6px",
                  color: "#94a3b8", cursor: "pointer", fontSize: "12px"
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            // Guest — show login button
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                fontSize: "11px", color: "#ffffff",
                background: "#1a1d2e", border: "1px solid #1e2330",
                padding: "4px 10px", borderRadius: "20px"
              }}>
                Guest Mode
              </div>
              <button
                className="header-btn"
                onClick={() => setShowLogin(true)}
                style={{
                  padding: "6px 16px", background: "transparent",
                  border: "1px solid #4ade80", borderRadius: "6px",
                  color: "#4ade80", cursor: "pointer", fontSize: "12px", fontWeight: "600"
                }}
              >
                Login →
              </button>
            </div>
          )}

        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 70px)" }}>
        {/* Sidebar */}
        <div style={{ width: "240px", borderRight: "1px solid #1e2330", overflowY: "auto", padding: "12px 0" }}>
          {courseData.map((mod, mIdx) => (
            <div key={mIdx}>
              <div
                onClick={() => { setActiveModule(mIdx); setActiveTopic(0); setShowSolution(false); setActiveTab("notes"); }}
                style={{
                  padding: "10px 16px",
                  cursor: "pointer",
                  background: activeModule === mIdx ? "#1e2330" : "transparent",
                  borderLeft: activeModule === mIdx ? `3px solid ${mod.color}` : "3px solid transparent",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: "600", color: activeModule === mIdx ? "#fff" : "#94a3b8" }}>
                  {/* {mod.emoji}  */}
                  {mod.title}
                </div>
                <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>
                  {mod.topics.length} topics
                </div>
              </div>
              {activeModule === mIdx && mod.topics.map((t, tIdx) => (
                <div
                  key={tIdx}
                  onClick={() => { setActiveTopic(tIdx); setShowSolution(false); setActiveTab("notes"); }}
                  style={{
                    padding: "7px 16px 7px 28px",
                    cursor: "pointer",
                    background: activeTopic === tIdx ? "#252836" : "transparent",
                    display: "flex", alignItems: "center", gap: "6px"
                  }}
                >
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: completedTopics.has(`${mIdx}-${tIdx}`) ? "#4ade80" : activeTopic === tIdx ? mod.color : "#334155", flexShrink: 0 }} />
                  <span style={{ fontSize: "11px", color: activeTopic === tIdx ? "#e2e8f0" : "#64748b", lineHeight: "1.3" }}>{t.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          <div style={{ maxWidth: "800px" }}>
            {/* Topic header */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", color: module.color, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>
                {module.emoji} {module.title}
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#fff", margin: 0 }}>{topic.name}</h2>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "4px", marginBottom: "20px", borderBottom: "1px solid #1e2330", paddingBottom: "0" }}>
              {["notes", "example", "task"].map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); if (tab !== "task") setShowSolution(false); }}
                  style={{
                    padding: "8px 16px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: activeTab === tab ? module.color : "#64748b",
                    borderBottom: activeTab === tab ? `2px solid ${module.color}` : "2px solid transparent",
                    fontSize: "13px",
                    fontWeight: activeTab === tab ? "600" : "400",
                    marginBottom: "-1px",
                    transition: "all 0.2s",
                    textTransform: "capitalize"
                  }}
                >
                  {tab === "notes" ? " Notes" : tab === "example" ? " Example" : " Task"}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "notes" && (
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                  {topic.notes.map((note, i) => (
                    <div key={i} style={{ display: "flex", gap: "12px", padding: "12px 16px", background: "#1a1d2e", borderRadius: "8px", border: "1px solid #1e2330" }}>
                      <span style={{ color: module.color, fontWeight: "bold", flexShrink: 0 }}>→</span>
                      <span style={{ fontSize: "14px", lineHeight: "1.6", color: "#cbd5e1", fontFamily: "system-ui, sans-serif" }}>{note}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab("example")} style={{ padding: "10px 20px", background: module.color, border: "none", borderRadius: "6px", color: "#000", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>
                  See Example →
                </button>
              </div>
            )}

            {activeTab === "example" && (
              <div>
                <pre style={{ background: "#1a1d2e", border: "1px solid #1e2330", borderRadius: "10px", padding: "20px", fontSize: "12.5px", lineHeight: "1.7", overflowX: "auto", color: "#a5f3fc", whiteSpace: "pre-wrap" }}>
                  <code>{topic.example}</code>
                </pre>
                <button onClick={() => setActiveTab("task")} style={{ marginTop: "16px", padding: "10px 20px", background: module.color, border: "none", borderRadius: "6px", color: "#000", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>
                  Try the Task →
                </button>
              </div>
            )}

            {activeTab === "task" && (
              <div>
                <div style={{ background: "#1a1d2e", border: `1px solid ${module.color}30`, borderLeft: `3px solid ${module.color}`, borderRadius: "8px", padding: "16px 20px", marginBottom: "20px" }}>
                  <div style={{ fontSize: "11px", color: module.color, letterSpacing: "2px", marginBottom: "8px" }}>YOUR TASK</div>
                  <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.7", color: "#e2e8f0", fontFamily: "system-ui, sans-serif" }}>{topic.task}</p>
                </div>

                <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    style={{ padding: "10px 20px", background: showSolution ? "#334155" : "#1e2330", border: "1px solid #334155", borderRadius: "6px", color: "#e2e8f0", cursor: "pointer", fontSize: "13px" }}
                  >
                    {showSolution ? "Hide Solution" : " Show Solution"}
                  </button>
                  <button
                    onClick={markDone}
                    style={{
                      padding: "10px 20px",
                      background: completedTopics.has(topicKey) ? "#166534" : module.color,
                      border: "none", borderRadius: "6px",
                      color: completedTopics.has(topicKey) ? "#4ade80" : "#000",
                      cursor: "pointer", fontSize: "13px", fontWeight: "600"
                    }}
                  >
                    {completedTopics.has(topicKey) ? "✅ Completed!" : "Mark as Done"}
                  </button>
                </div>

                {showSolution && (
                  <div>
                    <div style={{ fontSize: "11px", color: "#4ade80", letterSpacing: "2px", marginBottom: "8px" }}>// SOLUTION</div>
                    <pre style={{ background: "#0d1f12", border: "1px solid #166534", borderRadius: "10px", padding: "20px", fontSize: "12.5px", lineHeight: "1.7", overflowX: "auto", color: "#86efac", whiteSpace: "pre-wrap" }}>
                      <code>{topic.solution}</code>
                    </pre>
                  </div>
                )}

                {/* Navigation */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #1e2330" }}>
                  <button
                    onClick={() => {
                      if (activeTopic > 0) { setActiveTopic(activeTopic - 1); setShowSolution(false); setActiveTab("notes"); }
                      else if (activeModule > 0) { setActiveModule(activeModule - 1); setActiveTopic(courseData[activeModule - 1].topics.length - 1); setShowSolution(false); setActiveTab("notes"); }
                    }}
                    style={{ padding: "8px 16px", background: "#1e2330", border: "1px solid #334155", borderRadius: "6px", color: "#94a3b8", cursor: "pointer", fontSize: "13px" }}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => {
                      if (activeTopic < module.topics.length - 1) { setActiveTopic(activeTopic + 1); setShowSolution(false); setActiveTab("notes"); }
                      else if (activeModule < courseData.length - 1) { setActiveModule(activeModule + 1); setActiveTopic(0); setShowSolution(false); setActiveTab("notes"); }
                    }}
                    style={{ padding: "8px 16px", background: module.color, border: "none", borderRadius: "6px", color: "#000", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
                  >
                    Next Topic →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}