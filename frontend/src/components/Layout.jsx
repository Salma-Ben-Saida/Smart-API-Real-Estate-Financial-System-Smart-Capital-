// components/Layout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './style.css';
import FTopbar from './fTopbar';

export default function Layout({ children }) {
  return (
    <div className="app-layout">
      <FTopbar/>
      <Topbar />
      <div className="main-content">
        <Sidebar />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}
