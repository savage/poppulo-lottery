# Poppulo Lottery

## Description

Poppulo interview technical challenge

## Installation

```bash
$ npm install

# create .env file from template
$ cp .env.template .env
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Endpoints

| Endpoint                | Body               | Description                                                                                                                                                                                    |
|-------------------------|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GET /ticket             |                    | Returns all created tickets.                                                                                                                                                                   |
| GET /ticket/{id}        |                    | Returns the identified ticket. Returns 404 when no ticket exists with {id}.                                                                                                                    |
| POST /ticket            | `{ "lines": <n> }` | Generates a new ticket with <n> lines. Returns 400 if <n> is not a positive integer.                                                                                                           |
| PUT /ticket/{id}        | `{ "lines": <n> }` | Appends <n> lines to an existing ticket. Returns 400 if <n> is not a positive integer. Returns 404 when no ticket exists with {id}. Returns 409 when ticket status has already been evaluated. |
| GET /ticket/{id}/status |                    | Evaluates and returns the identified ticket with values. Returns 404 when no ticket exists with {id}.                                                                                          |
