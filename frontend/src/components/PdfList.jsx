import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import PDFViewer from './PdfViewer';
import SearchFilter from './SearchFilter';

const PDFList = ({ isAcademy, refreshTrigger }) => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [filters, setFilters] = useState({});

  const fetchPDFs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page, limit: 10 };
      const response = await api.get('/pdfs/search', { params });
      setPdfs(response.data.pdfs);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch PDFs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPDFs();
  }, [fetchPDFs, refreshTrigger]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this PDF?')) {
      return;
    }

    try {
      await api.delete(`/pdfs/${id}`);
      toast.success('PDF deleted successfully');
      fetchPDFs(pagination.page);
    } catch (error) {
      toast.error('Failed to delete PDF');
    }
  };

  const handleView = (pdfId) => {
    setSelectedPdf(pdfId);
  };

  const formatFileSize = (bytes) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="pdf-list-container">
      <SearchFilter onSearch={handleSearch} />

      {loading ? (
        <div className="loading">Loading PDFs...</div>
      ) : pdfs.length === 0 ? (
        <div className="empty-state">
          <p>No PDFs found</p>
          {isAcademy && <p>Upload your first PDF to get started!</p>}
        </div>
      ) : (
        <>
          <div className="pdf-grid">
            {pdfs.map((pdf) => (
              <div key={pdf.id} className="pdf-card">
                <div className="pdf-icon">📄</div>
                <h4 className="pdf-title">{pdf.originalName}</h4>
                
                <div className="pdf-details">
                  <p><strong>Subject:</strong> {pdf.subjectName}</p>
                  <p><strong>Class:</strong> {pdf.className}</p>
                  <p><strong>School:</strong> {pdf.schoolName}</p>
                  {pdf.description && (
                    <p><strong>Description:</strong> {pdf.description}</p>
                  )}
                  <p><strong>Size:</strong> {formatFileSize(pdf.fileSize)}</p>
                  <p><strong>Uploaded:</strong> {formatDate(pdf.createdAt)}</p>
                  {pdf.uploadedBy && (
                    <p><strong>By:</strong> {pdf.uploadedBy.name}</p>
                  )}
                </div>

                <div className="pdf-actions">
                  <button 
                    onClick={() => handleView(pdf.id)} 
                    className="btn-primary"
                  >
                    View PDF
                  </button>
                  {isAcademy && (
                    <button 
                      onClick={() => handleDelete(pdf.id)} 
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => fetchPDFs(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn-secondary"
              >
                Previous
              </button>
              <span className="page-info">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => fetchPDFs(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selectedPdf && (
        <PDFViewer 
          pdfId={selectedPdf} 
          onClose={() => setSelectedPdf(null)} 
        />
      )}
    </div>
  );
};

export default PDFList;
// import React, { useState, useEffect, useCallback } from 'react';

// // Mock API for demonstration
// const mockApi = {
//   get: async (url, config) => {
//     console.log('🔍 API Call:', url, config);
    
//     // Simulate delay
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     // Mock response
//     return {
//       data: {
//         pdfs: [
//           {
//             id: '1',
//             originalName: 'Mathematics Chapter 1.pdf',
//             subjectName: 'Mathematics',
//             className: 'Class 10',
//             schoolName: 'ABC School',
//             description: 'Introduction to Algebra',
//             fileSize: 2500000,
//             uploadedBy: { name: 'John Academy', email: 'john@academy.com' },
//             createdAt: new Date().toISOString()
//           },
//           {
//             id: '2',
//             originalName: 'Physics Notes.pdf',
//             subjectName: 'Physics',
//             className: 'Class 12',
//             schoolName: 'XYZ School',
//             description: 'Mechanics and Motion',
//             fileSize: 3200000,
//             uploadedBy: { name: 'Jane Academy', email: 'jane@academy.com' },
//             createdAt: new Date().toISOString()
//           }
//         ],
//         pagination: {
//           total: 2,
//           page: 1,
//           pages: 1
//         }
//       }
//     };
//   },
//   delete: async (url) => {
//     console.log('🗑️ Delete API Call:', url);
//     return { data: { message: 'Deleted successfully' } };
//   }
// };

// const SearchFilter = ({ onSearch }) => {
//   const [filters, setFilters] = useState({
//     subject: '',
//     class: '',
//     school: '',
//     search: ''
//   });

//   const handleChange = (e) => {
//     const newFilters = { ...filters, [e.target.name]: e.target.value };
//     setFilters(newFilters);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('🔎 Applying filters:', filters);
//     onSearch(filters);
//   };

//   const handleReset = () => {
//     const emptyFilters = { subject: '', class: '', school: '', search: '' };
//     setFilters(emptyFilters);
//     onSearch(emptyFilters);
//   };

//   return (
//     <div style={{
//       background: 'white',
//       padding: '20px',
//       borderRadius: '8px',
//       boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//       marginBottom: '20px'
//     }}>
//       <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Search & Filter</h3>
//       <form onSubmit={handleSubmit}>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
//           <input
//             type="text"
//             name="search"
//             value={filters.search}
//             onChange={handleChange}
//             placeholder="Search all fields..."
//             style={{
//               padding: '10px',
//               border: '1px solid #ddd',
//               borderRadius: '4px',
//               fontSize: '14px'
//             }}
//           />
//           <input
//             type="text"
//             name="subject"
//             value={filters.subject}
//             onChange={handleChange}
//             placeholder="Subject"
//             style={{
//               padding: '10px',
//               border: '1px solid #ddd',
//               borderRadius: '4px',
//               fontSize: '14px'
//             }}
//           />
//           <input
//             type="text"
//             name="class"
//             value={filters.class}
//             onChange={handleChange}
//             placeholder="Class"
//             style={{
//               padding: '10px',
//               border: '1px solid #ddd',
//               borderRadius: '4px',
//               fontSize: '14px'
//             }}
//           />
//           <input
//             type="text"
//             name="school"
//             value={filters.school}
//             onChange={handleChange}
//             placeholder="School"
//             style={{
//               padding: '10px',
//               border: '1px solid #ddd',
//               borderRadius: '4px',
//               fontSize: '14px'
//             }}
//           />
//         </div>
//         <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
//           <button
//             type="submit"
//             style={{
//               padding: '10px 20px',
//               background: '#007bff',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               fontSize: '14px'
//             }}
//           >
//             Apply Filters
//           </button>
//           <button
//             type="button"
//             onClick={handleReset}
//             style={{
//               padding: '10px 20px',
//               background: '#6c757d',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               fontSize: '14px'
//             }}
//           >
//             Reset
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// const PDFViewer = ({ pdfId, onClose }) => {
//   return (
//     <div style={{
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       background: 'rgba(0,0,0,0.8)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       zIndex: 1000
//     }}>
//       <div style={{
//         background: 'white',
//         padding: '20px',
//         borderRadius: '8px',
//         maxWidth: '90%',
//         maxHeight: '90%',
//         width: '800px'
//       }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
//           <h3>PDF Viewer - ID: {pdfId}</h3>
//           <button
//             onClick={onClose}
//             style={{
//               background: '#dc3545',
//               color: 'white',
//               border: 'none',
//               padding: '8px 16px',
//               borderRadius: '4px',
//               cursor: 'pointer'
//             }}
//           >
//             Close
//           </button>
//         </div>
//         <div style={{ height: '600px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//           <p>PDF Viewer would load here</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const PDFList = ({ isAcademy = false, refreshTrigger = 0 }) => {
//   const [pdfs, setPdfs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedPdf, setSelectedPdf] = useState(null);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     pages: 1,
//     total: 0
//   });
//   const [filters, setFilters] = useState({});

//   const fetchPDFs = useCallback(async (page = 1) => {
//     console.log('📥 fetchPDFs called - Page:', page, 'Filters:', filters);
//     setLoading(true);
//     setError(null);
    
//     try {
//       const params = { ...filters, page, limit: 10 };
//       console.log('📤 Making API request with params:', params);
      
//       // Check for token
//       const token = localStorage.getItem('token');
//       console.log('🔑 Token exists:', !!token);
//       if (token) {
//         console.log('🔑 Token preview:', token.substring(0, 20) + '...');
//       }
      
//       const response = await mockApi.get('/pdfs/search', { params });
//       console.log('✅ API Response:', response.data);
      
//       setPdfs(response.data.pdfs);
//       setPagination(response.data.pagination);
//       console.log('✅ State updated - PDFs count:', response.data.pdfs.length);
//     } catch (error) {
//       console.error('❌ Error fetching PDFs:', error);
//       setError(error.message || 'Failed to fetch PDFs');
//     } finally {
//       setLoading(false);
//       console.log('✅ Loading complete');
//     }
//   }, [filters]);

//   useEffect(() => {
//     console.log('🔄 useEffect triggered - refreshTrigger:', refreshTrigger);
//     fetchPDFs();
//   }, [fetchPDFs, refreshTrigger]);

//   const handleSearch = (newFilters) => {
//     console.log('🔍 Search triggered with filters:', newFilters);
//     setFilters(newFilters);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this PDF?')) {
//       return;
//     }

//     try {
//       console.log('🗑️ Deleting PDF:', id);
//       await mockApi.delete(`/pdfs/${id}`);
//       console.log('✅ Delete successful');
//       fetchPDFs(pagination.page);
//     } catch (error) {
//       console.error('❌ Delete error:', error);
//       alert('Failed to delete PDF');
//     }
//   };

//   const handleView = (pdfId) => {
//     console.log('👁️ Viewing PDF:', pdfId);
//     setSelectedPdf(pdfId);
//   };

//   const formatFileSize = (bytes) => {
//     return (bytes / 1024 / 1024).toFixed(2) + ' MB';
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   console.log('🎨 Rendering PDFList - Loading:', loading, 'PDFs:', pdfs.length, 'Error:', error);

//   return (
//     <div style={{ padding: '20px' }}>
//       <SearchFilter onSearch={handleSearch} />

//       {loading ? (
//         <div style={{
//           textAlign: 'center',
//           padding: '40px',
//           background: 'white',
//           borderRadius: '8px',
//           boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//         }}>
//           <div style={{ fontSize: '18px', color: '#666' }}>Loading PDFs...</div>
//         </div>
//       ) : error ? (
//         <div style={{
//           textAlign: 'center',
//           padding: '40px',
//           background: '#fff3cd',
//           borderRadius: '8px',
//           color: '#856404'
//         }}>
//           <div style={{ fontSize: '18px', marginBottom: '10px' }}>⚠️ Error</div>
//           <div>{error}</div>
//         </div>
//       ) : pdfs.length === 0 ? (
//         <div style={{
//           textAlign: 'center',
//           padding: '40px',
//           background: 'white',
//           borderRadius: '8px',
//           boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//         }}>
//           <div style={{ fontSize: '48px', marginBottom: '20px' }}>📄</div>
//           <div style={{ fontSize: '18px', marginBottom: '10px' }}>No PDFs found</div>
//           {isAcademy && <div style={{ color: '#666' }}>Upload your first PDF to get started!</div>}
//         </div>
//       ) : (
//         <>
//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
//             gap: '20px',
//             marginBottom: '20px'
//           }}>
//             {pdfs.map((pdf) => (
//               <div
//                 key={pdf.id}
//                 style={{
//                   background: 'white',
//                   padding: '20px',
//                   borderRadius: '8px',
//                   boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                   transition: 'transform 0.2s',
//                   cursor: 'pointer'
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
//                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
//               >
//                 <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '15px' }}>📄</div>
//                 <h4 style={{
//                   margin: '0 0 15px 0',
//                   fontSize: '16px',
//                   color: '#333',
//                   overflow: 'hidden',
//                   textOverflow: 'ellipsis',
//                   whiteSpace: 'nowrap'
//                 }}>{pdf.originalName}</h4>
                
//                 <div style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
//                   <div style={{ marginBottom: '8px' }}>
//                     <strong>Subject:</strong> {pdf.subjectName}
//                   </div>
//                   <div style={{ marginBottom: '8px' }}>
//                     <strong>Class:</strong> {pdf.className}
//                   </div>
//                   <div style={{ marginBottom: '8px' }}>
//                     <strong>School:</strong> {pdf.schoolName}
//                   </div>
//                   {pdf.description && (
//                     <div style={{ marginBottom: '8px' }}>
//                       <strong>Description:</strong> {pdf.description}
//                     </div>
//                   )}
//                   <div style={{ marginBottom: '8px' }}>
//                     <strong>Size:</strong> {formatFileSize(pdf.fileSize)}
//                   </div>
//                   <div style={{ marginBottom: '8px' }}>
//                     <strong>Uploaded:</strong> {formatDate(pdf.createdAt)}
//                   </div>
//                   {pdf.uploadedBy && (
//                     <div>
//                       <strong>By:</strong> {pdf.uploadedBy.name}
//                     </div>
//                   )}
//                 </div>

//                 <div style={{ display: 'flex', gap: '10px' }}>
//                   <button
//                     onClick={() => handleView(pdf.id)}
//                     style={{
//                       flex: 1,
//                       padding: '10px',
//                       background: '#007bff',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '4px',
//                       cursor: 'pointer',
//                       fontSize: '14px'
//                     }}
//                   >
//                     View PDF
//                   </button>
//                   {isAcademy && (
//                     <button
//                       onClick={() => handleDelete(pdf.id)}
//                       style={{
//                         flex: 1,
//                         padding: '10px',
//                         background: '#dc3545',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer',
//                         fontSize: '14px'
//                       }}
//                     >
//                       Delete
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {pagination.pages > 1 && (
//             <div style={{
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               gap: '15px',
//               padding: '20px',
//               background: 'white',
//               borderRadius: '8px',
//               boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//             }}>
//               <button
//                 onClick={() => fetchPDFs(pagination.page - 1)}
//                 disabled={pagination.page === 1}
//                 style={{
//                   padding: '10px 20px',
//                   background: pagination.page === 1 ? '#ccc' : '#6c757d',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
//                   fontSize: '14px'
//                 }}
//               >
//                 Previous
//               </button>
//               <span style={{ fontSize: '14px', color: '#666' }}>
//                 Page {pagination.page} of {pagination.pages}
//               </span>
//               <button
//                 onClick={() => fetchPDFs(pagination.page + 1)}
//                 disabled={pagination.page === pagination.pages}
//                 style={{
//                   padding: '10px 20px',
//                   background: pagination.page === pagination.pages ? '#ccc' : '#6c757d',
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: pagination.page === pagination.pages ? 'not-allowed' : 'pointer',
//                   fontSize: '14px'
//                 }}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}

//       {selectedPdf && (
//         <PDFViewer 
//           pdfId={selectedPdf} 
//           onClose={() => setSelectedPdf(null)} 
//         />
//       )}
//     </div>
//   );
// };

// export default PDFList;
