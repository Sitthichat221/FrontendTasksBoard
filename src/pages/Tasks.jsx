import React, { useState, useEffect } from 'react';
import { getMyTasks, createTask, updateTaskStatus, deleteTask, assignTask, getAssignedTasks } from '../api';
import { useNavigate } from 'react-router-dom';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'To Do',
    dueDate: '',
  });
  const [assignEmails, setAssignEmails] = useState({});
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const response = await getMyTasks(token);
          setTasks(response.data);
        } catch (err) {
          setError('ไม่สามารถดึงข้อมูลงานได้');
        }
      }
    };

    const fetchAssignedTasks = async () => {
      if (token) {
        try {
          const response = await getAssignedTasks(token);
          setAssignedTasks(response);
        } catch (err) {
          setError('ไม่สามารถดึงงานที่ได้รับมอบหมาย');
        }
      }
    };

    fetchData();
    fetchAssignedTasks();
  }, [token]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await createTask(newTask, token);
      setTasks([...tasks, response.data]);
      setNewTask({
        title: '',
        description: '',
        status: 'To Do',
        dueDate: '',
      });
      setShowForm(false);
    } catch (err) {
      setError('ไม่สามารถสร้างงานได้');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const response = await updateTaskStatus(taskId, newStatus, token);
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      setError('ไม่สามารถอัปเดตสถานะได้');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId, token);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError('ไม่สามารถลบงานได้');
    }
  };

  const handleAssignTask = async (taskId, email) => {
    try {
      const response = await assignTask(taskId, email, token);
      const updatedTask = response.data;
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                assignedToUsers: [
                  ...task.assignedToUsers,
                  { email: email },
                ],
                status: updatedTask.status,
              }
            : task
        )
      );
      setAssignEmails({ ...assignEmails, [taskId]: '' });
    } catch (err) {
      setError('ไม่สามารถมอบหมายงานได้');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleEmailChange = (taskId, email) => {
    setAssignEmails({ ...assignEmails, [taskId]: email });
  };

  return (
    <div className="tasks-container">
      <header className="tasks-header">
        <h1>Main Board</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <main className="tasks-main">
        <div className="tasks-sidebar">
          <button 
            className="add-task-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add a task'}
          </button>
          
          {showForm && (
            <div className="task-form-container">
              <h3>Add New Task</h3>
              <form onSubmit={handleCreateTask} className="task-form">
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Due Date:</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">Create Task</button>
              </form>
            </div>
          )}
        </div>

        <div className="tasks-content">
          {error && <div className="error-message">{error}</div>}
          
          <div className="tasks-section">
            <h2>My Tasks</h2>
            {tasks.length === 0 ? (
              <div className="empty-state">
                <p>No tasks yet</p>
                <p>Click "+" above to add a new task</p>
              </div>
            ) : (
              <div className="tasks-grid">
                {tasks.map((task) => (
                  <div key={task.id} className="task-card">
                    <div className="task-header">
                      <h3>{task.title}</h3>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        ×
                      </button>
                    </div>
                    <p className="task-description">{task.description}</p>
                    
                    <div className="task-meta">
                      <span className={`status-badge ${task.status.replace(' ', '-').toLowerCase()}`}>
                        {task.status}
                      </span>
                      <span className="due-date">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="assign-section">
                      <div className="assign-input">
                        <input
                          type="email"
                          placeholder="Enter email to assign"
                          value={assignEmails[task.id] || ''}
                          onChange={(e) => handleEmailChange(task.id, e.target.value)}
                        />
                        <button 
                          className="assign-btn"
                          onClick={() => handleAssignTask(task.id, assignEmails[task.id])}
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                    
                    <div className="assigned-users">
                      <h4>Assigned To:</h4>
                      {task.assignedToUsers && task.assignedToUsers.length > 0 ? (
                        <ul>
                          {task.assignedToUsers.map((user, index) => (
                            <li key={index}>{user.email}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No users assigned</p>
                      )}
                    </div>
                    
                    <div className="task-actions">
                      <button 
                        className={`action-btn ${task.status === 'In Progress' ? 'active' : ''}`}
                        onClick={() => handleUpdateStatus(task.id, 'In Progress')}
                      >
                        Start
                      </button>
                      <button 
                        className={`action-btn ${task.status === 'Completed' ? 'active' : ''}`}
                        onClick={() => handleUpdateStatus(task.id, 'Completed')}
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="tasks-section">
            <h2>Assigned To Me</h2>
            {assignedTasks.length === 0 ? (
              <div className="empty-state">
                <p>No tasks assigned to you yet</p>
              </div>
            ) : (
              <div className="tasks-grid">
                {assignedTasks.map((task, index) => (
                  <div key={index} className="task-card">
                    <h3>{task[0]}</h3>
                    <p className="task-description">{task[1]}</p>
                    <div className="task-meta">
                      <span className={`status-badge ${task[5].replace(/"/g, '').replace(' ', '-').toLowerCase()}`}>
                        {task[5].replace(/"/g, '')}
                      </span>
                      <span className="due-date">
                        Due: {new Date(task[4]).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tasks;