# One-Line Server Challenge

Everything about this app looks fine. The pages load, the styling is right,
the database is connected, the roster works.

**But the "Check me in" button doesn't work.**

Your job: find out why, and fix it. The fix is **one word, on one line.**

---

## Run it

```bash
npm install
npm start
```

Open <http://localhost:3000>, click the button, fill in the form, submit.

---

## The challenge

1. Reproduce it — submit the form and read the error page.
2. Work out **where** in the stack it breaks. The request leaves the browser
   and travels down through the layers. How far does it get?
3. Fix it. One word.
4. Prove it — the roster should show your name.

**Do not** rewrite the client, add routes, or change the controller. If your
fix is longer than one word, it is not the intended fix.

---

## Hints, if you need them

<details>
<summary>Hint 1 — where to look first</summary>

The error page tells you the server *answered*. So the server is running and
the path exists. Something about the request didn't match what the server
expected. Open DevTools / Network and click the failed request.
</details>

<details>
<summary>Hint 2 — narrowing it down</summary>

A request is matched on **two** things, not one. The error page names both of
them. Which one does the browser send, and where in the server is the other
one declared?
</details>

<details>
<summary>Hint 3 — the file</summary>

Everything the request passes through is listed in the layer map below. Only
one layer's job is deciding *which handler runs*. Start there, and compare it
line by line against what `client/scripts/attendance.js` actually sends.
</details>

---

## How a request travels

```text
  BROWSER                      client/scripts/attendance.js
     |                         builds and sends the request
     v
  MIDDLEWARE                   server/middleware/
     |                         runs on the way in; can stop the request
     v
  ROUTER                       server/routers/
     |                         decides WHICH handler runs
     v
  CONTROLLER                   server/controllers/
     |                         reads the request, writes the response
     v
  MODEL                        server/models/
     |                         the only layer that knows the database
     v
  DATABASE                     MongoDB
```

Each layer knows about the one below it and nothing about the one above.

```text
client/
├── views/        server-rendered templates (welcome, form, roster, error)
├── scripts/      JavaScript sent to the browser and run there
└── css/          styles

server/           everything that stays on the server
```

`client/views/` holds templates the **server** renders into HTML.
`client/scripts/` and `client/css/` are shipped to the browser as-is.
Only those last two are served statically &mdash; templates are never
downloadable.

---

## What the app does

"Welcome to FSE!" → one button → a form asking for your name and Andrew ID →
saved to MongoDB → shown on `/roster`.

One check-in per Andrew ID per day. `XC5` and `xc5` are the same person.

---

## Afterwards

Some questions worth answering once it works:

- The error said **404**. The server was running the whole time. What does a
  404 from an API route actually mean?
- Submitting an empty form also fails, but you do **not** get the error page.
  Why is that failure treated differently?
- `client/scripts/attendance.js` checks for empty fields, and so does the server. Is
  one of them redundant? Try this and see:

  ```bash
  curl -X POST http://localhost:3000/api/attendance \
    -H 'Content-Type: application/json' -d '{}'
  ```
