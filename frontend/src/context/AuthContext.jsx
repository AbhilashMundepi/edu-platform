// import React, { createContext, useState, useContext, useEffect } from 'react';
// import api from '../utils/api';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const initAuth = async () => {
//       const token = localStorage.getItem('token');
//       const storedUser = localStorage.getItem('user');

//       if (token && storedUser) {
//         try {
//           setUser(JSON.parse(storedUser));
//           // Verify token is still valid
//           await api.get('/auth/me');
//         } catch (error) {
//           console.error('Token validation failed:', error);
//           logout();
//         }
//       }
//       setLoading(false);
//     };

//     initAuth();
//   }, []);

//   const login = async (email, password) => {
//     const response = await api.post('/auth/login', { email, password });
//     const { token, user } = response.data;
    
//     localStorage.setItem('token', token);
//     localStorage.setItem('user', JSON.stringify(user));
//     setUser(user);
    
//     return user;
//   };

//   // const register = async (email, password, userType, name) => {
//   //   const response = await api.post('/auth/register', { 
//   //     email, 
//   //     password, 
//   //     userType, 
//   //     name 
//   //   });
//   //   const { token, user } = response.data;
    
//   //   localStorage.setItem('token', token);
//   //   localStorage.setItem('user', JSON.stringify(user));
//   //   setUser(user);
    
//   //   return user;
//   // };
//   const register = async (email, password, userType, name) => {
//   const response = await api.post('/auth/register', { 
//     email, 
//     password, 
//     userType, 
//     name 
//   });

//   const { token, user, message } = response.data;
  
//   localStorage.setItem('token', token);
//   localStorage.setItem('user', JSON.stringify(user));
//   setUser(user);
  
//   return { token, user, message }; // return full object
// };


//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;

// import React, { createContext, useState, useContext, useEffect } from 'react';
// import api from '../utils/api';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const initAuth = async () => {
//       const token = localStorage.getItem('token');
//       const storedUser = localStorage.getItem('user');
      
//       console.log('🔄 InitAuth - Token exists:', !!token);
//       console.log('🔄 InitAuth - Stored user:', storedUser);

//       if (token && storedUser) {
//         try {
//           const parsedUser = JSON.parse(storedUser);
//           setUser(parsedUser);
          
//           // Verify token is still valid with backend
//           await api.get('/auth/me');
//           console.log('✅ Token verified successfully');
//         } catch (error) {
//           console.error('❌ Token validation failed:', error);
//           logout();
//         }
//       }
      
//       setLoading(false);
//     };

//     initAuth();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       console.log('🔐 Attempting login for:', email);
      
//       const response = await api.post('/auth/login', { email, password });
//       const { token, user } = response.data;
      
//       console.log('✅ Login successful:', user);
      
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));
//       setUser(user);
      
//       return user;
//     } catch (error) {
//       console.error('❌ Login error:', error.response?.data || error);
//       throw error;
//     }
//   };

//   const register = async (email, password, userType, name) => {
//     try {
//       console.log('📝 Attempting registration for:', email);
      
//       const response = await api.post('/auth/register', { 
//         email, 
//         password, 
//         userType, 
//         name 
//       });
//       const { token, user, message } = response.data;
      
//       console.log('✅ Registration successful:', user);
      
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));
//       setUser(user);
      
//       return { token, user, message };
//     } catch (error) {
//       console.error('❌ Registration error:', error.response?.data || error);
//       throw error;
//     }
//   };

//   const logout = () => {
//     console.log('🚪 Logging out');
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setUser(null);
//   };

//   const value = {
//     user,
//     login,
//     register,
//     logout,
//     loading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;

import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      console.log('🔄 InitAuth - Token exists:', !!token);
      console.log('🔄 InitAuth - Stored user:', storedUser);

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log('✅ Parsed user from localStorage:', parsedUser);
          setUser(parsedUser);
          
          // Verify token is still valid with backend
          const response = await api.get('/auth/me');
          console.log('✅ Token verified with backend:', response.data);
        } catch (error) {
          console.error('❌ Token validation failed:', error);
          logout();
        }
      } else {
        console.log('⚠️ No token or user in localStorage during init');
      }
      
      setLoading(false);
      console.log('✅ InitAuth complete, loading set to false');
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      console.log('✅ Login API response:', { token: token?.substring(0, 20) + '...', user });
      
      // ✅ CRITICAL: Save to localStorage FIRST
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // ✅ Verify localStorage write
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      console.log('💾 Verification after save:');
      console.log('  - Token in localStorage:', !!savedToken);
      console.log('  - User in localStorage:', !!savedUser);
      console.log('  - Saved user data:', savedUser);
      
      // ✅ Then update state
      setUser(user);
      console.log('✅ State updated with user:', user);
      
      return user;
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error);
      throw error;
    }
  };

  const register = async (email, password, userType, name) => {
    try {
      console.log('📝 Attempting registration for:', email);
      
      const response = await api.post('/auth/register', { 
        email, 
        password, 
        userType, 
        name 
      });
      const { token, user, message } = response.data;
      
      console.log('✅ Registration successful:', user);
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Verify
      console.log('💾 Token saved:', !!localStorage.getItem('token'));
      console.log('💾 User saved:', !!localStorage.getItem('user'));
      
      setUser(user);
      
      return { token, user, message };
    } catch (error) {
      console.error('❌ Registration error:', error.response?.data || error);
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  console.log('🎨 AuthProvider rendering - user:', user ? 'exists' : 'null', 'loading:', loading);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
