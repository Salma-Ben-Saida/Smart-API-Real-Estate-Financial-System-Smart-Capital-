import React, { useState } from 'react';
import './styles.css';

export default function ProjectForm() {
  const [form, setForm] = useState({
    project_name: '',
    client: '',
    amount_requested: '',
    interest_rate: '',
    duration_years: '',
    status: 'pending'
  });
  const handleClear = () => {
    setForm(
      {
        project_name:'',
        client:'',
        amount_requested:'',
        interest_rate:'',
        duration_years:'',
      }
    )
  };


  const handleChange = e => {
    const { name, value } = e.target;

    let cleanValue = value;
    if (name === 'amount_requested') {
      cleanValue = value.replace(/[^\d.]/g, ''); // remove non-numeric
    }
    if (name === 'interest_rate') {
      cleanValue = value.replace('%', ''); // remove %
    }

    setForm({ ...form, [name]: cleanValue });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formattedForm = {
      ...form,
      amount_requested: parseFloat(form.amount_requested),
      interest_rate: parseFloat(form.interest_rate),
      duration_years: parseInt(form.duration_years)
    };

    try {
      const response = await fetch("http://localhost:8000/Add_project/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedForm)
      });

      if (!response.ok) throw new Error("Failed to submit project");

      const data = await response.json();
      alert("✅ Project added successfully!");
      console.log(data);
    } catch (err) {
      console.error(err);
      alert("❌ Oops! Error submitting project.");
    }
  };

  return (
    <div className="form-container">
      <h2>📝 Create a New Project</h2>
      <form onSubmit={handleSubmit}>
        <label>Project Name :</label>
        <input
          name="project_name"
          value={form.project_name}
          onChange={handleChange}
          type="text"
          required
        />

        <label>Client Name :</label>
        <input
          name="client"
          value={form.client}
          onChange={handleChange}
          type="text"
          required
        />

        <label>Amount Requested (CAD) :</label>
        <input
          name="amount_requested"
          value={form.amount_requested}
          onChange={handleChange}
          type="text"
          placeholder="e.g. 250000"
          required
        />

        <label>Interest Rate (%) :</label>
        <input
          name="interest_rate"
          value={form.interest_rate}
          onChange={handleChange}
          type="text"
          placeholder="e.g. 5.5"
          required
        />

        <label>Loan Duration (Years) :</label>
        <input
          name="duration_years"
          value={form.duration_years}
          onChange={handleChange}
          type="number"
          step="1"
          required
        />

        <label>Status :</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <div className='buttons-container'>
        <button type="submit">Create</button>
        <button type="button" onClick={handleClear}>Clear</button>
        </div>      </form>
    </div>
  );
}
