const express = require('express')

const database = require('./services/dataservices')//for importing that functions here
const session = require('express-session')
const cors=require('cors')
const app = express()
app.use(cors({
    origin:'http://localhost:4200',
credentials:true
}))
app.use(express.json())//method to convert json to normalform
app.use(session({
    secret: 'randomsecurestring',
    resave: false,
    saveUninitialized: false


}))

app.use((req, res, next) => {
    console.log("Application specific middleware");
    next()
})
const authMiddleware = (req, res, next) => {
    if (!req.session.current_acno) {
        res.json({
            statuscode: 422,

            status: false,
            message: "please login"
        })
    }
    else {
        next()
    }
}
app.get('/', (req, res) => {
    res.send("GET METHOD")
})

app.listen(3001, () => {
    console.log("server started at port number :3001");
})
app.post('/register', (req, res) => {
 database.register(req.body.accountnumber, req.body.username, req.body.password)
         .then(result => {
        res.status(result.statuscode).json(result)
    })
})
app.post('/login', (req, res) => {
 database.login(req, req.body.accountnumber, req.body.password)
.then(result=>{
    res.status(result.statuscode).json(result)
})

})
app.post('/deposit', authMiddleware, (req, res) => {
  database.deposit(req.body.accountnumber, req.body.password, req.body.amount)
  .then(result=>{
      res.status(result.statuscode).json(result)
  })

})
app.post('/withdraw', authMiddleware, (req, res) => {
  database.withdraw(req,req.body.accountnumber, req.body.password, req.body.amount)
  .then(result=>{
    res.status(result.statuscode).json(result)
  })
})
app.post('/getTransaction', authMiddleware, (req, res) => {
 database.getTransaction(req.body.accountnumber)
 .then(result=>{
     res.status(result.statuscode).json(result)
 })

})
