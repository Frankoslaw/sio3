import * as express from "express"
import { Response } from "express"
import { AppDataSource } from "./data-source"
import { Competition } from "./entity/competition"
import { body, param, validationResult } from 'express-validator'
import axios from 'axios';
import * as jwt from 'jsonwebtoken'
require('dotenv').config();

AppDataSource.initialize()
    .then(async () => {
        const {data: publicKey, status: _} = await axios.get(`http://${process.env.USERSERVICE_HOST}:${process.env.USERSERVICE_PORT}/api/publicKey`)
        const competitionRepository = AppDataSource.getRepository(Competition)
        const port = process.env.EXPRESS_PORT ? process.env.EXPRESS_PORT : 3000

        const app = express()

        app.use(express.json())

        const authenticateToken = (req, res, next) => {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
          
            if (token == null) return res.sendStatus(401)
          
            jwt.verify(token, publicKey, (err: any, user: any) => {
              if (err) return res.sendStatus(403)
          
              req.user = user
          
              next()
            })
        }

        app.post("/api/competition",
            authenticateToken,
            body("name").exists(),
        async (req: any, res: Response) => {
            var err = validationResult(req);

            if (!err.isEmpty()) {
                return res.send({
                    message: err.mapped()
                })
            }

            const competitionExists = await competitionRepository.findOneBy({
                name: req.body.name
            })

            if(competitionExists != null){
                return res.json({
                    message: "Competition with this name already exists"
                })
            }

            const competition = await competitionRepository.create({
                name: req.body.name,
                author: req.user.userId
            })
            const result = await competitionRepository.save(competition)

            res.send({
                result
            })
        })

        app.get("/api/competition",
            authenticateToken,
        async (req: any, res: Response) => {
            var err = validationResult(req);

            if (!err.isEmpty()) {
                return res.send({
                    message: err.mapped()
                })
            }

            const competitions = await competitionRepository.find()
            return res.json({
                competitions
            })
        })

        app.get("/api/competition/:id",
            authenticateToken,
            param("id").exists().isInt(),
        async (req: any, res: Response) => {
            var err = validationResult(req);

            if (!err.isEmpty()) {
                return res.send({
                    message: err.mapped()
                })
            }

            const competition = await competitionRepository.findOneBy({
                id: req.params.id
            })
            
            if(competition == null){
                return res.json({
                    message: "Selected competition does not exists"
                })
            }

            return res.json({
                competition
            })
        })

        app.delete("/api/competition/:id",
            authenticateToken,
            param("id").exists().isInt(),
        async (req: any, res: Response) => {
            var err = validationResult(req);

            if (!err.isEmpty()) {
                return res.send({
                    message: err.mapped()
                })
            }

            const competition = await competitionRepository.findOneBy({
                id: req.params.id
            })
            
            if(competition == null){
                return res.json({
                    message: "Selected competition does not exists"
                })
            }

            if(competition.author != req.user.userId && !req.user.isAdmin){
                return res.json({
                    message: "You don't have permissions to execute this operation"
                })
            }
            
            const result = await competitionRepository.remove(competition);
            return res.json({
                result
            })
        })

        app.put("/api/competition/:id",
            authenticateToken,
            param("id").exists().isInt(),
            body("name").exists(),
        async (req: any, res: Response) => {
            var err = validationResult(req);

            if (!err.isEmpty()) {
                return res.send({
                    message: err.mapped()
                })
            }

            const competitionExists = await competitionRepository.findOneBy({
                name: req.body.name
            })

            if(competitionExists != null){
                return res.json({
                    message: "Competition with this name already exists"
                })
            }

            const competition = await competitionRepository.findOneBy({
                id: req.params.id
            })
            
            if(competition == null){
                return res.json({
                    message: "Selected competition does not exists"
                })
            }

            if(competition.author != req.user.userId && !req.user.isAdmin){
                return res.json({
                    message: "You don't have permissions to execute this operation"
                })
            }

            competition.name = req.body.name
            
            const result = await competitionRepository.save(competition);
            return res.json({
                result
            })
        })


        console.log(`Listening to port: ${port}`)
        app.listen( port )
    })