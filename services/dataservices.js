const db = require('./db')

const register = (accountnumber, username, password) => {
    console.log("register called");
    return db.User.findOne({ accountnumber })//since this is a asynchronous action
        .then(user => {
            if (user) {
                return {

                    statuscode: 422,
                    status: false,
                    message: "User already exist please login"
                }

            }


            else {
                const newUser = new db.User({//creating a new entry in the database by using: new keyword
                    accountnumber,
                    username,
                    password,
                    balance:0,
                    transaction:[]
                })
                newUser.save()
                return {
                    statuscode: 200,
                    status: true,
                    message: "registered successfully",
                   
                }
            }
        })

    }

    const login = (req, accountnumber, password) => 
    {
        // console.log("login called");
        return db.User.findOne(
            {accountnumber,
                password
            })
        .then(user=>{
         if(user){
             req.session.current_acno=user.accountnumber
             req.session.username=user.username
            return {
                statuscode: 200,
                status: true,
                message: "login success",
                username:user.username,
                currentAcc:user.accountnumber
            }

         }
         
            return {
                statuscode: 422,
                status: false,
                message: "invalid password"
            }
        
        })
    }
    
    const deposit = (accountnumber, password, amount) => {

        var amt = parseInt(amount)
         return  db.User.findOne({accountnumber ,password})
         .then(user=>{
             if(!user){
                return {
                    statuscode: 422,
    
                    status: false,
                    message: "invalid user"
                }
             }
         
         user.balance+=amt
         user.transaction.push({
             amount:amt,
             type:"CREDIT"
         })
         user.save();
         return {
            statuscode: 200,

            status: true,
            message: amt + "successfully deposited and new balance is" + user.balance
        }
    })
    }
    const withdraw = (req,accountnumber, password, amount) => {

        var amt = parseInt(amount)
        return db.User.findOne(
            {
            accountnumber,
            password,
           
        })
        
        .then(user=>{
            if(!user){
                return {
                    statuscode: 422,
    
                    status: false,
                    message: "invalid user"
                }
             }
           
             if(req.session.current_acno!= accountnumber){
                return {
                    statuscode: 422,
    
                    status: false,
                    message: "operation denied"
                }
            }
             if(user.balance < amt){
                 return{
                    statuscode: 422,

                    status: false,
                    message: "Insufficent balance"
                 }
             }
             user.balance -=amt;
             user.transaction.push({
                amount:amt,
                type:"DEBIT"
            })
            user.save();
            return {
                statuscode: 200,
    
                status: true,
                message: amt + "successfully withdrawed and new balance is" + user.balance
            }
        })
    }
       
    const getTransaction = (accountnumber) => {
        console.log("gettransaction called")
        return db.User.findOne({
            accountnumber
        })
        .then(user=>{
            if(user){
                return{
        
                    statuscode: 200,
        
                        status: true,
                            transaction: user.transaction
                }
            }
            else{
                return{
        
                    statuscode: 422,
        
                        status: false,
                        message:"operation denied"
                }
            }
        })
       
    }

    module.exports =
    {
        register,
        login,
        deposit,
        withdraw,
        getTransaction


    }

