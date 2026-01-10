const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
const PDF = require('../models/Pdf');
const { auth, isAcademy } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Upload PDF (Academy only)
router.post('/upload', auth, isAcademy, upload.single('pdf'), [
  body('subjectName').notEmpty().trim(),
  body('className').notEmpty().trim(),
  body('schoolName').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Delete uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    const { subjectName, className, schoolName, description } = req.body;

    const pdf = new PDF({
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      subjectName,
      className,
      schoolName,
      description: description || '',
      uploadedBy: req.user._id
    });

    await pdf.save();

    res.status(201).json({
      message: 'PDF uploaded successfully',
      pdf: {
        id: pdf._id,
        originalName: pdf.originalName,
        subjectName: pdf.subjectName,
        className: pdf.className,
        schoolName: pdf.schoolName,
        fileSize: pdf.fileSize,
        createdAt: pdf.createdAt
      }
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get all PDFs with search and filter (Students and Academy)
router.get('/search', auth, async (req, res) => {
  try {
    const { subject, class: className, school, search, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};
    
    if (subject) {
      query.subjectName = { $regex: subject, $options: 'i' };
    }
    
    if (className) {
      query.className = { $regex: className, $options: 'i' };
    }
    
    if (school) {
      query.schoolName = { $regex: school, $options: 'i' };
    }

    // General search across all fields
    if (search) {
      query.$or = [
        { subjectName: { $regex: search, $options: 'i' } },
        { className: { $regex: search, $options: 'i' } },
        { schoolName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // If academy user, show only their uploads
    if (req.user.userType === 'academy') {
      query.uploadedBy = req.user._id;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const pdfs = await PDF.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PDF.countDocuments(query);

    res.json({
      pdfs: pdfs.map(pdf => ({
        id: pdf._id,
        originalName: pdf.originalName,
        subjectName: pdf.subjectName,
        className: pdf.className,
        schoolName: pdf.schoolName,
        description: pdf.description,
        fileSize: pdf.fileSize,
        uploadedBy: pdf.uploadedBy,
        createdAt: pdf.createdAt
      })),
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get unique filter values
router.get('/filters', auth, async (req, res) => {
  try {
    const query = req.user.userType === 'academy' ? { uploadedBy: req.user._id } : {};

    const subjects = await PDF.distinct('subjectName', query);
    const classes = await PDF.distinct('className', query);
    const schools = await PDF.distinct('schoolName', query);

    res.json({
      subjects: subjects.sort(),
      classes: classes.sort(),
      schools: schools.sort()
    });
  } catch (error) {
    console.error('Filters error:', error);
    res.status(500).json({ error: 'Failed to fetch filters' });
  }
});

// Get single PDF details
router.get('/:id', auth, async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id).populate('uploadedBy', 'name email');

    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    res.json({
      id: pdf._id,
      originalName: pdf.originalName,
      subjectName: pdf.subjectName,
      className: pdf.className,
      schoolName: pdf.schoolName,
      description: pdf.description,
      fileSize: pdf.fileSize,
      uploadedBy: pdf.uploadedBy,
      createdAt: pdf.createdAt
    });
  } catch (error) {
    console.error('Get PDF error:', error);
    res.status(500).json({ error: 'Failed to fetch PDF' });
  }
});

// View/Download PDF
// router.get('/:id/view', auth, async (req, res) => {
//   try {
//     const pdf = await PDF.findById(req.params.id);

//     if (!pdf) {
//       return res.status(404).json({ error: 'PDF not found' });
//     }

//     // Check if file exists
//     if (!fs.existsSync(pdf.filePath)) {
//       return res.status(404).json({ error: 'File not found on server' });
//     }

//     // Set headers for PDF viewing
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `inline; filename="${pdf.originalName}"`);

//     // Stream the file
//     const fileStream = fs.createReadStream(pdf.filePath);
//     fileStream.pipe(res);
//   } catch (error) {
//     console.error('View PDF error:', error);
//     res.status(500).json({ error: 'Failed to view PDF' });
//   }
// });

// View/Download PDF
router.get('/:id/view', auth, async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    // Check if file exists
    if (!fs.existsSync(pdf.filePath)) {
      console.error('File not found at path:', pdf.filePath);
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Get file stats for Content-Length
    const stat = fs.statSync(pdf.filePath);

    // Set headers for PDF viewing with CORS
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${pdf.originalName}"`);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'no-cache');

    // Stream the file
    const fileStream = fs.createReadStream(pdf.filePath);
    
    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error reading file' });
      }
    });

    fileStream.pipe(res);
  } catch (error) {
    console.error('View PDF error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to view PDF' });
    }
  }
});

// Delete PDF (Academy only - their own uploads)
router.delete('/:id', auth, isAcademy, async (req, res) => {
  try {
    const pdf = await PDF.findOne({ 
      _id: req.params.id, 
      uploadedBy: req.user._id 
    });

    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found or unauthorized' });
    }

    // Delete file from filesystem
    if (fs.existsSync(pdf.filePath)) {
      fs.unlinkSync(pdf.filePath);
    }

    // Delete from database
    await PDF.findByIdAndDelete(req.params.id);

    res.json({ message: 'PDF deleted successfully' });
  } catch (error) {
    console.error('Delete PDF error:', error);
    res.status(500).json({ error: 'Failed to delete PDF' });
  }
});

// Update PDF metadata (Academy only - their own uploads)
router.put('/:id', auth, isAcademy, [
  body('subjectName').optional().notEmpty().trim(),
  body('className').optional().notEmpty().trim(),
  body('schoolName').optional().notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pdf = await PDF.findOne({ 
      _id: req.params.id, 
      uploadedBy: req.user._id 
    });

    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found or unauthorized' });
    }

    const { subjectName, className, schoolName, description } = req.body;

    if (subjectName) pdf.subjectName = subjectName;
    if (className) pdf.className = className;
    if (schoolName) pdf.schoolName = schoolName;
    if (description !== undefined) pdf.description = description;

    await pdf.save();

    res.json({
      message: 'PDF updated successfully',
      pdf: {
        id: pdf._id,
        originalName: pdf.originalName,
        subjectName: pdf.subjectName,
        className: pdf.className,
        schoolName: pdf.schoolName,
        description: pdf.description
      }
    });
  } catch (error) {
    console.error('Update PDF error:', error);
    res.status(500).json({ error: 'Failed to update PDF' });
  }
});

module.exports = router;
