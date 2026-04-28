require("dotenv").config() ; 
const app = require("./src/app"); 
const port = process.env.PORT
const connectDB = require("./src/config/db")


async function start() {
  await connectDB();
  app.listen(port ,  () => {
    console.log(`🏠 Server is running on port ${port}`);
  });
}

start();
