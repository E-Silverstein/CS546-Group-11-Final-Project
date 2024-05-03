import postRoutes from "./posts.js";
import userRoutes from "./posts.js";
import loginRoutes from './login.js';
import signupRoutes from './signup.js';
import searchRoutes from './search.js';
import { postData } from "../data/index.js";

const constructorMethod = app => {    
  app.get('/home', async(req, res) => {
    //TO=DO need to display posts
    //let allposts = await postData.getAllPosts();
    return res.status(200).render('home/home');
  });
  app.use('/login', loginRoutes);
  app.use('/signup',  signupRoutes);

  app.use("/posts", postRoutes);
  app.use("/users", userRoutes);
  app.use("/search", searchRoutes);
  
  //app.use("/reports", reportRoutes);

  // TODO: Make this a middleware
  /*app.use("/", (req, res) => { 
    return res.redirect('/home');
  });*/

  app.use("/newpost", async(req, res) => {
    return res.status(200).render('posts/newpost');
  });

  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Not found" });
  });
};
  
export default constructorMethod;
