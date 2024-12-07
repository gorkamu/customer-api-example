# Customer's API
This API manages customers and their credit.

## Table of contents
- [Requirements](#requirements)
- [Installation](#installation)
- [Execution](#execution)
- [API](#api)
  - [Get customers](#get-customers)
  - [Get customer](#get-customer)
  - [Create customer](#create-customer)
  - [Update customer](#update-customer)
  - [Delete customer](#delete-customer)
  - [Add credit](#add-credit)
- [Testing](#testing)
  - [Code coverage](#code-coverage) 
- [Deploy](#deploy)

## Requirements
- Node.js >= 18.18.2
- npm >= 9.8.1
- MongoDB >= 7.0.8
- Docker (optional) >= 24.0.7
- Docker Compose (optional) >= 1.29.2,
- make (optional) >= 4.3

## Installation
<details>
<summary>Automatic</summary>

    $ git clone https://github.com/gorkamu/customer-api.git && \
    cd customer-api && \
    make install && \
    vim .env && true

</details>
<details>
<summary>Manual</summary>
    
    $ git clone https://github.com/gorkamu/customer-api.git && \
    cd customer-api && \
    npm ci && \
    cp ./config/env/.env.dist ./.env && \
    vim .env && true   
    
</details>

## Execution
```bash
$ make start        # if you run with make & docker 
$ npm run dev       # if not
```

## API

> [!TIP]
> Chain a pipeline with the 'jq' tool to the curl response and view the formatted JSON in the terminal.

### Get customers
```bash
curl http://localhost:3000/api/customers | jq
```

#### Get customers with sort and pagination
You can pass filters to the 'get customers' endpoint to filter, sort, and paginate the data. 

The sorting terms are the properties of the entity.

#### Customer properties as sorting terms:
| Property          | Type   |
|-------------------|--------|
| id                | string | 
| email             | string | 
| phone             | string |
| totalCreditAmount | string |
| createdAt         | Date   |

#### Sort order
| Order | Description |
|-------|-------------|
| asc   | Ascending   |
| desc  | Descending  |

```bash
/api/customers?sort=<property>&order=<order>&page=<page>&limit=<limit>
```

> [!NOTE]
> Each of the four filters is optional. If you don't pass a filter, the default value will be used.


Examples:
```bash
$ curl http://localhost:3000/api/customers?sort=phone | jq
$ curl http://localhost:3000/api/customers?sort=email&order=asc | jq
$ curl http://localhost:3000/api/customers?sort=phone&order=desc | jq
$ curl http://localhost:3000/api/customers?sort=createdAt&order=asc&page=1 | jq
$ curl http://localhost:3000/api/customers?sort=totalCreditAmount&order=asc&page=2 | jq
$ curl http://localhost:3000/api/customers?sort=totalCreditAmount&order=asc&page=1&limit=100 | jq
```

### Get customer
```bash
$ curl http://localhost:3000/api/customers/:id | jq
```

### Create customer
```bash
$ curl -X POST http://localhost:3000/api/customers \
-H "Content-Type: application/json" \
-d '{
  "name": "Mario Gregorio",
  "email": "mario.gregorio@example.com",
  "phone": "1331904-7220"
}' | jq
```

### Update customer
```bash
$ curl -X PUT http://localhost:3000/api/customers/:id \
-H "Content-Type: application/json" \
-d '{
  "name": "Delfin Asturiano",
  "email": "delfin.asturiano@example.com",
  "phone": "6661456-7890"
}' | jq
```

### Delete customer
```bash
$ curl -X DELETE http://localhost:3000/api/customers/:id | jq
```

### Add credit
```bash
$ curl -X POST http://localhost:3000/api/customers/:id/add-credit \
-H "Content-Type: application/json" \
-d '{
  "amount": "67.35"
}' | jq
```

## Testing
### Code coverage
### CI

## Deploy
