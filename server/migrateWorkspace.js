import "dotenv/config";
import mongoose from "mongoose";

import User from "./models/User.js";
import Workspace from "./models/Workspace.js";
import Feedback from "./models/Feedback.js";

const migrateWorkspace = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");

    // ========================================
    // 1. FIND EXISTING WORKSPACE
    // ========================================

    const workspace = await Workspace.findOne({
      name: "LOOP Workspace",
    });

    if (!workspace) {
      throw new Error("LOOP Workspace not found");
    }

    console.log("🏢 Workspace:", workspace.name);
    console.log("🆔 Workspace ID:", workspace._id);

    // ========================================
    // 2. UPDATE USERS
    // ========================================

    const users = await User.find({
      $or: [
        { workspaceId: null },
        { workspaceId: { $exists: false } },
      ],
    });

    for (const user of users) {
      user.workspaceId = workspace._id;
      await user.save({ validateModifiedOnly: true });
    }

    console.log(
      `👤 Users updated: ${users.length}`
    );

    // ========================================
    // 3. UPDATE FEEDBACK
    // ========================================

    const feedback = await Feedback.find({
      $or: [
        { workspaceId: null },
        { workspaceId: { $exists: false } },
      ],
    });

    for (const item of feedback) {
      item.workspaceId = workspace._id;
      await item.save({ validateModifiedOnly: true });
    }

    console.log(
      `💬 Feedback updated: ${feedback.length}`
    );

    // ========================================
    // 4. FINAL CHECK
    // ========================================

    const totalUsers = await User.countDocuments({
      workspaceId: workspace._id,
    });

    const totalFeedback =
      await Feedback.countDocuments({
        workspaceId: workspace._id,
      });

    console.log("--------------------------------");
    console.log("✅ Workspace migration completed");
    console.log("👤 Users:", totalUsers);
    console.log("💬 Feedback:", totalFeedback);
    console.log("--------------------------------");

  } catch (error) {
    console.error(
      "❌ Migration Error:",
      error.message
    );
  } finally {
    await mongoose.connection.close();
  }
};

migrateWorkspace();