import React from 'react';
import PDFList from './PdfList';

const StudentDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Search and view educational content</p>
      </div>

      <div className="dashboard-content">
        <PDFList isAcademy={false} />
      </div>
    </div>
  );
};

export default StudentDashboard;