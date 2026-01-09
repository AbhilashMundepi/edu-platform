import React, { useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const UploadPDF = ({ onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    subjectName: '',
    className: '',
    schoolName: '',
    description: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size should not exceed 10MB');
        return;
      }
      setFile(selectedFile);
    } else {
      toast.error('Please select a valid PDF file');
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('pdf', file);
    uploadData.append('subjectName', formData.subjectName);
    uploadData.append('className', formData.className);
    uploadData.append('schoolName', formData.schoolName);
    uploadData.append('description', formData.description);

    setLoading(true);
    try {
      await api.post('/pdfs/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('PDF uploaded successfully!');
      setFormData({
        subjectName: '',
        className: '',
        schoolName: '',
        description: ''
      });
      setFile(null);
      document.getElementById('pdfFile').value = null;
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-card">
      <h3>Upload New PDF</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Subject Name *</label>
          <input
            type="text"
            name="subjectName"
            value={formData.subjectName}
            onChange={handleChange}
            required
            placeholder="e.g., Mathematics"
          />
        </div>

        <div className="form-group">
          <label>Class Name *</label>
          <input
            type="text"
            name="className"
            value={formData.className}
            onChange={handleChange}
            required
            placeholder="e.g., Grade 10"
          />
        </div>

        <div className="form-group">
          <label>School Name *</label>
          <input
            type="text"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleChange}
            required
            placeholder="e.g., Springfield High School"
          />
        </div>

        <div className="form-group">
          <label>Description (Optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add any additional details..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>PDF File * (Max 10MB)</label>
          <input
            type="file"
            id="pdfFile"
            accept=".pdf"
            onChange={handleFileChange}
            required
          />
          {file && (
            <p className="file-info">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </form>
    </div>
  );
};

export default UploadPDF;