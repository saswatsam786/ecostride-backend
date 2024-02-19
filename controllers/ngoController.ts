import { Request, Response, NextFunction } from "express";
import { addDoc, collection, doc, updateDoc, arrayUnion, query, where, getDocs, getDoc } from "firebase/firestore";
import { SignUpData } from "../dto/SignUp";
import { db } from "../firebase";
import { CampaignValidation, ngoSignInValidation, ngoSignUpValidation } from "../utilities/ngoValidation";
import { CampaignData } from "../dto/CampaignData";

export class NGOController {
  private static async checkIfRegistrationNumberExists(email: string): Promise<boolean> {
    const q = query(collection(db, "ngos"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  }
  public static async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = ngoSignUpValidation.validate(<SignUpData>req.body);

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      const registrationNumberExists = await NGOController.checkIfRegistrationNumberExists(value.email);

      if (registrationNumberExists) {
        return res.status(400).json({ message: "Registration number already exists" });
      }

      const docId = await addDoc(collection(db, "ngos"), {
        ...value,
      });

      return res.status(201).json({ message: "NGO created successfully", id: docId.id });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }

  public static async getNgoData(req: Request, res: Response) {
    const { error, value } = ngoSignInValidation.validate(req.body);

    if (error) {
      return res.status(404).json({ message: error.message });
    }

    const { email } = value;

    const ngoDocRef = await query(collection(db, "ngos"), where("email", "==", email));
    const userDocSnapshot = await getDocs(ngoDocRef);

    if (userDocSnapshot.size > 0) {
      const userData = userDocSnapshot.docs[0].data();
      delete userData.password;
      return res.status(200).json({ message: userData });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  }

  public static async campaignCreate(req: Request, res: Response) {
    const { error, value } = CampaignValidation.validate(<CampaignData>req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const docId = await addDoc(collection(db, "campaigns"), {
      ...value,
      transactions: [],
    });

    const campaignId = docId.id;
    const ngoId = value.ngoId;

    const ngoDocRef = doc(db, "ngos", ngoId);

    await updateDoc(ngoDocRef, {
      campaigns: arrayUnion({ campaignId, campaignName: value.campaignName }),
    });

    return res.status(201).json({ message: "Campaign created successfully", id: docId.id });
  }
}
