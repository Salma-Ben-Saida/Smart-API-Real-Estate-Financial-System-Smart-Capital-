import React, { useState } from 'react';
import './styles.css';

export default function ProjectDelete({ onDeleteSuccess }) {
  const [projectId, setProjectId] = useState('');

  const handleChange = (e) => {
    setProjectId(e.target.value);
  };

  const handleClear = () => {
    setProjectId('');
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/Project_Delete?id=${projectId}`, {
        method: 'DELETE',
      });

      if (response.status==404){
        alert("❌ Project not found. Please check the ID.");
        return;
      }
      if (!response.ok) throw new Error("Failed to delete project");
      alert("✅ Project deleted successfully");
      setProjectId(''); // Clear input
      onDeleteSuccess?.(); // Optional refresh
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("❌ Failed to delete the project.");
    }
  };

  return (
    <div class="form-container">
      <h2>🗑️ Delete a Project</h2>
      <form onSubmit={handleDelete}>
        <label>Project's ID:</label>
        <input
          name="project_id"
          value={projectId}
          onChange={handleChange}
          type="text"
          placeholder="Enter Project ID"
          required
        />
        <div className='buttons-container'>
        <button type="submit">Delete</button>
        <button type="button" onClick={handleClear}>Clear</button>
        </div>
      </form>
    </div>
  );
}
