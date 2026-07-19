import { getDocsFromServer, collection } from "firebase/firestore";
import { db } from "../firebase.config";
import type { Mini } from "../types/mini";

const fetchMinis = async (): Promise<Mini[]> => {
  const docRef = collection(db, "minis");
  const collectionList = await getDocsFromServer(docRef);
  return collectionList.docs
    .map((doc) => ({ ...(doc.data() as Omit<Mini, "id">), id: doc.id }))
    .sort((a, b) => {
      const setComparison = a.set.localeCompare(b.set);
      if (setComparison === 0) {
        return Number(a.number) - Number(b.number);
      }
      return setComparison;
    });
};

export default fetchMinis;
