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

// import React, { useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import PDFList from './PdfList';

// const StudentDashboard = () => {
//   const { user, loading } = useAuth();

//   useEffect(() => {
//     console.log('📚 StudentDashboard mounted');
//     console.log('👤 Current user:', user);
//   }, [user]);

//   if (loading) {
//     return <div className="loading-screen">Loading...</div>;
//   }

//   if (!user) {
//     return <div className="loading-screen">Please log in...</div>;
//   }

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h1>Student Dashboard</h1>
//         <p>Search and view educational content</p>
//         <p className="user-welcome">Welcome, {user.name}! 👋</p>
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

const StudentDashboard = () => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    console.log('📚 StudentDashboard mounted!');
    console.log('👤 User:', user);
    console.log('⏳ Loading:', loading);
  }, [user, loading]);

  console.log('🎨 StudentDashboard RENDERING NOW');

  if (loading) {
    console.log('⏳ Showing loading screen');
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    console.log('❌ No user found');
    return <div className="loading-screen">Please log in...</div>;
  }

  console.log('✅ Rendering dashboard content');

  return (
    <div className="dashboard-container" style={{ padding: '20px' }}>
      <div className="dashboard-header" style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h1>Student Dashboard</h1>
        <p>Search and view educational content</p>
        <p className="user-welcome">Welcome, {user.name || user.email}! 👋</p>
        
        {/* Debug info */}
        <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '4px', fontSize: '14px' }}>
          <strong>Debug Info:</strong>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      </div>
      
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2>This is where PDFList should appear</h2>
        <p>If you see this, StudentDashboard is rendering correctly!</p>
      </div>
    </div>
  );
};

export default StudentDashboard;
