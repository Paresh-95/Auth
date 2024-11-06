const express = require("express")
const app = express()

require("dotenv").config()

const PORT = process.env.PORT|| 4000


app.use(express.json())

    const DbConnect = require("./config/Database")
    DbConnect.dbConnect();


    const user = require("./routes/userRoutes")
    app.use("/api/v1",user)


    app.listen(PORT,(req,res)=>{
        console.log(`Server Running on Port ${PORT}`);
    })

app.get("/",(req,res)=>{
    res.send("This is Home Page")
})
