import React, { useEffect, useState } from "react";
import "./App.css";
import { MdDelete } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { firestore } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

const App = () => {
  // State to manage the view of todos (active or completed)
  const [iscomplescreen, setiscompletescreen] = useState(false);
  // State to hold new todo title
  const [newtitle, setnewtitle] = useState("");
  // State to hold new todo description
  const [newdescription, setnewdescription] = useState("");
  // State to store active todos
  const [alltodo, setalltodo] = useState([]);
  // State to store completed todos
  const [completetodo, setcompletetodo] = useState([]);

  // Reference to the 'todos' collection in Firestore
  const todosCollectionRef = collection(firestore, "todos");

  // Function to fetch todos from Firestore
  const fetchTodos = async () => {
    const data = await getDocs(todosCollectionRef);
    const todos = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setalltodo(todos.filter((todo) => !todo.completed)); // Filter active todos
    setcompletetodo(todos.filter((todo) => todo.completed)); // Filter completed todos
  };

  // Function to add a new todo
  const handleAddtodo = async () => {
    if (newtitle.trim() === "" || newdescription.trim() === "") {
      alert("Please enter both title and description.");
      return;
    }

    try {
      // Add new todo to Firestore
      await addDoc(todosCollectionRef, {
        title: newtitle,
        description: newdescription,
        completed: false,
        completedon: null,
      });
      // Clear input fields
      setnewtitle("");
      setnewdescription("");
      fetchTodos(); // Refresh the todo list
    } catch (error) {
      console.error("Error adding todo: ", error);
    }
  };

  // Function to delete a todo
  const handledeletetodo = async (id) => {
    try {
      const todoDoc = doc(firestore, "todos", id);
      await deleteDoc(todoDoc);
      fetchTodos(); // Refresh the todo list
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  };

  // Function to mark a todo as completed
  const handlecompletetodo = async (id) => {
    try {
      const now = new Date();
      const completedon = `${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;

      // Create new completed todo entry in Firestore
      await addDoc(todosCollectionRef, {
        ...alltodo.find((todo) => todo.id === id),
        completed: true,
        completedon,
      });

      // Delete original todo
      await deleteDoc(doc(firestore, "todos", id));
      fetchTodos();
    } catch (error) {
      console.error("Error completing todo: ", error);
    }
  };

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="app">
      <h1>My todos</h1>
      <div className="todo_wrapper">
        {/* Form to add a new todo */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddtodo();
          }}
        >
          <div className="todo_input">
            <div className="todo_input_item">
              <label htmlFor="">Title:</label>
              <input
                type="text"
                value={newtitle}
                onChange={(e) => setnewtitle(e.target.value)}
                placeholder="What's the task title?"
              />
            </div>
            <div className="todo_input_item">
              <label htmlFor="">Description:</label>
              <input
                type="text"
                value={newdescription}
                onChange={(e) => setnewdescription(e.target.value)}
                placeholder="What's the task description?"
              />
            </div>
            <div className="todo_input_item">
              <button type="submit" className="primarybtn">
                Add
              </button>
            </div>
          </div>
        </form>

        {/* Toggle between Todo and Completed views */}
        <div className="btn_area">
          <button
            className={`secbtn ${!iscomplescreen && "active"}`}
            onClick={() => setiscompletescreen(false)}
          >
            Todo
          </button>
          <button
            className={`secbtn ${iscomplescreen && "active"}`}
            onClick={() => setiscompletescreen(true)}
          >
            Completed
          </button>
        </div>

        {/* Display Todo List */}
        <div className="todo_list">
          {!iscomplescreen &&
            alltodo.map((item) => (
              <div className="todo_list_item" key={item.id}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <div>
                  <MdDelete
                    title="Delete?"
                    onClick={() => handledeletetodo(item.id)}
                    className="delicon"
                  />
                  <FaCheck
                    title="Complete?"
                    onClick={() => handlecompletetodo(item.id)}
                    className="checkicon"
                  />
                </div>
              </div>
            ))}

          {/* Display Completed Todos */}
          {iscomplescreen &&
            completetodo.map((item) => (
              <div className="todo_list_item" key={item.id}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p>
                    <small>Completed on: {item.completedon}</small>
                  </p>
                </div>
                <div>
                  <MdDelete
                    title="Delete?"
                    onClick={() => handledeletetodo(item.id)}
                    className="delicon"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;
