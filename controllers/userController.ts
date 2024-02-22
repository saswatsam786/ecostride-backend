import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { transactionCampaignValidation, userIdValidation, userSignUpValidation } from "../utilities/userValidation";
import { TransactionCampaignDTO, UserParam, UserSignUp } from "../dto/User";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
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
        transactions: [],
      })
        .then((response) => {
          return res.status(201).json({ message: "User created successfully", id: response.id });
        })
        .catch((err) => {
          return res.status(500).json({ message: err.message });
        });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  public static async getUserData(req: Request, res: Response) {
    const { error, value } = userIdValidation.validate(req.params);

    if (error) return res.status(400).json({ message: error.message });

    try {
      const userDocRef = await query(collection(db, "users"), where("email", "==", value.email));
      const userDocSnapshot = await getDocs(userDocRef);

      if (userDocSnapshot.size > 0) {
        const userData = userDocSnapshot.docs[0].data();
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
        plantdata,
        CarbonCredits,
        orgPhone,
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
          plantdata,
          CarbonCredits,
          orgPhone,
          // Add other fields if needed
        },
      });
    } catch (err) {
      console.error("Error retrieving campaign:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public static async transactionCampaign(req: Request, res: Response) {
    const { campaignId } = req.params;
    const { error, value } = transactionCampaignValidation.validate(<TransactionCampaignDTO>req.body);

    if (error) {
      return res.status(404).json({ message: error.message });
    }

    let transactionId = "";

    try {
      await addDoc(collection(db, "transactions"), {
        ...value,
        campaignId: campaignId,
      })
        .then(async (response) => {
          transactionId = response.id;

          const campaignDocRef = doc(db, "campaigns", campaignId);
          await updateDoc(campaignDocRef, {
            collectedAmount: increment(value.transactionDetails.amount),
            transactions: arrayUnion({
              timeStamp: value.transactionDetails.timeStamp,
              amount: value.transactionDetails.amount,
              status: value.transactionDetails.status,
            }),
          });

          const userDocRef = doc(db, "users", value.userId);
          await updateDoc(userDocRef, {
            transactions: arrayUnion(transactionId),
          }).catch((err) => {
            console.log(err, "hello");
          });
        })
        .catch((err) => {
          return res.status(404).json({ message: err });
        });

      return res.status(200).json({ message: "Transaction successful", transactionId: transactionId });
    } catch (err) {
      return res.status(404).json({ message: err });
    }
  }
}
