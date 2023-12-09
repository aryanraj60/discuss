const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const speakeasy = require("speakeasy");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(
  "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"
);

const connectToDB = async () => {
  await mongoose.connect(
    "mongodb+srv://aryanraj234:aswwasaws@cluster0.jqmp9lp.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  );

  console.log("Connect to DB");
};

// Models
const User = require("./Models/User");
const Topic = require("./Models/Topic");
const Reply = require("./Models/Reply");
const Comment = require("./Models/Comment");
// const Comment = require("./models/Comment");
// const Reply = require("./models/Reply");

// Routes
// const authRoutes = require('./routes/authRoutes');
// const topicRoutes = require('./routes/topicRoutes');
// const commentRoutes = require('./routes/commentRoutes');
// const replyRoutes = require('./routes/replyRoutes');

const generateOTP = () => {
  return speakeasy.totp({
    secret: speakeasy.generateSecret().base32,
    step: 120, // OTP changes every 2 minutes
    digits: 6, // 6-digit OTP
  });
};

const sendOTP = async (email, otp) => {
  try {
    const msg = {
      to: email,
      from: "aryanraj234.ar@gmail.com", // replace with your sender email
      subject: "OTP Verification",
      text: `Your OTP for verification is: ${otp}`,
      html: `<p>Your OTP for verification is: <strong>${otp}</strong></p>`,
    };

    await sgMail.send(msg);

    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error("Error sending OTP via SendGrid:", error);
    // Handle the error appropriately (e.g., log it, send an error response)
  }
};

app.get("/api/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Retrieve user from the database based on userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with user's information (e.g., name)
    res.json({ user: { name: user.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const otp = generateOTP();

    // Save the OTP to the user document in the database
    const user = new User({
      name,
      email,
      password,
      verify: {
        otp: otp,
        isVerify: false,
      },
    });
    await user.save();

    // Send OTP to the user's email
    await sendOTP(email, otp);

    res.json({
      message: "Signup successful. Please verify your email/phone with OTP.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/otp-verify", async (req, res) => {
  try {
    const { email, enteredOTP } = req.body;

    // Retrieve user from the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the entered OTP
    const isValidOTP = user.verify.otp === enteredOTP ? true : false;

    if (isValidOTP) {
      // Mark user as verified
      user.verify.isVerify = true;
      await user.save();

      res.json({
        message: "OTP verification successful. You can now log in.",
        success: true,
      });
    } else {
      res.status(401).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password is correct
    const isPasswordValid = user.password === password ? true : false;

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Check if the user is verified
    // if (!user.verified) {
    //   return res.status(401).json({ message: "User is not verified" });
    // }

    // Generate and send JWT token
    // const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/topics/create", async (req, res) => {
  try {
    const { text, user } = req.body;
    const userId = user._id; // Assuming you have authentication middleware

    const topic = new Topic({ text, user: userId });
    await topic.save();

    res.json({ message: "Topic created successfully", topic, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/topics/all", async (req, res) => {
  try {
    const topics = await Topic.find()
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "replies",
          populate: {
            path: "user",
          },
        },
      });
    // Populate comments for each topic

    res.json({ data: topics, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/comments/create", async (req, res) => {
  try {
    const { text, topicId, user } = req.body;
    const userId = user._id;

    const comment = new Comment({ text, user: userId });
    await comment.save();

    // Add the comment to the corresponding topic
    await Topic.findByIdAndUpdate(topicId, {
      $push: { comments: comment._id },
    });

    res.json({ message: "Comment created successfully", comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/replies/create", async (req, res) => {
  try {
    const { text, commentId, user } = req.body;
    const userId = user._id;

    const reply = new Reply({ text, user: userId });
    await reply.save();

    // Add the reply to the corresponding comment
    await Comment.findByIdAndUpdate(commentId, {
      $push: { replies: reply._id },
    });

    res.json({ message: "Reply created successfully", reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// app.use('/api/auth', authRoutes);
// app.use('/api/topics', topicRoutes);
// app.use('/api/comments', commentRoutes);
// app.use('/api/replies', replyRoutes);

connectToDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
