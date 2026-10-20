require('dotenv').config()
const app = require('./src/app')
const DataBaseConnect = require("./src/config/dbConnect")


DataBaseConnect()


app.listen(3000,()=>{
    console.log("server is running....");
    
})