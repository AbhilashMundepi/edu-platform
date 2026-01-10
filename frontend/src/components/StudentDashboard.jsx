// import React from 'react';
// import PDFList from './PdfList';

// const StudentDashboard = () => {
//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h1>Student Dashboard</h1>
//         <p>Search and view educational content</p>
//       </div>

//       <div className="dashboard-content">
//         <PDFList isAcademy={false} />
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;

import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PDFList from './PdfList';

const StudentDashboard = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('📚 StudentDashboard mounted');
    console.log('👤 Current user:', user);
  }, [user]);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="loading-screen">Please log in...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Search and view educational content</p>
        <p className="user-welcome">Welcome, {user.name}! 👋</p>
      </div>
      <div className="dashboard-content">
        <PDFList isAcademy={false} />
      </div>
    </div>
  );
};

export default StudentDashboard;
