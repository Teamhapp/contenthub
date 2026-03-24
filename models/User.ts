import mongoose, { Schema, Document, Model } from "mongoose";
import bcryptjs from "bcryptjs";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  image?: string;
  role: "customer" | "creator" | "admin";
  bio?: string;
  isBanned: boolean;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    image: { type: String },
    role: { type: String, enum: ["customer", "creator", "admin"], default: "customer" },
    bio: { type: String, maxlength: 500 },
    isBanned: { type: Boolean, default: false },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcryptjs.hash(this.password, 12);
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcryptjs.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
