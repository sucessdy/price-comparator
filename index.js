// require("dotenv").config() ;
const dotenv = require("dotenv");
dotenv.config({ path: './.env' });


if (!process.env.MONGO_URI) { 
  console.error("MONGO_URI not found in env file")
  process.exit(1);
}
const app = require("./src/app");
const port = process.env.PORT || 3000;
const connectDB = require("./src/config/db");

async function start() {
  await connectDB();
  app.listen(port, () => {
    console.log(`🏠 Server is running on port ${port}`);
  });
}

start();
