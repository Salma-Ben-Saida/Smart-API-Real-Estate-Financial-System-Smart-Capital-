import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li><Link to="/Add_Project">➕ Create a Project</Link></li>
          <li><Link to="/Project_List">📋 View Projects</Link></li>
          <li><Link to="/Project_Delete">🗑️ Delete a project</Link></li>
          <li><Link to="/Loan_Simulator">💰 Loan Simulator</Link></li>
          <li><Link to="/Export_Projects">📤  Export Projects</Link></li>
        </ul>
      </nav>
    </div>
  );
}
