import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "./models/User.js";

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");

    const existingUser = await User.findOne({
      email: "admin@loop.com",
    });

    if (existingUser) {
      console.log("⚠️ Admin account already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      "Admin@123",
      10
    );

    const admin = await User.create({
      name: "Test Admin",
      email: "admin@loop.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin account created");
    console.log("📧 Email:", admin.email);
    console.log("🔑 Password: Admin@123");
    console.log("👤 Role:", admin.role);

  } catch (error) {
    console.error(
      "❌ Admin Creation Error:",
      error.message
    );
  } finally {
    await mongoose.connection.close();
  }
};

createAdmin();