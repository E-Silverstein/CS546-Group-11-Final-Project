import express from 'express';
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
const app = express();

// const rewriteUnsupportedBrowserMethods = (req, res, next) => {
//   if (req.body && req.body._method) {
//     req.method = req.body._method;
//     delete req.body._method;
//   }
//   next();
// };

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