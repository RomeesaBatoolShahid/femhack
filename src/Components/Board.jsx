import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/config"; 
import { onAuthStateChanged } from "firebase/auth";

const BoardPage = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchLists(user.uid);
      } else {
        console.log("User not logged in yet.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchLists = async (uid) => {
    try {
      const listsRef = collection(db, "users", uid, "lists");
      const listsSnapshot = await getDocs(listsRef);
      const listsData = listsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLists(listsData);
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-pastelPink text-gray-700">
        <p className="text-2xl font-bold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-pastelPink min-h-screen overflow-auto">
      <h1 className="text-5xl font-bold text-gray-800 mb-10 text-center drop-shadow-lg">
        Your Boards 📋
      </h1>

      {lists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {lists.map((list) => (
            <div 
              key={list.id} 
              className="bg-pastelBlue rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 ease-in-out"
            >
              <h2 className="text-2xl font-bold text-gray-700">{list.title}</h2>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl font-medium text-gray-600">
          No lists found. Create one!
        </p>
      )}
    </div>
  );
};

export default BoardPage;
