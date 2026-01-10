// import React, { useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';

// // Set worker source
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// const PDFViewer = ({ pdfId, onClose }) => {
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [loading, setLoading] = useState(true);

//   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
//   const token = localStorage.getItem('token');
  
//   const pdfUrl = `${API_URL}/pdfs/${pdfId}/view`;

//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages);
//     setLoading(false);
//   }

//   function onDocumentLoadError(error) {
//     console.error('Error loading PDF:', error);
//     setLoading(false);
//   }

//   const goToPrevPage = () => {
//     setPageNumber((prev) => Math.max(prev - 1, 1));
//   };

//   const goToNextPage = () => {
//     setPageNumber((prev) => Math.min(prev + 1, numPages));
//   };

//   return (
//     <div className="pdf-viewer-overlay" onClick={onClose}>
//       <div className="pdf-viewer-container" onClick={(e) => e.stopPropagation()}>
//         <div className="pdf-viewer-header">
//           <h3>PDF Viewer</h3>
//           <button onClick={onClose} className="close-button">✕</button>
//         </div>

//         <div className="pdf-viewer-content">
//           {loading && <div className="loading">Loading PDF...</div>}
          
//           <Document
//             file={{
//               url: pdfUrl,
//               httpHeaders: {
//                 'Authorization': `Bearer ${token}`
//               }
//             }}
//             onLoadSuccess={onDocumentLoadSuccess}
//             onLoadError={onDocumentLoadError}
//             loading={<div className="loading">Loading PDF...</div>}
//           >
//             <Page 
//               pageNumber={pageNumber} 
//               renderTextLayer={true}
//               renderAnnotationLayer={true}
//               width={Math.min(window.innerWidth * 0.8, 800)}
//             />
//           </Document>
//         </div>

//         {numPages && (
//           <div className="pdf-viewer-controls">
//             <button 
//               onClick={goToPrevPage} 
//               disabled={pageNumber <= 1}
//               className="btn-secondary"
//             >
//               Previous
//             </button>
//             <span className="page-info">
//               Page {pageNumber} of {numPages}
//             </span>
//             <button 
//               onClick={goToNextPage} 
//               disabled={pageNumber >= numPages}
//               className="btn-secondary"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PDFViewer;
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ pdfId, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching PDF with ID:', pdfId);
        
        const response = await fetch(`${API_URL}/pdfs/${pdfId}/view`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to load PDF: ${response.status} ${response.statusText}`);
        }

        // Get the blob
        const blob = await response.blob();
        console.log('Blob received:', blob.size, 'bytes, type:', blob.type);

        // Create a URL for the blob
        const blobUrl = URL.createObjectURL(blob);
        setPdfBlob(blobUrl);

      } catch (err) {
        console.error('Error fetching PDF:', err);
        setError(err.message || 'Failed to load PDF file.');
        setLoading(false);
      }
    };

    if (pdfId && token) {
      fetchPDF();
    } else {
      setError('Missing PDF ID or authentication token');
      setLoading(false);
    }

    // Cleanup function
    return () => {
      if (pdfBlob) {
        URL.revokeObjectURL(pdfBlob);
      }
    };
  }, [pdfId, token, API_URL]);

  function onDocumentLoadSuccess({ numPages }) {
    console.log('PDF loaded successfully, pages:', numPages);
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error) {
    console.error('Error loading PDF document:', error);
    setError('Failed to load PDF document. The file may be corrupted.');
    setLoading(false);
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  return (
    <div className="pdf-viewer-overlay" onClick={onClose}>
      <div className="pdf-viewer-container" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-viewer-header">
          <h3>PDF Viewer</h3>
          <button onClick={onClose} className="close-button">✕</button>
        </div>
        
        <div className="pdf-viewer-content">
          {loading && !error && (
            <div className="loading">Loading PDF...</div>
          )}
          
          {error && (
            <div className="error">
              <p>{error}</p>
              <button onClick={onClose} className="btn-secondary">Close</button>
            </div>
          )}
          
          {pdfBlob && !error && (
            <Document
              file={pdfBlob}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div className="loading">Rendering PDF...</div>}
              error={<div className="error">Failed to load PDF. Please try again.</div>}
            >
              <Page 
                pageNumber={pageNumber}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                width={Math.min(window.innerWidth * 0.8, 800)}
              />
            </Document>
          )}
        </div>
        
        {numPages && !error && (
          <div className="pdf-viewer-controls">
            <button 
              onClick={goToPrevPage} 
              disabled={pageNumber <= 1}
              className="btn-secondary"
            >
              Previous
            </button>
            <span className="page-info">
              Page {pageNumber} of {numPages}
            </span>
            <button 
              onClick={goToNextPage} 
              disabled={pageNumber >= numPages}
              className="btn-secondary"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
