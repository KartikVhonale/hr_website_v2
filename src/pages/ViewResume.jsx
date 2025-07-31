import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaDownload, FaArrowLeft, FaEye, FaFilePdf, FaSpinner, FaExternalLinkAlt } from 'react-icons/fa';
import { getJobseekerProfile } from '../services/jobseekerService';
import { ensurePdfFormat, generatePdfDownloadUrl, debugPdfUrl } from '../utils/pdfUtils';
import '../css/ViewResume.css';

const ViewResume = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResumeData();
  }, [userId]);

  const fetchResumeData = async () => {
    try {
      setLoading(true);
      console.log('Fetching resume data for user:', userId);
      
      const response = await getJobseekerProfile();
      console.log('Profile response:', response.data);
      
      if (response.data.success && response.data.data.resume) {
        const resume = response.data.data.resume;
        console.log('=== RESUME DATA LOADED ===');
        console.log('Resume URL:', resume.url);
        debugPdfUrl(resume.url, 'view');

        // Ensure the URL is properly formatted for PDF viewing
        const processedResume = {
          ...resume,
          url: ensurePdfFormat(resume.url)
        };

        console.log('Processed PDF URL:', processedResume.url);
        setResumeData(processedResume);
        setUserInfo({
          name: response.data.data.name,
          email: response.data.data.email,
          jobTitle: response.data.data.jobTitle,
          location: response.data.data.location
        });
      } else {
        setError('No resume found for this user');
      }
    } catch (err) {
      console.error('Error fetching resume:', err);
      setError('Failed to load resume');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (resumeData?.url) {
      console.log('=== DOWNLOADING PDF FROM VIEWER ===');
      debugPdfUrl(resumeData.url, 'download');

      const filename = resumeData.original_name || 'resume.pdf';
      const downloadUrl = generatePdfDownloadUrl(resumeData.url, filename);

      if (!downloadUrl) {
        console.error('Failed to create download URL');
        alert('Unable to download PDF. Please try again.');
        return;
      }

      console.log('Download URL created:', downloadUrl);

      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenInNewTab = () => {
    if (resumeData?.url) {
      console.log('=== OPENING PDF IN NEW TAB ===');
      debugPdfUrl(resumeData.url, 'open-tab');

      // Use the processed URL for opening in new tab
      window.open(resumeData.url, '_blank');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="view-resume-container">
        <div className="loading-state">
          <FaSpinner className="spinning" />
          <p>Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-resume-container">
        <div className="error-state">
          <h2>Resume Not Found</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="back-btn">
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-resume-container">
      {/* Header */}
      <div className="resume-header">
        <div className="header-left">
          <button onClick={() => navigate(-1)} className="back-btn">
            <FaArrowLeft /> Back
          </button>
          <div className="resume-info">
            <h1>Resume Viewer</h1>
            {userInfo && (
              <div className="user-info">
                <h2>{userInfo.name}</h2>
                {userInfo.jobTitle && <p className="job-title">{userInfo.jobTitle}</p>}
                {userInfo.location && <p className="location">{userInfo.location}</p>}
              </div>
            )}
          </div>
        </div>
        
        <div className="header-actions">
          <button onClick={handleOpenInNewTab} className="action-btn open-tab">
            <FaExternalLinkAlt />
            <span>Open in New Tab</span>
          </button>
          <button onClick={handleDownload} className="action-btn download">
            <FaDownload />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Resume Details */}
      <div className="resume-details">
        <div className="file-info">
          <div className="file-icon">
            <FaFilePdf />
          </div>
          <div className="file-meta">
            <h3>{resumeData.original_name}</h3>
            <div className="meta-items">
              <span>Uploaded: {formatDate(resumeData.uploaded_at)}</span>
              {resumeData.cloudinary_info?.bytes && (
                <span>Size: {formatFileSize(resumeData.cloudinary_info.bytes)}</span>
              )}
              {resumeData.cloudinary_info?.pages && (
                <span>Pages: {resumeData.cloudinary_info.pages}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="pdf-viewer-container">
        <div className="pdf-viewer">
          {resumeData.url && (
            <iframe
              src={resumeData.url}
              title={`Resume - ${resumeData.original_name || 'PDF Viewer'}`}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              onLoad={() => console.log('PDF iframe loaded successfully')}
              onError={() => console.error('PDF iframe failed to load')}
            />
          )}
          {!resumeData.url && (
            <div className="pdf-error">
              <p>Unable to load PDF. Please try downloading instead.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Actions */}
      <div className="mobile-actions">
        <button onClick={handleOpenInNewTab} className="mobile-action-btn">
          <FaEye />
          <span>View Full Screen</span>
        </button>
        <button onClick={handleDownload} className="mobile-action-btn">
          <FaDownload />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};

export default ViewResume;
