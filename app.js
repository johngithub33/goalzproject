
var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var mysql = require('mysql')

// This is a built-in middleware function in Express. 
// It serves static files and is based on serve-static (a node module)
//https://expressjs.com/en/resources/middleware/serve-static.html
//https://www.npmjs.com/package/serve-static
//the below is the same as app.use(serveStatic(__dirname) if you required ('serve-static))
app.use(express.static(__dirname)).listen(4000)

// parse application/x-www-form-urlencoded
//Returns middleware that only parses urlencoded bodies and only looks at requests 
//where the Content-Type header matches the type option. This parser accepts only 
//UTF-8 encoding of the body and supports automatic inflation of gzip and deflate 
//encodings.
//A new body object containing the parsed data is populated on the request object 
//after the middleware (i.e. req.body). This object will contain key-value pairs, 
//where the value can be a string or array (when extended is false), or any type 
//(when extended is true).
//need to provide extended option due to deprecation
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/formsubmission', (req,res) => {
    console.log(
        req.url,
        req.method,
        req.body,
        req.body['fname'],
        req.body['email']
    )

    let con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        port: '3306',  /* port on which phpmyadmin run */
        password: 'password'
        // socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock', //for mac and linux
        //database: "jamestrial" 
    });

    con.query('USE jamestrial');
    con.query("SELECT * FROM sessions;", function (err,result){
        console.log("THIS IS RESULT: ", result);
    });    

    // res.end('you submitted!!!')
    res.sendFile('formsubmission.html', {root:__dirname});
})