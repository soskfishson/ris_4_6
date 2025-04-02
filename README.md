# ris_4_6
Labaratory works 4-6 in RIS (Distributed Informational Systems)

1)Setup

Cd to the directory and use

`
docker compose up
`

Create .env file and copy-paste .env.example data

Create DB

`
npm run create-db
`

Seed DB with initial data

`
npm run seed-db
`

2)Start the DIS

In a separate terminals:

Start central server

`
npm run dev:central
`

Start teritorial servers

`
npm run dev:territorial1
`

and

`
npm run dev:territorial2
`

3)Work with labaratory assignment

Not asked to explain in details what each endpoint does, refer to /src/routes/*.ts files
