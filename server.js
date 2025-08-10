const connect = require("./connect")
const express = require("express")
// const mongoose = require("mongoose")
const cors = require("cors")


//adding db routes
// const users = require("./userRoutes")
const branches = require("./brancheRoutes")
const zones = require("./zoneRoutes")
const finances = require("./financeRoutes")
const services = require("./serviceRoutes")


const app = express()
const PORT = 3000


//using the route 
app.use(cors())
app.use(express.json())
// app.use(users)
app.use(branches)
app.use(zones)
app.use(finances)
app.use(services)

app.listen(PORT,()=>{
    connect.connectToServer()
    console.log(`Server is running on port ${PORT}`)
})