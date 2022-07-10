import { DataSource } from "typeorm";
import { Competition } from "./entity/competition";
require('dotenv').config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    entities: [Competition],
    logging: false,
    synchronize: true,
    subscribers: [],
    migrations: [],
})