import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProjectForm from './pages/ProjectForm';
import ProjectList from './pages/ProjectList';
import ProjectDelete from './pages/ProjectDelete';
import LoanSimulator from './pages/LoanSimulator';
import Layout from './components/Layout';
import ExportProjects from './pages/ExportProjects';

function App() {
  

  return (
    <BrowserRouter>
    <Layout>
      <Routes>
        {/* Route for the project creation form */}
        <Route path="/Add_project" element={<ProjectForm/>} />

        {/* Route for the projects list */}
        <Route path="/Project_List" element={<ProjectList />} />
        {/* Route for the project deleting form */}
        <Route path="/Project_Delete" element={<ProjectDelete/>} />
        {/* Route for Loan simulator */}
        <Route path="/Loan_Simulator" element={<LoanSimulator />} />
        {/* Route for Exporting projects */}
        <Route path="/Export_Projects" element={<ExportProjects />} />
      </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
