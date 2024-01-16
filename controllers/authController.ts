import { Request, Response, NextFunction } from "express";
import { addDoc, collection } from "firebase/firestore";
import { SignUpValidation } from "../utilities/signUpValidation";
import { SignUpData } from "../dto/SignUp";
import { db } from "../firebase";

export class AuthController {
  public static async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = SignUpValidation.validate(<SignUpData>req.body);

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      const docId = await addDoc(collection(db, "ngos"), {
        ...value,
      });

      return res.status(201).json({ message: "NGO created successfully", id: docId.id });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
}
