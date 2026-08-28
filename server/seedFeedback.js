import mongoose from "mongoose";
import dotenv from "dotenv";
import Feedback from "./models/Feedback.js";
import User from "./models/User.js";

dotenv.config();

const seedFeedback = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");

    const user = await User.findOne({
        email: "shewalesaurabh02@gmail.com",
    });

    if (!user) {
      throw new Error(
        "No user found. Create a user first."
      );
    }

    console.log(
      "👤 Seeding feedback for:",
      user.name,
      user._id
    );

    // We will add feedback data here.
    const existingCount = await Feedback.countDocuments({
        createdBy: user._id,
      });
      
      console.log(
        `📊 Existing feedback: ${existingCount}`
      );
      
      if (existingCount >= 120) {
        console.log(
          "⚠️ 120 or more feedback records already exist. Seed skipped."
        );
        return;
      }
    const feedbackData = [
        {
          customerName: "Aarav",
          email: "aarav@gmail.com",
          source: "Survey",
          message: "The dashboard is clean and easy to understand.",
          rating: 5,
          status: "New",
          sentiment: "Positive",
          category: "Praise",
          priority: "Low",
          theme: "Dashboard Performance",
          summary: "Customer is satisfied with the dashboard experience.",
        },
        {
          customerName: "Neha",
          email: "neha@gmail.com",
          source: "App Review",
          message: "The dashboard takes too long to load.",
          rating: 2,
          status: "New",
          sentiment: "Negative",
          category: "Complaint",
          priority: "High",
          theme: "Dashboard Performance",
          summary: "Customer reports slow dashboard loading.",
        },
        {
          customerName: "Rohan",
          email: "rohan@gmail.com",
          source: "Support Ticket",
          message: "Support resolved my issue very quickly.",
          rating: 5,
          status: "New",
          sentiment: "Positive",
          category: "Praise",
          priority: "Low",
          theme: "Customer Support",
          summary: "Customer praised the support team's quick resolution.",
        },
        {
          customerName: "Sneha",
          email: "sneha@gmail.com",
          source: "Survey",
          message: "The application is very easy to use.",
          rating: 5,
          status: "New",
          sentiment: "Positive",
          category: "Praise",
          priority: "Low",
          theme: "User Experience",
          summary: "Customer is highly satisfied with application usability.",
        },
        {
          customerName: "Vikram",
          email: "vikram@gmail.com",
          source: "App Review",
          message: "The app crashes when uploading large images.",
          rating: 1,
          status: "New",
          sentiment: "Negative",
          category: "Bug",
          priority: "High",
          theme: "Image Upload",
          summary: "Customer reports crashes during large image uploads.",
        },
        {
          customerName: "Pooja",
          email: "pooja@gmail.com",
          source: "Survey",
          message: "Please add dark mode to the application.",
          rating: 4,
          status: "New",
          sentiment: "Positive",
          category: "Feature Request",
          priority: "Medium",
          theme: "Dark Mode",
          summary: "Customer requests a dark mode feature.",
        },
        {
          customerName: "Kunal",
          email: "kunal@gmail.com",
          source: "Support Ticket",
          message: "Search results are taking too long to appear.",
          rating: 2,
          status: "New",
          sentiment: "Negative",
          category: "Complaint",
          priority: "Medium",
          theme: "Search Performance",
          summary: "Customer reports slow search results.",
        },
        {
          customerName: "Meera",
          email: "meera@gmail.com",
          source: "Survey",
          message: "Notifications are helpful and arrive on time.",
          rating: 5,
          status: "New",
          sentiment: "Positive",
          category: "Praise",
          priority: "Low",
          theme: "Notifications",
          summary: "Customer is satisfied with notification reliability.",
        },
        {
          customerName: "Aditya",
          email: "aditya@gmail.com",
          source: "App Review",
          message: "The mobile experience is smooth and responsive.",
          rating: 5,
          status: "New",
          sentiment: "Positive",
          category: "Praise",
          priority: "Low",
          theme: "Mobile Experience",
          summary: "Customer praises the mobile application experience.",
        },
        {
          customerName: "Isha",
          email: "isha@gmail.com",
          source: "Support Ticket",
          message: "I had trouble logging into my account.",
          rating: 2,
          status: "New",
          sentiment: "Negative",
          category: "Complaint",
          priority: "Medium",
          theme: "Login Experience",
          summary: "Customer experienced login difficulties.",
        },
      ];

      const messageVariants = {
        "Dashboard Performance": [
          "The dashboard loads quickly and is easy to navigate.",
          "Dashboard performance becomes slow when viewing many records.",
          "The dashboard takes too long to load during busy periods.",
          "The dashboard experience is smooth and responsive."
        ],
      
        "Customer Support": [
          "The support team resolved my issue quickly.",
          "Customer support was helpful and professional.",
          "I had a great experience with the support team.",
          "The support response took longer than expected."
        ],
      
        "User Experience": [
          "The application is simple and easy to use.",
          "The overall user experience is excellent.",
          "Navigation feels intuitive and smooth.",
          "Some screens are confusing and could be easier to understand."
        ],
      
        "Image Upload": [
          "Image uploads work perfectly for normal files.",
          "Large image uploads sometimes fail.",
          "The application crashes when uploading a large image.",
          "Image upload speed could be improved."
        ],
      
        "Dark Mode": [
          "Please add a dark mode option.",
          "A dark theme would make the application easier to use at night.",
          "Dark mode would be a useful addition.",
          "I would really like to see dark mode in the next release."
        ],
      
        "Search Performance": [
          "Search results appear quickly.",
          "Search becomes slow when many records are available.",
          "The search feature sometimes takes several seconds.",
          "Filtering and searching feedback works very well."
        ],
      
        "Notifications": [
          "Notifications are useful and arrive on time.",
          "I am happy with the notification system.",
          "Some notifications arrive later than expected.",
          "The notification experience is reliable."
        ],
      
        "Mobile Experience": [
          "The mobile experience is smooth and responsive.",
          "The application works well on my phone.",
          "Some mobile screens need better spacing.",
          "Mobile navigation is easy and convenient."
        ],
      
        "Login Experience": [
          "Login works quickly and without problems.",
          "I had trouble logging into my account.",
          "The login process is simple and secure.",
          "The login page sometimes takes too long to load."
        ],
      
        "Overall Satisfaction": [
          "Overall, I am very satisfied with the application.",
          "The application meets my expectations.",
          "I really enjoy using this application.",
          "The overall experience could be improved in a few areas."
        ]
      };
      
      const names = [
        "Aarav",
        "Neha",
        "Rohan",
        "Sneha",
        "Vikram",
        "Pooja",
        "Kunal",
        "Meera",
        "Aditya",
        "Isha",
        "Rahul",
        "Priya",
        "Amit",
        "Ananya",
        "Saurabh",
        "Nikhil",
        "Kavya",
        "Manoj",
        "Riya",
        "Arjun"
      ];
      
      const generatedFeedback = [];
      
      for (let i = 0; i < 120; i++) {
        const base =
          feedbackData[i % feedbackData.length];
      
        const variants =
          messageVariants[base.theme] || [
            base.message,
          ];
      
        const message =
          variants[i % variants.length];
      
        const createdAt = new Date();
      
        // Spread records across the previous 45 days
        createdAt.setDate(
          createdAt.getDate() - (i % 45)
        );
      
        generatedFeedback.push({
          customerName:
            `${names[i % names.length]} ${Math.floor(i / names.length) + 1}`,
      
          email:
            `${names[i % names.length].toLowerCase()}${i + 1}@example.com`,
      
          source: base.source,
      
          message,
      
          rating: base.rating,
      
          status: "New",
      
          sentiment: base.sentiment,
      
          category: base.category,
      
          priority: base.priority,
      
          theme: base.theme,
      
          summary: base.summary,
      
          createdBy: user._id,
      
          createdAt,
          updatedAt: createdAt,
        });
      }
      
      const inserted =
        await Feedback.insertMany(
          generatedFeedback
        );
      
      console.log(
        `✅ ${inserted.length} feedback records inserted`
      );
      console.log(
        `🎉 Seed completed: ${inserted.length} records`
      );

  } catch (error) {
    console.error(
      "❌ Seed Error:",
      error.message
    );
  } finally {
    await mongoose.connection.close();
  }
};

seedFeedback();