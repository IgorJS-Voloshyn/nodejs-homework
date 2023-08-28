const mongoose = require("mongoose");

const DB_URI = process.env.DB_URI;

async function run() {
    try {
        await mongoose.connect(DB_URI);
        console.log("Database connection successful");
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    finally {
        mongoose.disconnect()
    }
}
run();