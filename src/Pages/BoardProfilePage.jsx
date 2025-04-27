// import { useEffect, useState, useRef } from "react";
// import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
// import { auth, db } from "../firebase/config";
// import { useNavigate } from "react-router-dom";
// import gsap from "gsap";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const pageRef = useRef(null);

//   // States
//   const [lists, setLists] = useState([]);
//   const [newTask, setNewTask] = useState("");
//   const [newStatus, setNewStatus] = useState("todo");
//   const [editingTaskId, setEditingTaskId] = useState(null);
//   const [editingTaskTitle, setEditingTaskTitle] = useState("");

//   const [boards, setBoards] = useState([]);
//   const [newBoardName, setNewBoardName] = useState("");
//   const [newDueDate, setNewDueDate] = useState("");
//   const [newPriority, setNewPriority] = useState("medium");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activities, setActivities] = useState([]);
//   const [assignedTasks, setAssignedTasks] = useState([]);

//   const statusColumns = {
//     todo: "To Do",
//     inprogress: "In Progress",
//     done: "Done",
//   };

//   // Fetch all data
//   const fetchLists = async () => {
//     if (!auth.currentUser) return;
//     const listsRef = collection(db, "users", auth.currentUser.uid, "lists");
//     const snapshot = await getDocs(listsRef);
//     const listsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     setLists(listsData);
//   };

//   const fetchBoards = async () => {
//     if (!auth.currentUser) return;
//     const boardsRef = collection(db, "users", auth.currentUser.uid, "boards");
//     const snapshot = await getDocs(boardsRef);
//     const boardsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     setBoards(boardsList);
//   };

//   const fetchActivities = async () => {
//     if (!auth.currentUser) return;
//     const activitiesRef = collection(db, "users", auth.currentUser.uid, "activities");
//     const snapshot = await getDocs(activitiesRef);
//     const activitiesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     setActivities(activitiesList);
//   };

//   const fetchAssignedTasks = async () => {
//     if (!auth.currentUser) return;
//     const tasksRef = collection(db, "tasks");
//     const snapshot = await getDocs(tasksRef);
//     const userTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
//       .filter(task => task.assignedTo === auth.currentUser.email);
//     setAssignedTasks(userTasks);
//   };

//   useEffect(() => {
//     fetchLists();
//     fetchBoards();
//     fetchActivities();
//     fetchAssignedTasks();

//     gsap.from(pageRef.current, {
//       opacity: 0,
//       y: 50,
//       duration: 1,
//       ease: "power3.out",
//     });
//   }, []);

//   // Task operations
//   const addTask = async () => {
//     if (!newTask.trim()) return;
//     try {
//       const listsRef = collection(db, "users", auth.currentUser.uid, "lists");
//       await addDoc(listsRef, { title: newTask, status: newStatus });
//       setNewTask("");
//       setNewStatus("todo");
//       fetchLists();
//     } catch (error) {
//       console.error("Error adding task:", error);
//     }
//   };

//   const deleteTask = async (id) => {
//     try {
//       const taskRef = doc(db, "users", auth.currentUser.uid, "lists", id);
//       await deleteDoc(taskRef);
//       fetchLists();
//     } catch (error) {
//       console.error("Error deleting task:", error);
//     }
//   };

//   const startEditing = (id, currentTitle) => {
//     setEditingTaskId(id);
//     setEditingTaskTitle(currentTitle);
//   };

//   const saveEdit = async () => {
//     try {
//       const taskRef = doc(db, "users", auth.currentUser.uid, "lists", editingTaskId);
//       await updateDoc(taskRef, { title: editingTaskTitle });
//       setEditingTaskId(null);
//       setEditingTaskTitle("");
//       fetchLists();
//     } catch (error) {
//       console.error("Error updating task:", error);
//     }
//   };

//   const moveTask = async (id, newStatus) => {
//     try {
//       const taskRef = doc(db, "users", auth.currentUser.uid, "lists", id);
//       await updateDoc(taskRef, { status: newStatus });
//       fetchLists();
//     } catch (error) {
//       console.error("Error moving task:", error);
//     }
//   };

//   // Board operations
//   const createBoard = async () => {
//     if (!newBoardName.trim()) return;
//     const boardsRef = collection(db, "users", auth.currentUser.uid, "boards");
//     await addDoc(boardsRef, {
//       title: newBoardName,
//       createdAt: serverTimestamp(),
//       dueDate: newDueDate,
//       priority: newPriority,
//     });

//     // Log activity
//     const activitiesRef = collection(db, "users", auth.currentUser.uid, "activities");
//     await addDoc(activitiesRef, {
//       action: `Created board "${newBoardName}"`,
//       timestamp: serverTimestamp(),
//     });

//     setNewBoardName("");
//     setNewDueDate("");
//     setNewPriority("medium");

//     fetchBoards();
//     fetchActivities();
//   };

//   const handleLogout = async () => {
//     try {
//       await auth.signOut();
//       navigate("/login");
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   // Animations
//   const handleMouseEnter = (e) => {
//     gsap.to(e.currentTarget, {
//       scale: 1.05,
//       rotateX: 5,
//       rotateY: 5,
//       boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
//       duration: 0.4,
//     });
//   };

//   const handleMouseLeave = (e) => {
//     gsap.to(e.currentTarget, {
//       scale: 1,
//       rotateX: 0,
//       rotateY: 0,
//       boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
//       duration: 0.4,
//     });
//   };

//   return (
//     <div ref={pageRef} className="flex flex-col min-h-screen bg-gray-50">
//       {/* Navbar */}
//       <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
//         <div className="text-2xl font-bold text-blue-500 cursor-pointer" onClick={() => navigate("/")}>
//           Task Dashboard
//         </div>
//         <div className="flex gap-6 items-center">
//           <button onClick={() => navigate("/")} className="text-gray-600 hover:text-blue-500 transition font-semibold">Home</button>
//           <button onClick={handleLogout} className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">Logout</button>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="p-6 flex flex-col gap-12">

//         {/* Add Task */}
//         <div className="flex flex-col md:flex-row gap-4">
//           <input
//             type="text"
//             value={newTask}
//             onChange={(e) => setNewTask(e.target.value)}
//             placeholder="New Task..."
//             className="p-3 rounded-lg border w-full focus:ring-2 focus:ring-blue-300"
//           />
//           <select
//             value={newStatus}
//             onChange={(e) => setNewStatus(e.target.value)}
//             className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-300"
//           >
//             <option value="todo">To Do</option>
//             <option value="inprogress">In Progress</option>
//             <option value="done">Done</option>
//           </select>
//           <button onClick={addTask} className="px-5 py-3 bg-blue-400 text-white font-semibold rounded-lg hover:bg-blue-500">
//             + Add Task
//           </button>
//         </div>

//         {/* Create Board */}
//         <div className="flex flex-col md:flex-row gap-4">
//           <input
//             type="text"
//             placeholder="New Board Name..."
//             value={newBoardName}
//             onChange={(e) => setNewBoardName(e.target.value)}
//             className="p-3 rounded-lg border w-full focus:ring-2 focus:ring-purple-400"
//           />
//           <input
//             type="date"
//             value={newDueDate}
//             onChange={(e) => setNewDueDate(e.target.value)}
//             className="p-3 rounded-lg border focus:ring-2 focus:ring-blue-400"
//           />
//           <select
//             value={newPriority}
//             onChange={(e) => setNewPriority(e.target.value)}
//             className="p-3 rounded-lg border focus:ring-2 focus:ring-green-400"
//           >
//             <option value="low">Low</option>
//             <option value="medium">Medium</option>
//             <option value="high">High</option>
//           </select>
//           <button onClick={createBoard} className="px-5 py-3 bg-purple-400 text-white font-semibold rounded-lg hover:bg-purple-500">
//             + Create Board
//           </button>
//         </div>

//         {/* Boards List */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {boards
//             .filter(board => board.title.toLowerCase().includes(searchTerm.toLowerCase()))
//             .map(board => (
//               <div
//                 key={board.id}
//                 onMouseEnter={handleMouseEnter}
//                 onMouseLeave={handleMouseLeave}
//                 className="bg-white p-6 rounded-2xl shadow-lg cursor-pointer"
//               >
//                 <h2 className="text-2xl font-bold text-purple-700">{board.title}</h2>
//                 <p className="text-sm text-gray-500">Created: {board.createdAt?.seconds ? new Date(board.createdAt.seconds * 1000).toLocaleDateString() : "Just now"}</p>
//                 <p className="text-sm">Due: {board.dueDate || "No Due Date"}</p>
//                 <p className={`text-sm font-bold ${
//                   board.priority === "high" ? "text-red-500" :
//                   board.priority === "medium" ? "text-yellow-500" :
//                   "text-green-500"
//                 }`}>
//                   Priority: {board.priority}
//                 </p>
//               </div>
//           ))}
//         </div>

//         {/* Task Board Columns */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {Object.entries(statusColumns).map(([statusKey, statusLabel]) => (
//             <div key={statusKey} className="p-4 bg-sky-100 rounded-2xl min-h-[300px]">
//               <h2 className="text-xl font-bold mb-4">{statusLabel}</h2>
//               {lists.filter(list => list.status === statusKey).map(list => (
//                 <div key={list.id} className="bg-white p-3 rounded-lg shadow mb-3">
//                   {editingTaskId === list.id ? (
//                     <>
//                       <input
//                         type="text"
//                         value={editingTaskTitle}
//                         onChange={(e) => setEditingTaskTitle(e.target.value)}
//                         className="border p-2 rounded"
//                       />
//                       <button onClick={saveEdit} className="bg-violet-400 p-1 mt-2 text-white rounded">Save</button>
//                     </>
//                   ) : (
//                     <>
//                       <h3 className="font-semibold">{list.title}</h3>
//                       <div className="flex gap-2 flex-wrap mt-2">
//                         <button onClick={() => startEditing(list.id, list.title)} className="bg-violet-400 p-1 text-white rounded">Edit</button>
//                         <button onClick={() => deleteTask(list.id)} className="bg-rose-400 p-1 text-white rounded">Delete</button>
//                         {Object.keys(statusColumns).map(status =>
//                           status !== statusKey && (
//                             <button
//                               key={status}
//                               onClick={() => moveTask(list.id, status)}
//                               className="bg-green-400 p-1 text-white rounded"
//                             >
//                               {statusColumns[status]}
//                             </button>
//                           )
//                         )}
//                       </div>
//                     </>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>

//         {/* Activities */}
//         <div className="mt-12">
//           <h2 className="text-3xl font-bold text-purple-700 mb-4">Activity Log 📜</h2>
//           {activities.map(activity => (
//             <div key={activity.id} className="bg-white p-3 rounded-md shadow-md mb-2">
//               <p>{activity.action}</p>
//               <p className="text-sm text-gray-400">{activity.timestamp?.seconds ? new Date(activity.timestamp.seconds * 1000).toLocaleString() : "Just now"}</p>
//             </div>
//           ))}
//         </div>

//         {/* Assigned Tasks */}
//         <div className="mt-12">
//           <h2 className="text-3xl font-bold text-purple-700 mb-4">Assigned Tasks 📌</h2>
//           {assignedTasks.map(task => (
//             <div key={task.id} className="bg-white p-3 rounded-md shadow-md mb-2">
//               <p className="font-semibold">{task.title}</p>
//               <p className="text-sm text-gray-500">{task.status || "Pending"}</p>
//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Dashboard;
