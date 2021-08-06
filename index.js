const express = require('express')

const database = require('./services/dataservices')//for importing that functions here
const session=require('express-session')
const app = express()
app.use(express.json())//method to convert json to normalform
app.use(session({
    secret:'randomsecurestring',
    resave:false,
    SaveUninitialized:false

    
}))
app.get('/', (req, res) => {
    res.send("GET METHOD")
})

app.listen(3001, () => {
    console.log("server started at port number :3001");
})
app.post('/register',(req,res)=>{
    console.log(req.body);
  const result=database.register(req.body.accountnumber,req.body.username,req.body.password);

  res.status(result.statuscode).json(result)
})
app.post('/login', (req, res) => {
    const result = database.login(req,req.body.accountnumber, req.body.password)

    res.status(result.statuscode).json(result)
})
app.post('/deposit', (req, res) => {
    const result = database.deposit(req,req.body.accountnumber, req.body.password, req.body.amount)

    res.status(result.statuscode).json(result)
})
app.post('/withdraw', (req, res) => {
    const result = database.withdraw(req.body.accountnumber, req.body.password, req.body.amount)

    res.status(result.statuscode).json(result)
})