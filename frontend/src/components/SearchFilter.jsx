import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const SearchFilter = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    search: '',
    subject: '',
    class: '',
    school: ''
  });
  const [availableFilters, setAvailableFilters] = useState({
    subjects: [],
    classes: [],
    schools: []
  });

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const response = await api.get('/pdfs/filters');
      setAvailableFilters(response.data);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const handleChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      subject: '',
      class: '',
      school: ''
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  return (
    <div className="search-filter">
      <div className="filter-row">
        <div className="form-group">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="🔍 Search PDFs..."
            className="search-input"
          />
        </div>
      </div>

      <div className="filter-row">
        <div className="form-group">
          <select name="subject" value={filters.subject} onChange={handleChange}>
            <option value="">All Subjects</option>
            {availableFilters.subjects.map((subject, index) => (
              <option key={index} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <select name="class" value={filters.class} onChange={handleChange}>
            <option value="">All Classes</option>
            {availableFilters.classes.map((cls, index) => (
              <option key={index} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <select name="school" value={filters.school} onChange={handleChange}>
            <option value="">All Schools</option>
            {availableFilters.schools.map((school, index) => (
              <option key={index} value={school}>{school}</option>
            ))}
          </select>
        </div>

        <button onClick={handleReset} className="btn-secondary">
          Reset
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;