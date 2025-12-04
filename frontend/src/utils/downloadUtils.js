/**
 * Download Utilities
 * 
 * Helper functions for downloading files
 */

/**
 * Download a file from a blob
 * @param {Blob} blob - File blob
 * @param {string} filename - Desired filename
 */
export const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

/**
 * Download CSV data
 * @param {string} csvData - CSV string data
 * @param {string} filename - Desired filename
 */
export const downloadCSV = (csvData, filename) => {
    const blob = new Blob([csvData], { type: 'text/csv' });
    downloadBlob(blob, filename);
};

/**
 * Download PDF from response
 * @param {Blob} blob - PDF blob
 * @param {string} filename - Desired filename
 */
export const downloadPDF = (blob, filename) => {
    downloadBlob(blob, filename);
};
