// Cloudinary Configuration
// Replace these values with your actual Cloudinary credentials

const CLOUDINARY_CONFIG = {
    // Your Cloudinary cloud name (found in your Cloudinary dashboard)
    cloudName: 'dy6nbfwet',
    
    // Your upload preset (create one in Cloudinary dashboard > Settings > Upload)
    uploadPreset: 'Unsigned',
    
    // Cloudinary API URL (usually don't need to change this)
    apiUrl: 'https://api.cloudinary.com/v1_1'
};

// Instructions for setup:
// 1. Sign up at https://cloudinary.com/
// 2. Get your cloud name from the dashboard
// 3. Create an upload preset:
//    - Go to Settings > Upload
//    - Scroll to Upload presets
//    - Click "Add upload preset"
//    - Set signing mode to "Unsigned"
//    - Save the preset name
// 4. Replace 'your-cloud-name' and 'your-upload-preset' above
// 5. Include this file in your HTML before script.js

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CLOUDINARY_CONFIG;
} 