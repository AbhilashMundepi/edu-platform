import React, { useState } from 'react';
import UploadPDF from './UploadPdf';
import PDFList from './PdfList';

const AcademyDashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger refresh of PDF list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Academy Dashboard</h1>
        <p>Upload and manage your educational content</p>
      </div>

      <div className="dashboard-content">
        <UploadPDF onUploadSuccess={handleUploadSuccess} />
        
        <div className="section-divider">
          <h2>Your Uploaded PDFs</h2>
        </div>
        
        <PDFList isAcademy={true} refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default AcademyDashboard;