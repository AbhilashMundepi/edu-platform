// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Navbar from './components/Navbar';
// import Login from './components/Login';
// import Register from './components/Register';
// import AcademyDashboard from './components/AcademyDashboard';
// import StudentDashboard from './components/StudentDashboard';
// import './App.css';

// // Protected Route Component
// const ProtectedRoute = ({ children, requiredUserType }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <div className="loading-screen">Loading...</div>;
//   }

//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   if (requiredUserType && user.userType !== requiredUserType) {
//     return <Navigate to={user.userType === 'academy' ? '/academy' : '/student'} />;
//   }

//   return children;
// };

// // Home Page Component
// // const Home = () => {
// //   const { user } = useAuth();

// //   if (user) {
// //     return <Navigate to={user.userType === 'academy' ? '/academy' : '/student'} />;
// //   }

// //   return (
// //     <div className="home-container">
// //       <div className="home-content">
// //         <h1>Welcome to EduPlatform</h1>
// //         <p className="subtitle">Your Educational Content Management System</p>
        
// //         <div className="features">
// //           <div className="feature-card">
// //             <div className="feature-icon">🏫</div>
// //             <h3>For Academies</h3>
// //             <p>Upload and manage educational PDFs with detailed metadata</p>
// //           </div>
          
// //           <div className="feature-card">
// //             <div className="feature-icon">👨‍🎓</div>
// //             <h3>For Students</h3>
// //             <p>Search and view educational content with advanced filters</p>
// //           </div>
// //         </div>

// //         <div className="cta-buttons">
// //           <a href="/register" className="btn-primary">Get Started</a>
// //           <a href="/login" className="btn-secondary">Login</a>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// const Home = () => {
//   const { user, loading } = useAuth();

//   // ⏳ Wait for auth to initialize
//   if (loading) {
//     return <div className="loading-screen">Loading...</div>;
//   }

//   if (user) {
//     return <Navigate to={user.userType === 'academy' ? '/academy' : '/student'} />;
//   }

//   return (
//     <div className="home-container">
//       <div className="home-content">
//         <h1>Welcome to EduPlatform</h1>
//         <p className="subtitle">Your Educational Content Management System</p>

//         <div className="features">
//           <div className="feature-card">
//             <div className="feature-icon">🏫</div>
//             <h3>For Academies</h3>
//             <p>Upload and manage educational PDFs with detailed metadata</p>
//           </div>

//           <div className="feature-card">
//             <div className="feature-icon">👨‍🎓</div>
//             <h3>For Students</h3>
//             <p>Search and view educational content with advanced filters</p>
//           </div>
//         </div>

//         <div className="cta-buttons">
//           <a href="/register" className="btn-primary">Get Started</a>
//           <a href="/login" className="btn-secondary">Login</a>
//         </div>
//       </div>
//     </div>
//   );
// };


// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="app">
//           <Navbar />
//           <main className="main-content">
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/register" element={<Register />} />
              
//               <Route 
//                 path="/academy" 
//                 element={
//                   <ProtectedRoute requiredUserType="academy">
//                     <AcademyDashboard />
//                   </ProtectedRoute>
//                 } 
//               />
              
//               <Route 
//                 path="/student" 
//                 element={
//                   <ProtectedRoute requiredUserType="student">
//                     <StudentDashboard />
//                   </ProtectedRoute>
//                 } 
//               />
              
//               <Route path="*" element={<Navigate to="/" />} />
//             </Routes>
//           </main>
//           <ToastContainer position="top-right" autoClose={3000} />
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import AcademyDashboard from './components/AcademyDashboard';
import StudentDashboard from './components/StudentDashboard';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, requiredUserType }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredUserType && user.userType !== requiredUserType) {
    return <Navigate to={user.userType === 'academy' ? '/academy' : '/student'} replace />;
  }

  return children;
};

// Home Page Component
const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  // ✅ Redirect if logged in
  if (user) {
    return <Navigate to={user.userType === 'academy' ? '/academy' : '/student'} replace />;
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to EduPlatform</h1>
        <p className="subtitle">Your Educational Content Management System</p>

        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">🏫</div>
            <h3>For Academies</h3>
            <p>Upload and manage educational PDFs with detailed metadata</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👨‍🎓</div>
            <h3>For Students</h3>
            <p>Search and view educational content with advanced filters</p>
          </div>
        </div>

        <div className="cta-buttons">
          <a href="/register" className="btn-primary">Get Started</a>
          <a href="/login" className="btn-secondary">Login</a>
        </div>
      </div>
    </div>
  );
};

// ✅ NEW: Wrapper for Login to prevent logged-in users from accessing
const LoginPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (user) {
    return <Navigate to={user.userType === 'academy' ? '/academy' : '/student'} replace />;
  }

  return <Login />;
};

// ✅ NEW: Wrapper for Register
const RegisterPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (user) {
    return <Navigate to={user.userType === 'academy' ? '/academy' : '/student'} replace />;
  }

  return <Register />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route 
                path="/academy" 
                element={
                  <ProtectedRoute requiredUserType="academy">
                    <AcademyDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/student" 
                element={
                         {console.log('🛣️ /student route matched!')}
                  <ProtectedRoute requiredUserType="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
