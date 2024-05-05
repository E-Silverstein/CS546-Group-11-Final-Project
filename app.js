import express from 'express';
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import session from 'express-session';
//import {} from './middleware.js';

const app = express();

/*call req.session.authenticated to see if user is logged in*/
app.use(session({
  name: 'AuthenticationState',
  secret: 'Our secret string',
  resave: false,
  saveUninitialized: false
  //authenticated: false /*logged in or not logged in */
}))

app.use('/', function(req,res,next){
    if (req.session.user === undefined) {
        req.session.authenticated = false;
    } else {
        req.session.authenticated = true;
    }

  console.log(req.method + " "+ req.originalUrl + " " + req.session.authenticated);
  if (req.path == "/") {
    req.method = 'GET';
    return res.status(200).redirect('/home');
  }
  next();
});

/*admin page to be added eventually to review all the reports made by the users*/
app.use('/admin', function(req,res,next) {
  if(!req.session.authenticated){
    return res.status(200).redirect('/login');
  }
  else if (req.session.authenticated && !req.session.user.isAdmin) {
    return res.status(403).render('error', {error: "You do not have permission to view the page.",});
  }
  next();
});

//works
app.use('/users', function(req,res,next){
  if(!req.session.authenticated){
    return res.status(200).redirect('/login');
  }
  next();
});

app.use('/login', function(req,res,next) {
  if (req.method == 'GET' && req.session.authenticated) {
    return res.status(200).redirect(`/users/${req.session.user._id}`);
  }
  next();
});

app.use('/signup', function(req,res,next) {
  if(req.method == 'GET' && req.session.authenticated){
    return res.status(200).redirect('/home');
  }
  next();
});

app.use('/home',function(req,res,next){
  next();
});

/*const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
};*/

app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () =>
  console.log('App Running at: localhost:3000'),
);