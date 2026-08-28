import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "./models/User.js";

const createAnalyst = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");

    const existingUser = await User.findOne({
      email: "analyst@loop.com",
    });

    if (existingUser) {
      console.log(
        "⚠️ Analyst account already exists"
      );
      return;
    }

    const hashedPassword = await bcrypt.hash(
      "Analyst@123",
      10
    );

    const analyst = await User.create({
      name: "Test Analyst",
      email: "analyst@loop.com",
      password: hashedPassword,
      role: "analyst",
    });

    console.log("✅ Analyst account created");
    console.log("📧 Email:", analyst.email);
    console.log("🔑 Password: Analyst@123");
    console.log("👤 Role:", analyst.role);

  } catch (error) {
    console.error(
      "❌ Analyst Creation Error:",
      error.message
    );
  } finally {
    await mongoose.connection.close();
  }
};

createAnalyst();