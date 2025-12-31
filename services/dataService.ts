
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp,
  QuerySnapshot,
  DocumentData
} from "firebase/firestore";
import { db, isFirebaseReady } from "./firebaseConfig.ts";

export const subscribeToCollection = (collectionName: string, callback: (data: any[]) => void) => {
  if (!isFirebaseReady || !db) {
    console.warn(`Firebase não pronto para assinar ${collectionName}.`);
    return () => {};
  }

  try {
    const q = query(collection(db, collectionName), orderBy("updatedAt", "desc"));
    return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const items = snapshot.docs.map(item => ({
        id: item.id,
        ...item.data()
      }));
      callback(items);
    }, (error) => {
      console.error(`Erro ao assinar ${collectionName}:`, error);
    });
  } catch (err) {
    console.error(`Falha ao iniciar listener de ${collectionName}:`, err);
    return () => {};
  }
};

export const addDocument = async (collectionName: string, data: any) => {
  if (!isFirebaseReady || !db) throw new Error("Firebase não configurado.");
  return await addDoc(collection(db, collectionName), {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const updateDocument = async (collectionName: string, id: string, data: any) => {
  if (!isFirebaseReady || !db) throw new Error("Firebase não configurado.");
  const docRef = doc(db, collectionName, id);
  return await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const removeDocument = async (collectionName: string, id: string) => {
  if (!isFirebaseReady || !db) throw new Error("Firebase não configurado.");
  const docRef = doc(db, collectionName, id);
  return await deleteDoc(docRef);
};
