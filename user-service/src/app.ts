import * as express from "express"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { User } from "./entity/user"
import { body, validationResult } from 'express-validator'
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken'
require('dotenv').config();


AppDataSource.initialize()
    .then(async () => {
        const privateKey = fs.readFileSync('secrets/key.ppk');
        const publicKey = fs.readFileSync('secrets/key.pub');
        const userRepository = AppDataSource.getRepository(User)
        const port = process.env.EXPRESS_PORT ? process.env.EXPRESS_PORT : 3000

        const app = express()

        app.use(express.json())

        app.post("/api/login", 
            body("username").exists(),
            body("password").exists(),
        async (req: Request, res: Response) => {
            var err = validationResult(req);

            if (!err.isEmpty()) {
                return res.send({
                    message: err.mapped()
                })
            }

            const user = await userRepository.findOneBy({
                username: req.body.username,
                password: req.body.password
            })

            if(user == null){
                res.status(401).send();
            }else{
                const token = jwt.sign({ 
                    userId: user.id,
                    username: req.body.username,
                    password: req.body.password,
                    isAdmin: user.isAdmin
                }, privateKey, { 
                    algorithm: 'RS256', 
                    expiresIn: '1800s' 
                });

                return res.json({token})
            }
        })

        app.post("/api/register", 
            body("username").exists(),
            body("password").exists(),
        async (req: Request, res: Response) => {
            var err = validationResult(req);

            if (!err.isEmpty()) {
                return res.send({
                    message: err.mapped()
                })
            }

            const userExists = await userRepository.findOneBy({
                username: req.body.username,
                password: req.body.password
            })

            if(userExists != null){
                return res.json({
                    message: "User already exists"
                })
            }

            const user = await userRepository.create({
                username: req.body.username,
                password: req.body.password
            })
            const result = await userRepository.save(user)

            return res.json({result})
        })

        app.get("/api/publicKey", (req: Request, res: Response) => {
            return res.send(publicKey)
        })


        console.log(`Listening to port: ${port}`)
        app.listen( port )
    })