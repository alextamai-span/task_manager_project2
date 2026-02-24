// imports
// -------
import React, { useState, useEffect } from 'react';
import './App.css'

function App() {
  // declaring variables 
  const [taskInput, setTaskInput] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Select');
  const [deadline, setDeadline] = useState('');
  const [editId, setEditId] = useState(null);

  // storing a task in local storage
  // -------------------------------
  // useState: track the functions current state
  const [tasks, setTasks] = useState(() => {
    try {
      // get the saved tasks from local storage
      const saved = localStorage.getItem('tasks');

      // if there are saved tasks 
      if (saved && saved !== "undefined") {
        // parse the JSON string from localStorage back into a JavaScript array of task objects.
        return JSON.parse(saved);
      }
    }
    catch (error) {
      // if there is an error during parsing, log the error and return an empty array
      console.error("Failed to parse tasks from localStorage", error);
    }
    return [];
  });

  // update task in local storage
  // ----------------------------
  // useEffect: side effects for elements/components, runs after any changes to tasks
  useEffect(() => {
    // updating the tasks in local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // on submit - add a task to the list 
  // ----------------------------------
  const handleSubmit = (e: any) => {
    // prevent automatic page refresh
    e.preventDefault();

    // validating task
    if(!taskInput.trim()) {
      // empty task, alert the user and return
      alert('Please add an task!')
      return;
    }

    // validating category
    if (category === 'Select') {
      // no category selected, alert the user and return
      alert('Please select a category!')
      return;
    }

    // validating date
    const today = new Date().toISOString().split('T')[0];
    if (!deadline || deadline < today) {
      // invalid date, alert the user and return
      alert('Please select a date in the future!');
      return;
    }

    // successful task
    const new_task = {
        // adds a random unique id
        // should be auto-incremented in a real application, but for simplicity we use random number here
        id: Math.floor(Math.random() * 10000000),
        title: taskInput,
        description: description,
        category: category,
        deadline: deadline,
        isCompleted: false
    };

    // update the local storage
    setTasks([...tasks, new_task]);

    // clear
    setTaskInput('');
    setDescription('');
    setCategory('Select');
    setDeadline('');
  };

  // remove a task from the list
  // ---------------------------
  const removeTask = (id: any) => {
    // filter out the task with the given id and update the tasks state
    setTasks(tasks.filter((task: any) => task.id !== id));
  };

  // toggle task completion status
  // -----------------------------
  const toggleComplete = (id: any) => {
    // map through the tasks and toggle the isCompleted property of the task with the given id, then update the tasks state
    setTasks(tasks.map((task: any) => 
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };

  // start editing a task
  // --------------------
  const startEdit = (task: any) => {
    // auto-fill the form with the task's current details for editing, set the editId to the task's id)
    setEditId(task.id);
    setTaskInput(task.title);
    setDescription(task.description);
    setCategory(task.category);
    setDeadline(task.deadline);

    // remove the task from the list
    removeTask(task.id);
  };

  // clear all tasks from the list
  // -----------------------------
  const clearAll = () => {
    // confirm with the user before clearing all tasks
    if (window.confirm("Are you sure you want to clear all tasks?")) {
      // if confirmed, set tasks to an empty array
      setTasks([]);
    }
  };

  return (
    <>
      <div>
        {/* header for the app */}
        <header>
          <h1>Task Manager</h1>
        </header>

        {/* form for adding/editing tasks */}
        <form id="task-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-input"
              value={taskInput}
              name="task"
              placeholder="Enter task"
              onChange={(e) => setTaskInput(e.target.value)}
            />

            <input
              type="text"
              className="form-input"
              value={description}
              name="description"
              placeholder="Enter description (optional)"
              onChange={(e) => setDescription(e.target.value)}
            />

            <label htmlFor="Category">Category: </label>
            <select name="categories" value={category} onChange={(e) => setCategory(e.target.value)} className="form-category">
              <option value="Select">Select</option>
              <option value="Work">Work</option>
              <option value="Family">Family</option>
              <option value="Personal">Personal</option>
              <option value="Other">Other</option>
            </select>

            <label htmlFor="Deadline">Deadline: </label>
            <input
              type="date"
              className="form-deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
        
            <button type="submit" className="btn">
              <i className="fa-solid fa-plus"></i>Add Task
            </button>
        </form>

        <ul id="task-list" className="tasks">{tasks.map((task: any) => (
          <li key={task.id} className={task.isCompleted ? 'completed-task' : ''}>
            <div className="task-info">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p><strong>Category:</strong> {task.category}</p>
              <p><strong>Deadline:</strong> {task.deadline}</p>
            </div>
            
            <div className="task-actions">
              <button onClick={() => toggleComplete(task.id)} className="complete-btn">
                <i className="fa-solid fa-check"></i>
                <img src="check.png" alt="Complete" className="action-icon" />
              </button>
              <button onClick={() => startEdit(task)} className="edit-btn">
                <i className="fa-solid fa-pen"></i>
                <img src="edit.png" alt="Edit" className="action-icon" />
              </button>
              <button onClick={() => removeTask(task.id)} className="delete-btn">
                <i className="fa-solid fa-trash"></i>
                <img src="trash.png" alt="Delete" className="action-icon" />
              </button>
            </div>
          </li>
          ))}
        </ul>

        <button onClick={clearAll} className="btn clear-btn">Clear All</button>
      </div>
    </>
  )
}

export default App
