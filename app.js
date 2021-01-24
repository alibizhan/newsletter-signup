const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  var fName = req.body.firstName;
  var lName = req.body.lastName;
  var email = req.body.emailAddress;

  var data = {
    members: [
      {
      email_address: email,
      status: "subscribed",
      merge_fields:{
        FNAME: fName,
        LNAME: lName
      }
    }
    ]
  }
  //console.log(fName,lName,email);
  const JSONData = JSON.stringify(data);
  const url = "https://us7.api.mailchimp.com/3.0/lists/925301d01e";
  const options = {
    method: "POST",
    auth: "alib:f2f7fd65688890418d150430e26d87d7-us7"
  }
  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }
    else{
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(JSONData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
});





app.listen(process.env.PORT || 3000, function(){
  console.log("server is running on port 3000");
});
