import homeRoutes from "./home.js"
import postRoutes from "./posts.js";
import userRoutes from "./users.js";
import loginRoutes from './login.js';
import signupRoutes from './signup.js';
import searchRoutes from './search.js';
import adminRoutes from './admin.js';
import logoutRoutes from './logout.js';
import reportRoutes from './reports.js';
import commentRoutes from "./comments.js";

const constructorMethod = app => {    
  app.use('/home', homeRoutes);
  app.use('/login', loginRoutes);
  app.use('/signup',  signupRoutes);
  app.use('/admin', adminRoutes);
  app.use("/posts", postRoutes);
  app.use("/users", userRoutes);
  app.use("/search", searchRoutes);
  app.use("/logout", logoutRoutes);
  app.use("/reports", reportRoutes);
  app.use("/comments", commentRoutes);

  // app.use("/error",  )

  app.use("/error", (req, res) => {
    return res.status(400).render('error/error', {error: req.query.error})
  })

  app.use("*", (req, res) => {
    return res.status(404).render('error/error', {error: "Not found", isAuth:req.session.authenticated});
  });
};
  
export default constructorMethod;
