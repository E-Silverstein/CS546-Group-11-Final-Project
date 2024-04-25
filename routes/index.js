import postRoutes from "./posts.js";
import loginRoutes from './login.js';
import signupRoutes from './signup.js';
import editUserRoutes from './editUser.js'
import { getAllPosts } from '../data/posts.js';

const constructorMethod = app => {    
  app.get('/home', async(req, res) => {
    //TO=DO need to display posts
    //let allposts = await getAllPosts();
    res.status(200).render('test_home');
  });
  app.use('/login', loginRoutes);
  app.use('/signup',  signupRoutes);

  //TO-DO
  //app.use("/posts", postRoutes);
  //app.use('/editPost', editPostRoutes);
  //app.use("/users", userRoutes);
  //app.use('/editUser', editUserRoutes);
  
  //app.use("/reports", reportRoutes);

  app.use("/", (req, res) => { 
    return res.redirect('home');
  });

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};
  
export default constructorMethod;
