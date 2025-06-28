import React, { useState } from 'react';
import './styles.css';

export default function LoanSimulator() {
  const [projectId, setProjectId] = useState('');
  const [result, setResult] = useState(null);

  const handleSimulate = async (e) => {
  e.preventDefault();

  const trimmedId = projectId.trim();
  if (!trimmedId) {
    alert("Please enter a valid Project ID");
    return;
  }

  try {
    
    const response = await fetch(`http://localhost:8000/Loan_Simulator/${trimmedId}`, { method: 'GET' });

    if (!response.ok) throw new Error("Project not found");

    const data = await response.json();
    setResult(data);
  } catch (err) {
    alert("❌ Could not simulate loan. Please check the Project ID.");
    setResult(null);
  }
};
const handleClear = () => {
    setProjectId('');
  };

  return (
    <div className="form-container">
      <h2>📊 Loan Simulator</h2>
      <form onSubmit={handleSimulate}>
        <label>Project ID:</label>
        <input
          type="text"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          placeholder="Enter Project ID"
          required
        />
        <div className='buttons-container'>
        <button type="submit">Simulate</button>
        <button type="button" onClick={handleClear}>Clear</button>
        </div>      </form>

      {result && (
        <div className='result-container'>
          <hr/>
          <h2>Simulation Result :</h2>
          <table className='project-table'>
            <tr>
              <td><strong>Monthly Payment:</strong></td>
              <td>${result.monthly_payment}</td>
            </tr>
            <tr>
              <td><strong>Total Cost:</strong></td>
              <td>${result.total_cost}</td>
            </tr>
          </table>
        </div>
      )}
    </div>
  );
}
