# Customer's API

[![Continuous Integration](https://github.com/gorkamu/customer-api-example/actions/workflows/ci.yml/badge.svg)](https://github.com/gorkamu/customer-api-example/actions/workflows/ci.yml)


This API manages customers and their credit.

## Table of contents
- [Requirements](#requirements)
- [Installation](#installation)
  - [Automatic](#automatic)
  - [Manual](#manual)
- [API](#api)
  - [Get customers](#get-customers)
  - [Get customer](#get-customer)
  - [Create customer](#create-customer)
  - [Update customer](#update-customer)
  - [Delete customer](#delete-customer)
  - [Add credit](#add-credit)
- [Testing](#testing)
  - [Code coverage](#code-coverage)
  - [CI](#ci)
- [Deploy](#deploy)

## Requirements
- Node.js >= 18.18.2
- npm >= 9.8.1
- MongoDB >= 7.0.8
- Docker >= 24.0.7 (optional)
- Docker Compose >= 1.29.2 (optional)
- make (optional) >= 4.3

## Installation
There are two methods to install the project depending on whether you have the requirements for Docker and Make or not. 

The main difference is that with the Docker method, a MongoDB database is automatically containerized, which is why Make and Docker are used. 

If you choose the manual method, you will need to install a MongoDB database yourself or provide the DSN of an already running one.

### Automatic
Just navigate to the folder where the cloned repository is located and run the following command.  
```bash
make install
```
This command will create a Docker container with a Mongo image.

Next, edit the environment variables if necessary; they can be found in ./.env.
```bash
vim ./.env
```
To start the API in development mode, run the following command:
```bash
make start
```
This command starts the container with the Mongo database and runs the npm task "npm run dev," thereby launching the server with the API.

### Manual
To install the project manually, first copy the file with the environment variables and change the values as needed.
```bash
cp ./config/env/.env.dist ./.env
vim ./.env
```
Install the dependencies.
```bash
npm ci
```
Start the server in development mode.
```bash
npm run dev
```


## API

> [!TIP]
> Chain a pipeline with the 'jq' tool to the curl response and view the formatted JSON in the terminal.

### Get customers
```bash
curl http://localhost:3000/api/customers | jq
```
#### Response
```json
{
  "data": [
    {
      "id": "67543a0494ada883033359bc",
      "name": "Alberto Olite",
      "email": "alberto.olite@example.com",
      "phone": "1331904-1220",
      "createdAt": "2024-12-07T16:06:07.993Z",
      "totalCreditAmount": "960.51",
      "creditEntries": [
        {
          "date": "2024-12-07T12:07:16.785Z",
          "amount": "267.35"
        },
        {
          "date": "2024-12-07T12:07:24.663Z",
          "amount": "693.16"
        }
      ]
    }
  ],
  "pagination": {
    "limit": 100,
    "page": 1
  }
}
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
curl http://localhost:3000/api/customers?sort=phone | jq
curl http://localhost:3000/api/customers?sort=email&order=asc | jq
curl http://localhost:3000/api/customers?sort=phone&order=desc | jq
curl http://localhost:3000/api/customers?sort=createdAt&order=asc&page=1 | jq
curl http://localhost:3000/api/customers?sort=totalCreditAmount&order=asc&page=2 | jq
curl http://localhost:3000/api/customers?sort=totalCreditAmount&order=asc&page=1&limit=100 | jq
```
#### Get customers sorted by available credit
```bash
curl http://localhost:3000/api/customers?sort=totalCreditAmount&order=desc | jq
```


### Get customer
```bash
curl http://localhost:3000/api/customers/:id | jq
```

### Create customer
```bash
curl -X POST http://localhost:3000/api/customers \
-H "Content-Type: application/json" \
-d '{
  "name": "Mario Gregorio",
  "email": "mario.gregorio@example.com",
  "phone": "1331904-7220"
}' | jq
```

### Update customer
```bash
curl -X PUT http://localhost:3000/api/customers/:id \
-H "Content-Type: application/json" \
-d '{
  "name": "Delfin Asturiano",
  "email": "delfin.asturiano@example.com",
  "phone": "6661456-7890"
}' | jq
```

### Delete customer
```bash
curl -X DELETE http://localhost:3000/api/customers/:id | jq
```

### Add credit
```bash
curl -X POST http://localhost:3000/api/customers/:id/add-credit \
-H "Content-Type: application/json" \
-d '{
  "amount": "67.35"
}' | jq
```

## Testing
The project has a suite of unit, functional, and integration tests. To run them, execute the command:
```bash
npm run test
```
### Code coverage
The current coverage level is above 65%.
To perform a code coverage analysis, run the command:
```bash
npm run test:cov
```
You can also view it in JSON format by executing:
```bash
npm run test:cov:json
```

### CI

## Deploy
