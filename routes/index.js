
/*
import route files
*/

const constructorMethod = app => {
    
    //app.use(...);
    
    app.use("*", (req, res) => {
      res.status(404).json({ error: "Not found" });
    });
  };
  
  export default constructorMethod;