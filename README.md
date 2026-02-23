#ResolveIT API (Node.js + Express + SQLite)

ResolveIT is a minihelpdesk ticketing backend API built with Node.js, Express, and SQLite.
It supports basic CRUD operations for helpdesk ticketing and stores data persistently in a local SQLite database.

## Tech Stack
- Node.js
- Express
- SQLite3
- REST API (JSON)

## Project Structure
Resolveit-api/
|-- src/
| |-- server.js
| |-- routes.js
| |-- db.js
|-- data/ # Local DB lives here
|-- .gitignore
|-- README.md
|-- package.json
|-- package-lock.json

## Setup and Run
1) Install dependencies: npm install
2) Start Server: node src/server.js
- Server runs on: http://localhost:3000
- SQLite DB file created at: data/tickets.db

## API Endpoints:
- GET /health
- GET /test-db
- POST /tickets
- GET /tickets
- GET /tickets/:id
- PUT /tickets/:id
- DELETE /tickets/:id

## Examples of curl commands 
These commands are used to operate the ticketing system before creating a user interface.
- Health Checks: curl http://localhost:3000/health
- Create Tickets: curl -X POST "http://localhost:3000/tickets" -H "Content Type: appliation/json" -d '{"title":"content","description":"content","priority":"content"}'
- List Tickets: curl "http://localhost:3000/tickets"
- Update Tickets: curl -X PUT "http://localhost:3000/tickets/#" -H "Content Type: appliation/json" -d '{"Content":"Content"}'
- Delete Ticket: curl -X DELETE "http://localhost:3000/tickets/#" 
