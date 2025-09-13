import {
  collection,
  addDoc,
  doc,
  updateDoc,
  Timestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase-client";
import { CustomerToken } from "@/types";

export function generateToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

export async function createCustomerToken(
  createdBy: string,
  customerName?: string,
  customerPhone?: string,
  customerAddress?: string,
  expirationHours: number = 48
): Promise<string> {
  const db = getFirebaseDb();
  const token = generateToken();
  const now = Timestamp.now();
  const expiresAt = Timestamp.fromMillis(
    now.toMillis() + expirationHours * 60 * 60 * 1000
  );

  const tokenData = {
    token,
    customerName: customerName || "",
    customerPhone: customerPhone || "",
    customerAddress: customerAddress || "",
    createdAt: now,
    expiresAt,
    createdBy,
    isUsed: false,
  };

  await addDoc(collection(db, "customer-tokens"), tokenData);
  return token;
}

export async function validateCustomerToken(token: string): Promise<{
  isValid: boolean;
  tokenData?: CustomerToken;
  reason?: string;
}> {
  try {
    const db = getFirebaseDb();
    const q = query(
      collection(db, "customer-tokens"),
      where("token", "==", token)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { isValid: false, reason: "Token not found" };
    }

    const tokenDoc = querySnapshot.docs[0];
    const tokenData = { id: tokenDoc.id, ...tokenDoc.data() } as CustomerToken;

    if (tokenData.isUsed) {
      return { isValid: false, reason: "Token already used", tokenData };
    }

    const now = Timestamp.now();
    if (tokenData.expiresAt.toMillis() < now.toMillis()) {
      return { isValid: false, reason: "Token expired", tokenData };
    }

    return { isValid: true, tokenData };
  } catch (error) {
    console.error("Error validating token:", error);
    return { isValid: false, reason: "Validation error" };
  }
}

export async function markTokenAsUsed(
  tokenId: string,
  orderId: string
): Promise<void> {
  try {
    const db = getFirebaseDb();
    const tokenRef = doc(db, "customer-tokens", tokenId);

    await updateDoc(tokenRef, {
      isUsed: true,
      usedAt: Timestamp.now(),
      orderId,
    });
  } catch (error) {
    console.error("Error marking token as used:", error);
    throw error;
  }
}

export async function getActiveTokens(
  createdBy?: string
): Promise<CustomerToken[]> {
  try {
    const db = getFirebaseDb();
    let q = query(
      collection(db, "customer-tokens"),
      where("isUsed", "==", false)
    );

    if (createdBy) {
      q = query(q, where("createdBy", "==", createdBy));
    }

    const querySnapshot = await getDocs(q);
    const tokens: CustomerToken[] = [];

    querySnapshot.forEach((doc) => {
      tokens.push({ id: doc.id, ...doc.data() } as CustomerToken);
    });

    const now = Timestamp.now();
    return tokens.filter(
      (token) => token.expiresAt.toMillis() > now.toMillis()
    );
  } catch (error) {
    console.error("Error fetching active tokens:", error);
    return [];
  }
}
