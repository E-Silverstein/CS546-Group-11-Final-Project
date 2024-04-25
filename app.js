import express from 'express';
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import session from 'express-session';
//import {} from './middleware.js';

const app = express();

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
};

/*call req.session.authenticated to see if user is logged in*/
app.use(session({
  name: 'AuthenticationState',
  secret: 'Our secret string',
  resave: false,
  saveUninitialized: false,
  authenticated: false /*logged in or not logged in */
}))

/*admin page to be added eventually to review all the reports made by the users*/
app.get('/admin', function(req,res,next) {
  if(req.session.user) {
    if(req.session.user.role !== 'admin'){
      res.send("you don't have access to this page") /* to look at the reports page */
    }
  }
  next();
});

app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set("view engine", "handlebars");
configRoutes(app);

app.listen(3000, () =>
  console.log('App Running at: localhost:3000'),
);