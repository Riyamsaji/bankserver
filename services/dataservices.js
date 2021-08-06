users = {
    1001: { accountnumber: 1001, username: "riya", password: "userone", balance: 15000, transaction: [] },
    1002: { accountnumber: 1002, username: " Miya", password: "usertwo", balance: 10000, transaction: [] },
    1003: { accountnumber: 1003, username: "Jiya", password: "userthree", balance: 5000, transaction: [] }
}
const register = (accountnumber, username, password) => {
    console.log("register called");
    if (accountnumber in users) {
        return {
            status: false,
            message: "accountnumber already exists"
        }
    }
    else {
        users[accountnumber] = {
            accountnumber, username, password, balance: 0, transaction: []
        }
        return {
            status: true,
            message: "registered successfully"
        }
    }
}

const login = (req,accountnumber, password) => {
    console.log("login called");
    if (accountnumber in users) {
        if (password == users[accountnumber]["password"]) {
             current_user=users[accountnumber]["username"];
         
             req.session.current_acno=accountnumber;
             console.log(req.session.current_acno);



            return {
                statuscode: 200,
                status: true,
                message: "succesfully login"
            }
        }
        else {

            return {
                statuscode: 422,
                status: false,
                message: "invalid password"
            }

        }
    }
    else {


        return {
            statuscode: 422,
            status: false,
            message: "invalid accountnumber"
        }
    }
}
const deposit = (req,accountnumber, password, amount) => {
if(!req.session.current_acno){
    return {
        statuscode: 422,

        status: false,
        message: "please login"
    }
}
    var amt = parseInt(amount)
    if (accountnumber in users) {
        if (password == users[accountnumber]["password"]) {
            users[accountnumber]["balance"] += amt;
            users[accountnumber].transaction.push({
                amount: amt,
                type: "CREDIT"
            })

            return {
                statuscode: 200,

                status:true,
                message: amt+ "successfully deposited and new balance is"+users[accountnumber]["balance"]
            }
        }
        else {
            return {
                statuscode: 422,

                status: false,
                message: "invalid password"
            }
        }

    }
    else {
        return {
            statuscode: 422,

            status: false,
            message: "invalid user"
        }

    }
}
const withdraw=(accountnumber, password, amount) =>{
 
    var amt = parseInt(amount)
    if (accountnumber in users) {
      if (users[accountnumber]["balance"] > amt) {
        if (password == users[accountnumber]["password"]) {
          users[accountnumber]["balance"] -= amt;
          users[accountnumber].transaction.push({
            amount:amt,
            type:"DEBIT"
                    })
                    
          
            
                    return {
                        statuscode: 200,
        
                        status:true,
                        message: amt +  "successfully debited and new balance is"+users[accountnumber]["balance"]
                    }
        }
        else {
            return {
                statuscode: 422,

                status: false,
                message: "invalid password"
            }
        }

      }
      else {
        return {
            statuscode: 422,
            status: false,
            message: "insufficent balance"
        }
      }

    }
    else {
        return {
            statuscode: 422,
            status: false,
            message: "invalid accountnumber"
        }
  }
}
module.exports = {
    register,
    login,
    deposit,
    withdraw

}

