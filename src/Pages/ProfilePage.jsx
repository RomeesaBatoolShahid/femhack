import { useEffect, useState, useRef } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const ProfilePage = () => {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [searchTerm, setSearchTerm] = useState("");
  const [activities, setActivities] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const navigate = useNavigate();
  const pageRef = useRef(null);

  // Fetch Boards
  const fetchBoards = async () => {
    if (!auth.currentUser) return;
    const boardsRef = collection(db, "users", auth.currentUser.uid, "boards");
    const snapshot = await getDocs(boardsRef);
    const boardsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setBoards(boardsList);
  };

  // Fetch Activities
  const fetchActivities = async () => {
    if (!auth.currentUser) return;
    const activitiesRef = collection(db, "users", auth.currentUser.uid, "activities");
    const snapshot = await getDocs(activitiesRef);
    const activitiesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setActivities(activitiesList);
  };

  // Fetch Assigned Tasks
  const fetchAssignedTasks = async () => {
    if (!auth.currentUser) return;
    const tasksRef = collection(db, "tasks");
    const snapshot = await getDocs(tasksRef);
    const userTasks = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(task => task.assignedTo === auth.currentUser.email);
    setAssignedTasks(userTasks);
  };

  // Create Board
  const createBoard = async () => {
    if (!newBoardName.trim()) return;
    const boardsRef = collection(db, "users", auth.currentUser.uid, "boards");
    await addDoc(boardsRef, {
      title: newBoardName,
      createdAt: serverTimestamp(),
      dueDate: newDueDate,
      priority: newPriority,
    });

    // Log activity
    const activitiesRef = collection(db, "users", auth.currentUser.uid, "activities");
    await addDoc(activitiesRef, {
      action: `Created board "${newBoardName}"`,
      timestamp: serverTimestamp(),
    });

    // Reset inputs
    setNewBoardName("");
    setNewDueDate("");
    setNewPriority("medium");

    fetchBoards();
    fetchActivities();
  };

  useEffect(() => {
    fetchBoards();
    fetchActivities();
    fetchAssignedTasks();

    // Animate page on mount
    gsap.from(pageRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  // GSAP Card hover
  const handleMouseEnter = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1.05,
      rotateX: 5,
      rotateY: 5,
      boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
      duration: 0.4,
    });
  };

  const handleMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
      duration: 0.4,
    });
  };

  return (
    <div ref={pageRef} className="min-h-screen p-8 bg-gradient-to-br from-pink-100 via-blue-100 to-purple-200">
      <h1 className="text-4xl font-bold text-purple-800 mb-10 text-center">Your Profile 📋</h1>

      {/* Create Board */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10 max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Board name..."
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          className="p-4 rounded-xl border w-full focus:outline-none focus:ring-4 focus:ring-purple-400 shadow-md"
        />
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          className="p-4 rounded-xl border focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-md"
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
          className="p-4 rounded-xl border focus:outline-none focus:ring-4 focus:ring-green-400 shadow-md"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          onClick={createBoard}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-xl font-bold shadow-lg transition"
        >
          + Create
        </button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search boards..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-4 mb-10 rounded-xl border w-full focus:outline-none focus:ring-4 focus:ring-blue-400 shadow-md"
      />

      {/* Boards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {boards
          .filter(board => board.title.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(board => (
            <div
              key={board.id}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => navigate(`/board/${board.id}`)}
              className="bg-white p-6 rounded-2xl shadow-md cursor-pointer transform transition-transform duration-300"
            >
              <h2 className="text-2xl font-bold text-purple-700 mb-2">{board.title}</h2>
              <p className="text-gray-500 text-sm">
                Created {board.createdAt?.seconds ? new Date(board.createdAt.seconds * 1000).toLocaleDateString() : "just now"}
              </p>
              <p className="text-gray-700 text-sm mt-1">Due: {board.dueDate || "No due date"}</p>
              <p className={`text-sm font-bold mt-1 ${
                board.priority === "high" ? "text-red-500" :
                board.priority === "medium" ? "text-yellow-500" : "text-green-500"
              }`}>
                Priority: {board.priority || "Medium"}
              </p>
            </div>
          ))}
      </div>

      {/* No Boards */}
      {boards.length === 0 && (
        <p className="text-gray-500 mt-10 text-center text-xl">No boards yet. Create your first one!</p>
      )}

      {/* Activity Log */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-6 text-purple-700">Activity Log 📜</h2>
        {activities.length > 0 ? (
          activities.map(activity => (
            <div key={activity.id} className="bg-white p-4 rounded-md shadow-md mb-3">
              <p className="text-gray-700">{activity.action}</p>
              <p className="text-gray-400 text-sm">
                {activity.timestamp?.seconds ? new Date(activity.timestamp.seconds * 1000).toLocaleString() : "just now"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No activities logged yet.</p>
        )}
      </div>

      {/* Assigned Tasks */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-6 text-purple-700">Your Assigned Tasks 📌</h2>
        {assignedTasks.length > 0 ? (
          assignedTasks.map(task => (
            <div key={task.id} className="bg-white p-4 rounded-md shadow-md mb-3">
              <p className="font-bold">{task.title}</p>
              <p className="text-gray-500">{task.status || "Pending"}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No tasks assigned yet.</p>
        )}
      </div>

    </div>
  );
};

export default ProfilePage;
