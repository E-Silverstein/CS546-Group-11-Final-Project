
import keywordRoutes from "./keyword.js";
import postRoutes from "./posts.js";
import reportRoutes from "./reports.js";
import userRoutes from "./users.js";

const constructorMethod = app => {
    
    //app.use("/keyword", keywordRoutes)
    app.use("/reports", reportRoutes);
    app.use("/posts", postRoutes);
    app.use("/users", userRoutes);

    app.use("/", (req, res) => { 
      res.send("main page");
    });

    app.use("*", (req, res) => {
      res.status(404).json({ error: "Not found" });
    });
  };
  
  export default constructorMethod;
