import User, { IUser } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import * as dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SEC || "";

class Auth {
  async saveToDatabase(user: any) {
    try {
      await user.save();
      console.log("User saved to database");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to save user:", err.message);
        throw new Error(err.message);
      } else {
        console.error("Unknown error:", err);
      }
    }
  }

  async generateSecret() {
    let characters =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let randomID = "";
    for (let i = 0; i < 7; i++) {
      randomID += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return randomID;
  }

  async generateReferralLink(userId: string) {
    // Create a hash from the userId
    const hash = crypto.createHash("sha256").update(userId).digest("base64");

    // Replace URL-unsafe characters (+, /) and remove padding (=)
    const base64UrlSafe = hash
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Use a slice of the URL-safe Base64 string for the referral code
    const referralCode = base64UrlSafe.slice(0, 8);

    const referralLink = `www.subssum.com/invite/${referralCode}`;

    return referralLink;
  }

  async generateUniqueReferralLink(userId: string) {
    let isUnique = false;
    let referralLink;
    let retryCount = 0; // Initialize a retry counter
    const maxRetries = 5; // Set a maximum number of retries to prevent infinite loops

    while (!isUnique && retryCount < maxRetries) {
      referralLink = await this.generateReferralLink(userId);

      // Check if the referral link already exists in the database
      const existingUser = await User.findOne({ referral: referralLink });

      if (!existingUser) {
        isUnique = true; // Exit loop if unique
      } else {
        retryCount++; // Increment the retry counter
        console.warn(
          `Duplicate referral detected. Attempt ${retryCount} to generate a unique referral link.`
        );
      }
    }

    if (!isUnique) {
      // If we reach maxRetries without finding a unique link, throw an error
      throw new Error(
        "Unable to generate a unique referral link after multiple attempts."
      );
    }

    return referralLink;
  }

  async register(data: IUser) {
    try {
      const { name, email, phone, password } = data;
      const user = await User.findOne({ email });
      if (user) throw new Error("User already exists");
      const incoming: string = password.toString();
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(incoming, salt);
      const secret = await this.generateSecret();
      const newUser = new User({ name, email, phone, password: hash, secret });
      const referral = await this.generateUniqueReferralLink(
        newUser._id.toString()
      );
      newUser.referral = referral as string;
      await this.saveToDatabase(newUser);
      return newUser;
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error during user registration:", err.message);
        throw new Error(err.message);
      } else {
        console.error("Unknown error:", err);
      }
    }
  }

  async login(
    data: IUser
  ): Promise<{ user: IUser; token: string } | undefined> {
    try {
      let user: any;
      const { email: IncomingEmail, password: IncomingPassword } = data;
      user = await User.findOne({ email: IncomingEmail });

      if (!user) throw new Error("Invalid Email/Password ");

      const { password } = user;
      const incomingPassword: string = IncomingPassword.toString();
      const compare = await bcrypt.compare(incomingPassword, password);

      if (!compare) throw new Error("Invalid Email/Password");

      const payload = {
        id: user._id,
      };
      const secret = user.secret;
      const token = jwt.sign(payload, secret);
      return { user, token };
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to Login User:", err.message);
        throw new Error(err.message);
      } else {
        console.error("Unknown error:", err);
      }
    }

    return;
  }
}

export default Auth;
