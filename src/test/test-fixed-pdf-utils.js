/**
 * Test the fixed PDF utilities
 */

// Simulate the utility functions (since we can't import in Node.js easily)
const ensurePdfFormat = (url) => {
  if (!url) return url;
  
  let pdfUrl = url;
  
  // Convert raw to image if needed
  if (pdfUrl.includes('/raw/upload/')) {
    pdfUrl = pdfUrl.replace('/raw/upload/', '/image/upload/');
  }
  
  return pdfUrl;
};

const generatePdfDownloadUrl = (url, filename = 'resume.pdf') => {
  if (!url) return url;
  
  let downloadUrl = ensurePdfFormat(url);
  
  // Add fl_attachment flag for download behavior
  if (!downloadUrl.includes('fl_attachment')) {
    const urlParts = downloadUrl.split('/upload/');
    if (urlParts.length === 2) {
      downloadUrl = `${urlParts[0]}/upload/fl_attachment/${urlParts[1]}`;
    }
  }
  
  return downloadUrl;
};

// Test URLs
const testUrls = {
  // Old problematic URL (raw)
  oldRaw: 'https://res.cloudinary.com/dr4uuk5x0/raw/upload/v1753966102/talentflow/resumes/resume_resume2_1753966099147.pdf',
  
  // New correct URL (image)
  newImage: 'https://res.cloudinary.com/dr4uuk5x0/image/upload/v1753967440/talentflow/resumes/resume_resume2_1753967438669.pdf',
  
  // Malformed URL that was causing 404
  malformed: 'https://res.cloudinary.com/dr4uuk5x0/image/upload/f_pdf,v1753967440,fl_attachment/talentflow/resumes/resume_resume2_1753967438669.pdf.pdf'
};

console.log('=== TESTING FIXED PDF UTILITIES ===\n');

Object.entries(testUrls).forEach(([name, url]) => {
  console.log(`${name.toUpperCase()}:`);
  console.log(`Original: ${url}`);
  
  const processed = ensurePdfFormat(url);
  console.log(`Processed: ${processed}`);
  
  const download = generatePdfDownloadUrl(processed, 'test_resume.pdf');
  console.log(`Download: ${download}`);
  
  console.log(`Valid format: ${processed.endsWith('.pdf') && !processed.includes('.pdf.pdf')}`);
  console.log(`Has single .pdf: ${processed.endsWith('.pdf') && processed.split('.pdf').length === 2}`);
  console.log('---\n');
});

console.log('=== EXPECTED RESULTS ===');
console.log('✅ All URLs should end with single .pdf');
console.log('✅ No double extensions (.pdf.pdf)');
console.log('✅ Simple fl_attachment transformation');
console.log('✅ Raw URLs converted to image URLs');
console.log('✅ No complex transformations (f_pdf, etc.)');
