// ProjectList.jsx
import React, { useEffect, useState } from 'react';
import './styles.css';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/Project_List')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  return (
    <div className="form-container">
      <h2>📋 List of Projects</h2>
      {projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        <table className="project-table">
          <thead>
            <tr>
              <th>Index</th>
              <th>ID</th>
              <th>Project Name</th>
              <th>Client</th>
              <th>Amount Requested</th>
              <th>Interest Rate (%)</th>
              <th>Duration (years)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p,index) => (
              <tr key={p.id}>
                <td>{index+1}</td>
                <td>{p.id}</td>
                <td>{p.project_name}</td>
                <td>{p.client}</td>
                <td>{p.amount_requested.toLocaleString()} $</td>
                <td>{p.interest_rate}%</td>
                <td>{p.duration_years}</td>
                <td>{p.status.replace('_', ' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
