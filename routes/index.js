import postRoutes from "./posts.js";
import userRoutes from "./users.js";
import loginRoutes from './login.js';
import signupRoutes from './signup.js';
import searchRoutes from './search.js';
import adminRoutes from './admin.js';

const constructorMethod = app => {    
  app.get('/home', async(req, res) => {
    //TO=DO need to display posts
    //let allposts = await postData.getAllPosts();
    return res.status(200).render('home/home');
  });
  app.use('/login', loginRoutes);
  app.use('/signup',  signupRoutes);
  app.use('/admin', adminRoutes);
  app.use("/posts", postRoutes);
  app.use("/users", userRoutes);
  app.use("/search", searchRoutes);
  
  //app.use("/reports", reportRoutes);

  app.use("/newpost", async(req, res) => {
    return res.status(200).render('posts/newpost');
  });

  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Not found" });
  });
};
  
export default constructorMethod;
