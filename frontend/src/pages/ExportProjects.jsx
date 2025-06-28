import { useState } from 'react';
import "./styles.css"

function ExportProjects() {
  const [format, setFormat] = useState('excel'); // or 'google'
  const [details, setDetails] = useState('basic'); // or 'withLoan'

  const handleExport = async () => {
    let url = `http://localhost:8000/Export_Projects/projects?format=${format}&details=${details}`;
    
    const res = await fetch(url);
    if (format === 'excel') {
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = "projects.xlsx";
      link.click();
    } else {
      try {
  const data = await res.json();
  console.log("Received Google Sheet URL:", data.url);
  console.log("Export response:", data);
  window.open(data.url, "_blank");
} catch (error) {
  console.error("Failed to parse response", error);
}

    }
  };

  return (
    <div className="form-container">
      <h3>📤 Export Projects</h3>

      <div className="form-container">
        <h3>Choose Export Format:</h3>
        <label>
          <input type="radio" value="excel" checked={format === 'excel'} onChange={() => setFormat('excel')} />
          Excel (.xlsx)
        </label>
        <br />
        <label>
          <input type="radio" value="google" checked={format === 'google'} onChange={() => setFormat('google')} />
          Google Sheets
        </label>
      </div>

      <div className="form-container">
        <h3>Export Details:</h3>
        <label>
          <input type="radio" value="basic" checked={details === 'basic'} onChange={() => setDetails('basic')} />
          Only main project information
        </label>
        <br />
        <label>
          <input type="radio" value="withLoan" checked={details === 'withLoan'} onChange={() => setDetails('withLoan')} />
          Project + loan simulation info
        </label>
      </div>

      <button type="submit" onClick={handleExport}>
        Export
      </button>
    </div>
  );
}

export default ExportProjects;
