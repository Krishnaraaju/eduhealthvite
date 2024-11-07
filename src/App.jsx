// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({ title: '', content: '', category: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/resources')
      .then(response => {
        setResources(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching resources:', error);
        setError('Failed to fetch resources.');
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewResource(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/resources', newResource)
      .then(response => {
        setResources([...resources, response.data]);
        setNewResource({ title: '', content: '', category: '' });
      })
      .catch(error => {
        console.error('Error adding resource:', error);
        setError('Failed to add resource.');
      });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>

    <div className={`main-container ${darkMode ? 'dark-mode' : ''}`}>
      <h1>Educational and Healthcare Resources</h1>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Routes>
      <button onClick={toggleDarkMode} className="dark-mode-toggle">
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" value={newResource.title} onChange={handleChange} placeholder="Title" required />
        <textarea name="content" value={newResource.content} onChange={handleChange} placeholder="Content" required />
        <input type="text" name="category" value={newResource.category} onChange={handleChange} placeholder="Category" required />
        <button type="submit">Add Resource</button>
      </form>
      <input
        type="text"
        placeholder="Search resources..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
      <h2>Resources</h2>
      {loading ? <p>Loading...</p> : (
        <ul>
          {filteredResources.map(resource => (
            <li key={resource.id}>
              <h3>{resource.title}</h3>
              <p>{resource.content}</p>
              <p><strong>Category:</strong> {resource.category}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
    </Router>
  );
}

export default App;
