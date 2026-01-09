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