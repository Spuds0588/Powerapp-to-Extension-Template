// Local Storage Scanner Bookmarklet - Generates CSV of all Local Storage key/value pairs
// Usage: Copy this code, create a bookmark, and paste as the URL

(function() {
    'use strict';
    
    // Function to escape CSV values (handle commas, quotes, newlines)
    function escapeCsvValue(value) {
        if (value === null || value === undefined) {
            return '';
        }
        
        const stringValue = String(value);
        
        // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
            return '"' + stringValue.replace(/"/g, '""') + '"';
        }
        
        return stringValue;
    }
    
    // Function to get local storage value and type
    function getLocalStorageInfo(key) {
        try {
            const value = localStorage.getItem(key);
            if (value === null) {
                return { value: '', type: 'null', isJson: false };
            }
            
            // Try to parse as JSON
            try {
                const parsed = JSON.parse(value);
                return { 
                    value: JSON.stringify(parsed), 
                    type: typeof parsed, 
                    isJson: true,
                    originalValue: value
                };
            } catch (parseError) {
                return { 
                    value: value, 
                    type: 'string', 
                    isJson: false,
                    originalValue: value
                };
            }
        } catch (error) {
            return { 
                value: `Error: ${error.message}`, 
                type: 'error', 
                isJson: false,
                originalValue: ''
            };
        }
    }
    
    // Function to generate CSV content
    function generateCsv() {
        const csvRows = [];
        
        // Add CSV header
        csvRows.push('Key,Value,Type,Is JSON,Original Value');
        
        // Get all local storage keys
        const keys = Object.keys(localStorage);
        
        if (keys.length === 0) {
            csvRows.push('No local storage data found');
            return csvRows.join('\n');
        }
        
        // Process each local storage key
        keys.forEach(key => {
            const info = getLocalStorageInfo(key);
            
            // Add row to CSV
            csvRows.push([
                escapeCsvValue(key),
                escapeCsvValue(info.value),
                escapeCsvValue(info.type),
                escapeCsvValue(info.isJson ? 'Yes' : 'No'),
                escapeCsvValue(info.originalValue)
            ].join(','));
        });
        
        return csvRows.join('\n');
    }
    
    // Function to download CSV file
    function downloadCsv(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            // Modern browsers
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // Fallback for older browsers
            alert('Your browser does not support automatic downloads. Please copy the CSV content manually.');
        }
    }
    
    // Main execution
    try {
        console.log('Local Storage Scanner Bookmarklet: Starting scan...');
        
        // Generate CSV content
        const csvContent = generateCsv();
        const keysCount = Object.keys(localStorage).length;
        
        // Show results summary
        const summary = `Found ${keysCount} local storage keys on this page.\n\nCSV content generated successfully!`;
        
        // Ask user for filename
        const defaultFilename = `local-storage-${new Date().toISOString().slice(0, 10)}.csv`;
        const filename = prompt(
            summary + '\n\nEnter filename for CSV download (or press OK for default):',
            defaultFilename
        );
        
        if (filename !== null) {
            // Download the CSV file
            downloadCsv(csvContent, filename);
            console.log('Local Storage Scanner Bookmarklet: CSV downloaded successfully!');
            
            // Show success message
            alert(`CSV file "${filename}" downloaded successfully!\n\nFound ${keysCount} local storage keys.`);
        } else {
            console.log('Local Storage Scanner Bookmarklet: Download cancelled by user.');
        }
        
    } catch (error) {
        console.error('Local Storage Scanner Bookmarklet Error:', error);
        alert('Error generating CSV: ' + error.message);
    }
})();

// Bookmarklet version (minified for URL):
// javascript:(function(){'use strict';function escapeCsvValue(value){if(value===null||value===undefined){return'';}const stringValue=String(value);if(stringValue.includes(',')||stringValue.includes('"')||stringValue.includes('\n')||stringValue.includes('\r')){return'"'+stringValue.replace(/"/g,'""')+'"';}return stringValue;}function getLocalStorageInfo(key){try{const value=localStorage.getItem(key);if(value===null){return{value:'',type:'null',isJson:false};}try{const parsed=JSON.parse(value);return{value:JSON.stringify(parsed),type:typeof parsed,isJson:true,originalValue:value};}catch(parseError){return{value:value,type:'string',isJson:false,originalValue:value};}}catch(error){return{value:`Error: ${error.message}`,type:'error',isJson:false,originalValue:''};}}function generateCsv(){const csvRows=[];csvRows.push('Key,Value,Type,Is JSON,Original Value');const keys=Object.keys(localStorage);if(keys.length===0){csvRows.push('No local storage data found');return csvRows.join('\n');}keys.forEach(key=>{const info=getLocalStorageInfo(key);csvRows.push([escapeCsvValue(key),escapeCsvValue(info.value),escapeCsvValue(info.type),escapeCsvValue(info.isJson?'Yes':'No'),escapeCsvValue(info.originalValue)].join(','));});return csvRows.join('\n');}function downloadCsv(csvContent,filename){const blob=new Blob([csvContent],{type:'text/csv;charset=utf-8;'});const link=document.createElement('a');if(link.download!==undefined){const url=URL.createObjectURL(blob);link.setAttribute('href',url);link.setAttribute('download',filename);link.style.visibility='hidden';document.body.appendChild(link);link.click();document.body.removeChild(link);}else{alert('Your browser does not support automatic downloads. Please copy the CSV content manually.');}}try{console.log('Local Storage Scanner Bookmarklet: Starting scan...');const csvContent=generateCsv();const keysCount=Object.keys(localStorage).length;const summary=`Found ${keysCount} local storage keys on this page.\n\nCSV content generated successfully!`;const defaultFilename=`local-storage-${new Date().toISOString().slice(0,10)}.csv`;const filename=prompt(summary+'\n\nEnter filename for CSV download (or press OK for default):',defaultFilename);if(filename!==null){downloadCsv(csvContent,filename);console.log('Local Storage Scanner Bookmarklet: CSV downloaded successfully!');alert(`CSV file "${filename}" downloaded successfully!\n\nFound ${keysCount} local storage keys.`);}else{console.log('Local Storage Scanner Bookmarklet: Download cancelled by user.');}}catch(error){console.error('Local Storage Scanner Bookmarklet Error:',error);alert('Error generating CSV: '+error.message);}})();
