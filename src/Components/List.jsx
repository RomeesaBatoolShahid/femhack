import { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import Card from "./Card";

const List = ({ title, listId }) => {
  const [cards, setCards] = useState([]);
  const [newCardTitle, setNewCardTitle] = useState("");

  const fetchCards = async () => {
    const cardsRef = collection(db, "boards", auth.currentUser.uid, "lists", listId, "cards");
    const querySnapshot = await getDocs(cardsRef);
    const cardsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCards(cardsData);
  };

  const handleAddCard = async () => {
    if (newCardTitle.trim() === "") return;
    await addDoc(collection(db, "boards", auth.currentUser.uid, "lists", listId, "cards"), {
      title: newCardTitle,
      createdAt: new Date(),
    });
    setNewCardTitle("");
    fetchCards();
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl p-4 min-w-[250px] shadow-lg flex flex-col gap-4">
      <h2 className="text-xl font-bold">{title}</h2>
      
      {cards.map((card) => (
        <Card key={card.id} title={card.title} />
      ))}

      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          placeholder="New Card"
          className="border p-2 rounded"
        />
        <button onClick={handleAddCard} className="bg-blue-500 hover:bg-blue-600 text-white px-2 rounded">
          +
        </button>
      </div>
    </div>
  );
};

export default List;
