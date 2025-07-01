const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SCRECT  = 'USER_APP';
const app = express();
const  users = [];
function generateToken() {
    let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
         'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
          'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
          let token = "";
          for (let i = 0; i<32; i++) {
            token = token + options[Math.floor(Math.random() * options.length)];
          }
    return token;
}
app.use(express.json());
app.post("/signup", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    users.push({
        username: username,
        password : password,
    })
    res.json({
        message : "you have signed up",
    })
    console.log(users);
})
app.post('/signin', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    
   let foundUser = null;
   for (let i=0; i<users.length; i++) {
    if(users[i].username == username && users[i].password == password) {
        foundUser = users[i]
    }
   }
   if(foundUser) {
    // const token = generateToken();

    const token = jwt.sign({   //convert their username overt to jwt
        username: username,
        pasword : password // key

    }, JWT_SCRECT);
    // foundUser.token = token; // no need to store in database
    res.json({
        token: token
    })
   } else {
    res.status(400).send({
        msg: "invalid username"
    })
   }
});

app.get('/me', function(req, res) {
    const token = req.headers.token; //jwt
    const decopdedInformation = jwt.verify(token, JWT_SCRECT);
    const username = decopdedInformation.username;
    let foundUser = null;
    for (let i = 0; i<users.length; i++) {
        if(users[i].username == username) {
            foundUser = users[i];
        }
    }
    if (foundUser) {
        res.json ({
            username : foundUser.username,
            password : foundUser.password
        })
    } else {
        res.json({
            msg : "token invalid"
        })
    }
   
})


app.listen(3000);