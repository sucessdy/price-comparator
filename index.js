const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./.env" });

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 3000;

let server;

// ==============================
// START SERVER
// ==============================

async function startServer() {
  try {

    await connectDB();

    server = app.listen(PORT, () => {
      console.log(
        `🏠 Server running on port ${PORT}`
      );
    });

  } catch (err) {
    console.error(
      "❌ Failed to start application"
    );

    console.error(err);

    process.exit(1);
  }
}

// ==============================
// GRACEFUL SHUTDOWN
// ==============================

async function gracefulShutdown(signal) {

  console.log(
    `\n🔴 ${signal} received. Shutting down gracefully...`
  );

  try {

    if (server) {
      server.close(() => {
        console.log("🛑 HTTP server closed");
      });
    }

    await mongoose.connection.close();

    console.log("✅ MongoDB disconnected");

    process.exit(0);

  } catch (err) {

    console.error(
      "❌ Error during shutdown"
    );

    console.error(err);

    process.exit(1);
  }
}

// ==============================
// PROCESS EVENTS
// ==============================

process.on(
  "SIGINT",
  () => gracefulShutdown("SIGINT")
);

process.on(
  "SIGTERM",
  () => gracefulShutdown("SIGTERM")
);

// ==============================
// UNHANDLED ERRORS
// ==============================

process.on(
  "unhandledRejection",
  (err) => {

    console.error(
      "❌ Unhandled Rejection"
    );

    console.error(err);

    gracefulShutdown("UNHANDLED_REJECTION");
  }
);

process.on(
  "uncaughtException",
  (err) => {

    console.error(
      "❌ Uncaught Exception"
    );

    console.error(err);

    process.exit(1);
  }
);

startServer();