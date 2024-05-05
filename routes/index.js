import homeRoutes from "./home.js"
import postRoutes from "./posts.js";
import userRoutes from "./users.js";
import loginRoutes from './login.js';
import signupRoutes from './signup.js';
import searchRoutes from './search.js';
import adminRoutes from './admin.js';

const constructorMethod = app => {    
  app.use('/home', homeRoutes);
  app.use('/login', loginRoutes);
  app.use('/signup',  signupRoutes);
  app.use('/admin', adminRoutes);
  app.use("/posts", postRoutes);
  app.use("/users", userRoutes);
  app.use("/search", searchRoutes);
  
  //app.use("/reports", reportRoutes);

  // app.use("/error",  )


  app.use("*", (req, res) => {
    return res.status(404).render('error/error', {error: "Not found", isAuth: req.session.authenticated});
  });
};
  
export default constructorMethod;
