/**
 * Test script to verify PDF URL handling fixes
 */

import { ensurePdfFormat, generatePdfDownloadUrl, isPdfUrlValid, debugPdfUrl } from '../utils/pdfUtils.js';

// Test URLs - both old (raw) and new (image) formats
const testUrls = {
  oldRawUrl: 'https://res.cloudinary.com/dr4uuk5x0/raw/upload/v1753966102/talentflow/resumes/resume_resume2_1753966099147.pdf',
  newImageUrl: 'https://res.cloudinary.com/dr4uuk5x0/image/upload/v1753966102/talentflow/resumes/resume_resume2_1753966099147.pdf',
  malformedUrl: 'https://res.cloudinary.com/dr4uuk5x0/upload/v1753966102/talentflow/resumes/resume_resume2_1753966099147.pdf'
};

console.log('=== PDF URL HANDLING TESTS ===\n');

// Test 1: URL Format Conversion
console.log('1. Testing URL Format Conversion:');
Object.entries(testUrls).forEach(([name, url]) => {
  console.log(`\n${name}:`);
  console.log(`Original: ${url}`);
  const converted = ensurePdfFormat(url);
  console.log(`Converted: ${converted}`);
  console.log(`Valid: ${isPdfUrlValid(converted)}`);
});

// Test 2: Download URL Generation
console.log('\n\n2. Testing Download URL Generation:');
Object.entries(testUrls).forEach(([name, url]) => {
  console.log(`\n${name}:`);
  const downloadUrl = generatePdfDownloadUrl(url, 'test_resume.pdf');
  console.log(`Download URL: ${downloadUrl}`);
  console.log(`Has attachment flag: ${downloadUrl?.includes('fl_attachment')}`);
});

// Test 3: Debug Output
console.log('\n\n3. Debug Information:');
debugPdfUrl(testUrls.oldRawUrl, 'test-old');
debugPdfUrl(testUrls.newImageUrl, 'test-new');

console.log('\n=== TESTS COMPLETED ===');
