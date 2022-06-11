import { getDocs, doc, collection } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";

const fetchMinis = async () => {
  const docRef = collection(db, "minis");
  const collectionList = await getDocs(docRef);
  //console.log(collectionList.docs.map((doc) => doc));
  return collectionList.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

export default fetchMinis;
