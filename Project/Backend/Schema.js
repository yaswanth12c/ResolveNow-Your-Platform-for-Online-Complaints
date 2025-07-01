import mongoose from "mongoose";
// import bcrypt from "bcrypt";

///////////////// User Schema ////////////////////////////
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: "Name is required" },
    email: { type: String, required: "Email is required" },
    password: { type: String, required: "Password is required" },
    phone: { type: Number, required: "Phone is required" },
    userType: { type: String, required: "UserType is required" },
  },
  {
    timestamps: true,
  }
);

// Password hashing logic (optional - keep if you enable bcrypt)
/*
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});
*/

const UserSchema = mongoose.model("user_Schema", userSchema);

///////////////// Complaint Schema ////////////////////////
const complaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user_Schema" },
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: Number, required: true },
  comment: { type: String, required: true },
  status: { type: String, required: true },
});

const ComplaintSchema = mongoose.model("complaint_schema", complaintSchema);

///////////////// Assigned Complaint Schema ////////////////////////
const assignedComplaint = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user_Schema" },
  complaintId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "complaint_schema" },
  status: { type: String, required: true },
  agentName: { type: String, required: true },
});

const AssignedComplaint = mongoose.model("assigned_complaint", assignedComplaint);

///////////////// Message Schema ////////////////////////
const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: "Name is required" },
    message: { type: String, required: "Message is required" },
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: "assigned_complaint" },
  },
  { timestamps: true }
);

const MessageSchema = mongoose.model("message", messageSchema);

///////////////// Exports ////////////////////////
export {
  UserSchema,
  ComplaintSchema,
  AssignedComplaint,
  MessageSchema,
};
