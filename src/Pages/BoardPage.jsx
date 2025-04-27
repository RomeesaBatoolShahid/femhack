
import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const Board = () => {
  const [lists, setLists] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newStatus, setNewStatus] = useState("todo");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    if (!auth.currentUser) return;
    const listsRef = collection(db, "users", auth.currentUser.uid, "lists");
    const snapshot = await getDocs(listsRef);
    const listsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setLists(listsData);
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const listsRef = collection(db, "users", auth.currentUser.uid, "lists");
      await addDoc(listsRef, { title: newTask, status: newStatus });
      setNewTask("");
      setNewStatus("todo");
      fetchLists();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const taskRef = doc(db, "users", auth.currentUser.uid, "lists", id);
      await deleteDoc(taskRef);
      fetchLists();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const startEditing = (id, currentTitle) => {
    setEditingTaskId(id);
    setEditingTaskTitle(currentTitle);
  };

  const saveEdit = async () => {
    try {
      const taskRef = doc(db, "users", auth.currentUser.uid, "lists", editingTaskId);
      await updateDoc(taskRef, { title: editingTaskTitle });
      setEditingTaskId(null);
      setEditingTaskTitle("");
      fetchLists();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const moveTask = async (id, newStatus) => {
    try {
      const taskRef = doc(db, "users", auth.currentUser.uid, "lists", id);
      await updateDoc(taskRef, { status: newStatus });
      fetchLists();
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login"); // or wherever your login page is
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const statusColumns = {
    todo: "To Do",
    inprogress: "In Progress",
    done: "Done",
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="text-2xl font-bold text-blue-500 cursor-pointer" onClick={() => navigate("/")}>
          TaskBoard
        </div>
        <div className="flex gap-6 items-center">
          <button 
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-blue-500 transition font-semibold"
          >
            Home
          </button>
          <button 
            onClick={() => navigate("/board")}
            className="text-gray-600 hover:text-blue-500 transition font-semibold"
          >
            Board
          </button>
          <button 
            onClick={handleLogout}
            className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center gap-8 w-full p-6">
        
        {/* Add New Task */}
        <div className="flex flex-col md:flex-row gap-4 items-center w-full max-w-3xl">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter new task..."
            className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
          />
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button 
            onClick={addTask}
            className="px-5 py-3 bg-blue-400 text-white font-semibold rounded-lg hover:bg-blue-500 transition"
          >
            Add
          </button>
        </div>

        {/* Board Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {Object.entries(statusColumns).map(([statusKey, statusLabel]) => (
            <div 
              key={statusKey}
              className={`p-6 rounded-2xl shadow-xl min-h-[350px] flex flex-col gap-4 ${
                statusKey === "todo" ? "bg-sky-100" :
                statusKey === "inprogress" ? "bg-purple-100" :
                "bg-green-100"
              }`}
            >
              <h2 className="text-2xl font-bold text-center text-gray-700">{statusLabel}</h2>
              {lists.filter(list => list.status === statusKey).map(list => (
                <div key={list.id} className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-2">
                  {editingTaskId === list.id ? (
                    <>
                      <input 
                        type="text"
                        value={editingTaskTitle}
                        onChange={(e) => setEditingTaskTitle(e.target.value)}
                        className="border p-2 rounded focus:ring-2 focus:ring-violet-300"
                      />
                      <div className="flex gap-2 mt-2">
                        <button onClick={saveEdit} className="bg-violet-400 text-white px-3 py-1 rounded hover:bg-violet-500">
                          Save
                        </button>
                        <button onClick={() => setEditingTaskId(null)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold">{list.title}</h3>
                      <div className="flex gap-2 flex-wrap mt-2">
                        <button onClick={() => startEditing(list.id, list.title)} className="bg-violet-400 text-white px-3 py-1 rounded hover:bg-violet-500">
                          Edit
                        </button>
                        <button onClick={() => deleteTask(list.id)} className="bg-rose-400 text-white px-3 py-1 rounded hover:bg-rose-500">
                          Delete
                        </button>
                        {statusKey !== "todo" && (
                          <button onClick={() => moveTask(list.id, "todo")} className="bg-sky-400 text-white px-3 py-1 rounded hover:bg-sky-500">
                            To Do
                          </button>
                        )}
                        {statusKey !== "inprogress" && (
                          <button onClick={() => moveTask(list.id, "inprogress")} className="bg-amber-400 text-white px-3 py-1 rounded hover:bg-amber-500">
                            In Progress
                          </button>
                        )}
                        {statusKey !== "done" && (
                          <button onClick={() => moveTask(list.id, "done")} className="bg-emerald-400 text-white px-3 py-1 rounded hover:bg-emerald-500">
                            Done
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Board;
