import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient();
const app = express()

app.use(express.json())

app.use(cors())

const port = process.env.PORT || 3333

app.listen(port)

app.get("/users", async (req, res) => {
    let users
    const {search, field} = req.query

    if (!search || !field) {
        users = await prisma.users.findMany()
    } else {
        const fieldsArray = Array.isArray(field) ? field : [field]

        const filters = fieldsArray.map((field) => {
            if (field === "age") {
                if (Number.isInteger(parseInt(search)))  {
                    return {
                        [field]: {
                            equals: parseInt(search),
                        },
                    }
                }

                return {}
            } 

            return {
                    [field]: {
                        contains: search,
                        mode: 'insensitive',
                    },
            }
        })

        users = await prisma.users.findMany({
            where: {
                OR: filters,
            },
        })
    }
    
    res.status(200).json(users)
})

app.post("/users", async (req, res) => {
    try {
        await prisma.users.create({
            data: {
                age: req.body.age,
                name: req.body.name,
                email: req.body.email
            }
        })

        res.status(201).json(req.body)
    } catch (error) {
        if (error.code == "P2002" && error.meta?.target?.includes("email")) {
            return res.status(400).json({
                message: "Este e-mail já está em uso. Por favor, use outro."
            })
        }

        if (error.name === "PrismaClientValidationError") {
            return res.status(400).json({ message: "Tipo de dado inválido. Verifique os campos." })
        }

        console.log("Erro ao criar o usuário:", error)
        res.status(500).json({
            message: "Erro interno ao criar o usuário."
        })
    }
})

app.put("/users/:id", async (req, res) => {
    try {
        await prisma.users.update({
            where: {
                id: req.params.id
            },
            data: {
                age: req.body.age,
                name: req.body.name,
                email: req.body.email
            }
        })
    } catch (error) {
        if (error.code == "P2002" && error.meta?.target?.includes("email")) {
            return res.status(400).json({
                message: "Este e-mail já está em uso. Por favor, use outro."
            })
        }

        if (error.name === "PrismaClientValidationError") {
            return res.status(400).json({ message: "Tipo de dado inválido. Verifique os campos." })
        }

        console.log("Erro ao criar o usuário:", error)
        res.status(500).json({
            message: "Erro interno ao criar o usuário."
        })
    }

    res.status(200).json(req.body)
})

app.delete("/users/:id", async (req, res) =>{
    await prisma.users.delete({
        where: {
            id: req.params.id
        }
    })

    res.status(200).json({message: "Usário deletado com sucesso!"})
})