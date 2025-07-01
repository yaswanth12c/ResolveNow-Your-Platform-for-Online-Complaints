import express from "express";
import cors from "cors";
import connectDB from "./config.js";
import {
  ComplaintSchema,
  UserSchema,
  AssignedComplaint,
  MessageSchema,
} from "./Schema.js";

const app = express();
const PORT = 8000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// POST: Send a message
app.post("/messages", async (req, res) => {
  try {
    const { name, message, complaintId } = req.body;
    const messageData = new MessageSchema({ name, message, complaintId });
    const messageSaved = await messageData.save();
    res.status(200).json(messageSaved);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// GET: Get messages by complaintId
app.get("/messages/:complaintId", async (req, res) => {
  try {
    const { complaintId } = req.params;
    const messages = await MessageSchema.find({ complaintId }).sort("-createdAt");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
});

// POST: Signup
app.post("/SignUp", async (req, res) => {
  const user = new UserSchema(req.body);
  try {
    const resultUser = await user.save();
    res.send(resultUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST: Login
app.post("/Login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserSchema.findOne({ email });
  if (!user) return res.status(401).json({ message: "User doesn’t exist" });
  if (user.password === password) return res.json(user);
  res.status(401).json({ message: "Invalid Credentials" });
});

// GET: All agent users
app.get("/AgentUsers", async (req, res) => {
  try {
    const agentUsers = await UserSchema.find({ userType: "Agent" });
    if (!agentUsers.length) return res.status(404).json({ error: "User not found" });
    res.status(200).json(agentUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET: Agent by ID
app.get("/AgentUsers/:agentId", async (req, res) => {
  try {
    const { agentId } = req.params;
    const user = await UserSchema.findOne({ _id: agentId });
    if (user?.userType === "Agent") return res.status(200).json(user);
    res.status(404).json({ error: "User not found" });
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET: All ordinary users
app.get("/OrdinaryUsers", async (req, res) => {
  try {
    const users = await UserSchema.find({ userType: "Ordinary" });
    if (!users.length) return res.status(404).json({ error: "User not found" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE: Delete ordinary user and related complaints
app.delete("/OrdinaryUsers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserSchema.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await UserSchema.deleteOne({ _id: id });
    await ComplaintSchema.deleteOne({ userId: id });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST: Register a complaint
app.post("/Complaint/:id", async (req, res) => {
  try {
    const user = await UserSchema.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const complaint = new ComplaintSchema(req.body);
    const resultComplaint = await complaint.save();
    res.status(200).json(resultComplaint);
  } catch (error) {
    res.status(500).json({ error: "Failed to register complaint" });
  }
});

// GET: All complaints by user
app.get("/status/:id", async (req, res) => {
  try {
    const user = await UserSchema.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const comment = await ComplaintSchema.find({ userId: req.params.id });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

// GET: All complaints (admin)
app.get("/status", async (req, res) => {
  try {
    const complaints = await ComplaintSchema.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve Complaints" });
  }
});

// POST: Assign a complaint
app.post("/assignedComplaints", async (req, res) => {
  try {
    await AssignedComplaint.create(req.body);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ error: "Failed to add assigned complaint" });
  }
});

// GET: All complaints assigned to an agent
app.get("/allcomplaints/:agentId", async (req, res) => {
  try {
    const agentId = req.params.agentId;
    const assignments = await AssignedComplaint.find({ agentId });
    const complaintIds = assignments.map((a) => a.complaintId);

    const details = await ComplaintSchema.find({ _id: { $in: complaintIds } });

    const updated = assignments.map((assign) => {
      const detail = details.find((d) => d._id.toString() === assign.complaintId.toString());
      return {
        ...assign.toObject(),
        ...detail?._doc
      };
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to get complaints" });
  }
});

// PUT: Admin updates user profile
app.put("/user/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, email, phone } = req.body;

    const user = await UserSchema.findByIdAndUpdate(
      _id,
      { name, email, phone },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update the user" });
  }
});

// PUT: Agent updates complaint status
app.put("/complaint/:complaintId", async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status } = req.body;

    if (!complaintId || !status) {
      return res.status(400).json({ error: "Missing complaintId or status" });
    }

    const updatedComplaint = await ComplaintSchema.findByIdAndUpdate(
      complaintId,
      { status },
      { new: true }
    );

    const assigned = await AssignedComplaint.findOneAndUpdate(
      { complaintId },
      { status },
      { new: true }
    );

    if (!updatedComplaint && !assigned) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ error: "Failed to update complaint" });
  }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server started at http://localhost:${PORT}`));

