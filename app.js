
var express = require('express')
var app = express();
var bodyParser = require('body-parser')
var mysql = require('mysql')
var fs = require('fs')
var ejs = require('ejs')
var cookieParser = require('cookie-parser'); //don't need cookie-parser for express-session to work
var session = require('express-session');
const { connect } = require('http2');
var path = require('path')

//app.use() - if no route specified first, middleware function called everytime server receives request

// This is a built-in middleware function in Express. 
// It serves static files and is based on serve-static (a node module)
//https://expressjs.com/en/resources/middleware/serve-static.html
//https://www.npmjs.com/package/serve-static
//the below is the same as app.use(serveStatic(__dirname) if you required ('serve-static))

app.use("/public", express.static(__dirname + '/public'));


//attaches parsed cookies to req object
app.use(cookieParser())


//express-session accepts these properties in the options object.
//'cookie' is the Settings object for the session ID cookie. The default value 
//is { path: '/', httpOnly: true, secure: false, maxAge: null }.

//cookie {httpOnly: false} means that you can then see the cookie with document.cookie with client side JS
//key: 'connect.sid' can be changed to whatever you want, connect.sid is the default

app.use(
    session(
        {secret:'james secret ssshhhhhhh',
        cookie: {httpOnly: false},
        resave: true, //Forces the session to be saved back to the session store
        maxAge: 120,
       
        //Forces a session that is “uninitialized” to be saved to the store. A session 
        //is uninitialized when it is new but not modified. 
        saveUninitialized: true}   
    ));


//set the view engine to use the /views folder of html templates
app.set('view engine', 'ejs');


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


app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
    // console.log('in root')
    // res.cookie('initcookieagain', 'valueishere999').send();

})

app.get('/cookietest', (req,res) => {
    
    // res.cookie('name', 'express').send('cookie set'); //Sets name = express

    //cookie stuff:
    //req.session.cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: false }
    //req.session.id = req.sessionID = something like a14PebUFoWJZclcHxNtdBbHqy7HgpEKv
    //req.cookies['connect.sid']
    //req.session: Session { cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: false }, pagevws: 2}
    
    
    //cookie value is same/or linked to the sessionID, that's how you look up a user's cookie in the session store!
    //see bottom comment in this stack overflow:
    //https://stackoverflow.com/questions/56726972/express-session-the-difference-between-session-id-and-connect-sid
    if(req.session.loggedIn){
        // req.session.pagevws++;
        console.log(req.session.loggedIn)
        res.send('multiple times here')
        console.log('cookie value: ', req.cookies['james-connectAged.sid'], 'sessoinID: ', req.sessionID);

    }
    else{
        // req.session.pagevws = 1;
        // req.session.loggedIn = true;
        // console.log(req.session);
        // console.log('cookie value: ', req.cookies['james-connectAged.sid'], 'sessoinID: ', req.sessionID);
        res.send('first time here')
    }
})


app.post('/formsubmission', (req,res) => {

    let con = mysql.createConnection({host: 'localhost', user: 'root', port: '3306', password: 'password'});
    
    con.query('USE jamestrial');
    con.query("SELECT * FROM sessions;", function(err,result) {
        
        printToPage(res, req, JSON.stringify(result[0]))

    });    
    
})

function printToPage(res, req, myResult){

    
    let localReq = req.body['fname'];
    
    let choice = '5';
    
    switch(choice){
        case '1':
            res.write('<html>');
            //res.write('<head> <title> Hello TutorialsPoint </title> </head>');
            res.write('<body> Hello Tutorials Point');
            res.write(`<p>${myResult}</p>`);
            res.write(`<p>${req.method}</p>`);
            res.write(`<p>${req.url}</p>`);
            res.write(`<p>${localReq}</p>`); 
            res.write('</body>')
            res.write('</html>');
            //write end to mark it as stop for node js response.
            res.end();

        case '2':
            if(!res.headerSent) {
                res.send('choice 2');
            }

        case '3':
            if(!res.headerSent){
                res.sendFile('formsubmission.html', {root:__dirname});
            }

        case '4':
            if(!res.headerSent){
                fs.appendFile('formsubmission.html',"hello again!", (err) => {
                    if(err) throw err;
                    // else fs.readFileSync('formsubmission.html', 'utf8')
                    else res.sendFile('index.html', {root:__dirname})
                });
            }

        //ejs views
        case '5':
            if(!res.headerSent){
                res.render('home', {ejsVariable: localReq})
                
            }

            
    }

}

app.listen(4000, () => {console.log('listening....')})

