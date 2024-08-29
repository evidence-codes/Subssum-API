import { Request, Response } from "express";
import User from "../service/Users.service";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export async function getUserInfo(req: AuthenticatedRequest, res: Response) {
  try {
    const user = await User.get(req.user?.id);
    res.status(200).json({ data: user });
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
}

export async function forgotPassword(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;

    const { oldPassword, newPassword } = req.body; // Extract old and new passwords from the request body

    // Call the forgotPassword function with user ID and password data
    const response = await User.forgot({ userId, oldPassword, newPassword });

    res.status(200).json({ message: response });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "An error occurred" });
  }
}

export async function changePassword(req: AuthenticatedRequest, res: Response) {
  try {
    const id = req.user?.id;
    const response = await User.password({ ...req.body, id });
    res.status(200).json({ message: response });
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
}

export async function deleteUser(req: AuthenticatedRequest, res: Response) {
  try {
    const response = await User.delete(req.user?.id);
    res.status(200).json({ message: response });
  } catch (err: any) {
    res.status(500).json({ error: err?.message });
  }
}
