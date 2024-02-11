import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { userIdValidation, userSignUpValidation } from "../utilities/userValidation";
import { UserParam, UserSignUp } from "../dto/User";
import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export class UserController {
  public static async signUp(req: Request, res: Response) {
    const { error, value } = userSignUpValidation.validate(<UserSignUp>req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { firstName, lastName, phone, gender, email, password, userId } = <UserSignUp>value;

    try {
      const docDB = await query(collection(db, "users"), where("email", "==", email));
      const emailSnapshot = await getDocs(docDB);

      if (emailSnapshot.size > 0) return res.status(400).json({ message: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      await addDoc(collection(db, "users"), {
        firstName,
        lastName,
        phone,
        gender,
        email,
        password: hashedPassword,
        userId,
      })
        .then((response) => {
          return res.status(201).json({ message: "User created successfully", id: response.id });
        })
        .catch((err) => {
          return res.status(500).json({ message: error });
        });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  public static async getUserData(req: Request, res: Response) {
    const { error, value } = userIdValidation.validate(req.params);

    if (error) return res.status(400).json({ message: error.message });

    try {
      const userDocRef = await doc(db, "users", value.id);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        delete userData.password;
        return res.status(200).json({ message: userData });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  }

  public static async getAllCampaigns(req: Request, res: Response) {
    try {
      console.log("Hello");
      const campaignsCollection = collection(db, "campaigns");
      const querySnapshot = await getDocs(campaignsCollection);

      const campaignsArray: any[] = [];

      querySnapshot.forEach((doc) => {
        const campaignData = doc.data();
        const campaignInfo = {
          documentId: doc.id,
          campaignName: campaignData.campaignName,
        };

        campaignsArray.push(campaignInfo);
      });

      return res.status(200).json({ campaigns: campaignsArray });
    } catch (err) {
      console.error("Error retrieving campaigns:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public static async getCampaign(req: Request, res: Response) {
    const { campaignId } = req.params;

    try {
      const campaignDocRef = doc(db, "campaigns", campaignId);
      const campaignDocSnapshot = await getDoc(campaignDocRef);

      if (!campaignDocSnapshot.exists()) return res.status(404).json({ message: "Campaign not found" });

      const campaignData = campaignDocSnapshot.data();

      // Extract the fields you need from the campaignData
      const {
        campaignName,
        orgName,
        latitude,
        longitude,
        Totalco2Sequestration,
        collectedAmount,
        targetAmount /* Add other fields if needed */,
      } = campaignData;

      return res.status(200).json({
        campaign: {
          campaignId: campaignId,
          campaignName,
          orgName,
          latitude,
          longitude,
          Totalco2Sequestration,
          collectedAmount,
          targetAmount,
          // Add other fields if needed
        },
      });
    } catch (err) {}
  }
}
