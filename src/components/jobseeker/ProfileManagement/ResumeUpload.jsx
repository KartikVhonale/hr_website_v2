import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaTrash, FaEye, FaFilePdf, FaSpinner, FaCheck, FaDownload, FaEdit } from 'react-icons/fa';
import { uploadResume, deleteResume } from '../../../services/jobseekerService';
import { generatePdfDownloadUrl, debugPdfUrl, ensurePdfFormat } from '../../../utils/pdfUtils';

const ResumeUpload = ({
  resumeData,
  onResumeUpdate,
  isEditing,
  loading: parentLoading
}) => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [processedResumeData, setProcessedResumeData] = useState(null);
  const fileInputRef = useRef(null);

  // Process resume data when it changes to ensure proper URL format
  useEffect(() => {
    if (resumeData) {
      console.log('Processing resume data:', resumeData);
      const processed = {
        ...resumeData,
        url: ensurePdfFormat(resumeData.url)
      };

      if (processed.url !== resumeData.url) {
        console.log('Resume URL converted:', {
          original: resumeData.url,
          converted: processed.url
        });
      }

      setProcessedResumeData(processed);
    } else {
      setProcessedResumeData(null);
    }
  }, [resumeData]);



  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    console.log('=== RESUME UPLOAD DEBUG ===');
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });

    // Validate file type - PDF ONLY
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are accepted. Please convert your document to PDF format and try again.');
      return;
    }

    // Validate file size (5MB for PDF)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }

    setUploading(true);
    try {
      console.log('Starting upload process...');
      console.log('API endpoint will be: http://localhost:3000/api/jobseeker/upload-resume');

      const response = await uploadResume(file);
      console.log('Upload response received:', response);

      if (response.data.success) {
        console.log('=== RESUME UPLOAD SUCCESS ===');
        console.log('Upload response:', response.data.data);
        console.log('Resume data:', response.data.data.resume);

        // Log PDF information from direct Cloudinary upload
        if (response.data.data.resume?.url) {
          const url = response.data.data.resume.url;
          console.log('Direct PDF URL from Cloudinary:', url);
          console.log('PDF format:', response.data.data.resume.cloudinary_info?.format);
          console.log('Resource type:', response.data.data.resume.cloudinary_info?.resource_type);
          console.log('File size:', response.data.data.resume.cloudinary_info?.bytes);
          console.log('Pages:', response.data.data.resume.cloudinary_info?.pages);
        }

        // Update resume data
        onResumeUpdate(response.data.data.resume);

        // If complete profile data is returned, we could update the entire profile
        if (response.data.data.profile) {
          console.log('Complete profile data received:', response.data.data.profile);
          // The ProfileManagement component will handle the full refresh
        }

        alert('✅ Resume uploaded successfully in PDF format!');
      } else {
        throw new Error(response.data.msg || 'Upload failed');
      }
    } catch (error) {
      console.error('=== RESUME UPLOAD ERROR ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error message:', error.message);

      let errorMessage = 'Failed to upload resume';

      if (error.response?.status === 404) {
        errorMessage = 'Upload endpoint not found. Please check if the backend server is running on port 3000.';
      } else if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your resume?')) {
      return;
    }

    setDeleting(true);
    try {
      console.log('Deleting resume');
      const response = await deleteResume();
      
      if (response.data.success) {
        console.log('Resume deleted successfully');

        // Update resume data to null
        onResumeUpdate(null);

        // If complete profile data is returned, log it
        if (response.data.data?.profile) {
          console.log('Complete profile data received after delete:', response.data.data.profile);
        }

        alert('Resume deleted successfully!');
      } else {
        throw new Error(response.data.msg || 'Delete failed');
      }
    } catch (error) {
      console.error('Resume delete failed:', error);
      const errorMessage = error.response?.data?.msg || error.message || 'Failed to delete resume';
      alert(`Delete failed: ${errorMessage}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleView = () => {
    if (processedResumeData?.url) {
      console.log('=== NAVIGATING TO RESUME VIEWER ===');
      console.log('PDF URL:', processedResumeData.url);
      console.log('Original filename:', processedResumeData.original_name);

      // Navigate to the dedicated ViewResume page
      navigate('/view-resume');
    }
  };

  const handleDownload = () => {
    if (processedResumeData?.url) {
      console.log('=== DOWNLOADING PDF ===');
      debugPdfUrl(processedResumeData.url, 'download');

      const filename = processedResumeData.original_name || 'resume.pdf';
      const downloadUrl = generatePdfDownloadUrl(processedResumeData.url, filename);

      if (!downloadUrl) {
        console.error('Failed to create download URL');
        alert('Unable to download PDF. Please try again.');
        return;
      }

      console.log('Download URL created:', downloadUrl);

      // Create a temporary anchor to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  const getFileIcon = () => {
    // Always return PDF icon since we only accept PDF files
    return <FaFilePdf />;
  };



  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="resume-upload-section">
      <h4>Resume</h4>
      {processedResumeData ? (
        <div className="resume-display">
          <div className="resume-info">
            <div className="resume-icon">
              {getFileIcon()}
            </div>
            <div className="resume-details">
              <div className="resume-name">{processedResumeData.original_name}</div>
              <div className="resume-meta">
                Uploaded: {formatDate(processedResumeData.uploaded_at)}
              </div>
            </div>
          </div>
          
          <div className="resume-actions">
            <button
              type="button"
              className="action-btn view"
              onClick={handleView}
              title="View Resume"
            >
              <FaEye />
              <span>View</span>
            </button>

            <button
              type="button"
              className="action-btn download"
              onClick={handleDownload}
              title="Download Resume"
            >
              <FaDownload />
              <span>Download</span>
            </button>

            {isEditing && (
              <>
                <button
                  type="button"
                  className="action-btn upload"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || parentLoading}
                  title="Replace Resume"
                >
                  {uploading ? <FaSpinner className="spinning" /> : <FaEdit />}
                  <span>{uploading ? 'Uploading...' : 'Replace'}</span>
                </button>

                <button
                  type="button"
                  className="action-btn delete"
                  onClick={handleDelete}
                  disabled={deleting || parentLoading}
                  title="Delete Resume"
                >
                  {deleting ? <FaSpinner className="spinning" /> : <FaTrash />}
                  <span>{deleting ? 'Deleting...' : 'Delete'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="resume-upload">
          {isEditing ? (
            <div className="upload-area">
              <div className="upload-content">
                <FaUpload className="upload-icon" />
                <p>Upload your resume</p>
                <p className="upload-hint">PDF format only (max 5MB)</p>
                <button
                  type="button"
                  className="upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || parentLoading}
                >
                  {uploading ? (
                    <>
                      <FaSpinner className="spinning" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FaUpload />
                      <span>Choose PDF File</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="no-resume">
              <p>No resume uploaded</p>
            </div>
          )}
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default React.memo(ResumeUpload);
