# Simple Todo with Auth

A full-stack todo app built with Node.js and Express. Users register or log in, receive a JSON Web Token (JWT), and use it to manage their own todo list. The frontend is a plain HTML, CSS and JavaScript page served by the same Express server.

This is a learning project and is not ready for production. See [Known limitations](#known-limitations).

## Tech stack

- **Server:** Node.js, Express 5
- **Database:** SQLite through Node's built-in `node:sqlite` module, stored in memory
- **Auth:** `jsonwebtoken` for tokens, `bcryptjs` for password hashing
- **Frontend:** static HTML and CSS in `public/`

## Getting started

You need Node.js 22.13 or newer.

1. Install the dependencies:

   ```sh
   npm install
   ```

2. Create a `.env` file in the project root:

   ```
   JWT_KEY=replace-with-a-long-random-string
   ```

3. Start the server. It restarts automatically when a file changes:

   ```sh
   npm run dev
   ```

4. Open <http://localhost:5001>.

The data is held in memory, so every restart empties the database and you need to register again.

## API

Todo routes need the token in the `Authorization` header. Send the token by itself, without a `Bearer` prefix:

```
Authorization: <token>
```

Tokens expire after 24 hours.

| Method | Path | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/auth/register` | No | `{ "username", "password" }` | Creates a user and a starter todo, then returns `{ token }` |
| `POST` | `/auth/login` | No | `{ "username", "password" }` | Returns `{ token }` |
| `GET` | `/todos` | Yes | None | Lists your todos |
| `POST` | `/todos` | Yes | `{ "task" }` | Adds a todo |
| `PUT` | `/todos/:id` | Yes | `{ "completed" }` | Updates a todo's completed status |
| `DELETE` | `/todos/:id` | Yes | None | Deletes one of your todos |

`todo.rest` has sample requests that you can run with a REST client extension in your editor.

## Project structure

```
public/                       Frontend page and styles
src/
  server.js                   Express app and route setup
  db.js                       Database connection and tables
  middleware/authMiddleware.js  Verifies the JWT on todo routes
  routes/authroutes.js        Register and login
  routes/todoroutes.js        Todo create, read, update and delete
todo.rest                     Sample API requests
```

## Known limitations

- **Any logged-in user can update any todo.** `PUT /todos/:id` doesn't check who owns the todo.
- **Old tokens stay valid until they expire.** Logging in again doesn't cancel earlier tokens, and there's no logout.
- **Restarts reset the data and reuse user IDs.** Because the database is in memory, a token from before a restart can match a new user who gets the same ID, and that token can read the new user's todos.
- **Some error responses are wrong.** A login with a missing password returns a 500, and `DELETE` reports success even if nothing was deleted.
- **`PORT` is ignored.** `src/server.js` reads lowercase `process.env.port`, so setting `PORT` in `.env` has no effect and the server uses 5001.
- **There are no automated tests.**
