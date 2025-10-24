// ID Scanner Bookmarklet - Generates CSV of all ID/Value pairs on a page
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
    
    // Function to get element value based on its type
    function getElementValue(element) {
        const tagName = element.tagName.toLowerCase();
        const type = element.type ? element.type.toLowerCase() : '';
        
        switch (tagName) {
            case 'input':
                if (type === 'checkbox' || type === 'radio') {
                    return element.checked ? 'checked' : 'unchecked';
                } else if (type === 'file') {
                    return element.files.length > 0 ? element.files[0].name : '';
                } else {
                    return element.value || '';
                }
                
            case 'select':
                return element.value || '';
                
            case 'textarea':
                return element.value || '';
                
            case 'button':
                return element.textContent.trim() || element.value || '';
                
            default:
                // For other elements, get text content
                return element.textContent.trim();
        }
    }
    
    // Function to generate CSV content
    function generateCsv() {
        const elementsWithIds = document.querySelectorAll('[id]');
        const csvRows = [];
        
        // Add CSV header
        csvRows.push('ID,Value,Element Type,Element Tag');
        
        // Process each element with an ID
        elementsWithIds.forEach(element => {
            const id = element.id;
            const value = getElementValue(element);
            const elementType = element.type || 'N/A';
            const elementTag = element.tagName.toLowerCase();
            
            // Skip empty IDs
            if (!id.trim()) {
                return;
            }
            
            // Add row to CSV
            csvRows.push([
                escapeCsvValue(id),
                escapeCsvValue(value),
                escapeCsvValue(elementType),
                escapeCsvValue(elementTag)
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
        console.log('ID Scanner Bookmarklet: Starting scan...');
        
        // Generate CSV content
        const csvContent = generateCsv();
        const elementsCount = document.querySelectorAll('[id]').length;
        
        // Show results summary
        const summary = `Found ${elementsCount} elements with IDs on this page.\n\nCSV content generated successfully!`;
        
        // Ask user for filename
        const defaultFilename = `page-ids-${new Date().toISOString().slice(0, 10)}.csv`;
        const filename = prompt(
            summary + '\n\nEnter filename for CSV download (or press OK for default):',
            defaultFilename
        );
        
        if (filename !== null) {
            // Download the CSV file
            downloadCsv(csvContent, filename);
            console.log('ID Scanner Bookmarklet: CSV downloaded successfully!');
            
            // Show success message
            alert(`CSV file "${filename}" downloaded successfully!\n\nFound ${elementsCount} elements with IDs.`);
        } else {
            console.log('ID Scanner Bookmarklet: Download cancelled by user.');
        }
        
    } catch (error) {
        console.error('ID Scanner Bookmarklet Error:', error);
        alert('Error generating CSV: ' + error.message);
    }
})();

// Bookmarklet version (minified for URL):
// javascript:(function(){'use strict';function escapeCsvValue(value){if(value===null||value===undefined){return'';}const stringValue=String(value);if(stringValue.includes(',')||stringValue.includes('"')||stringValue.includes('\n')||stringValue.includes('\r')){return'"'+stringValue.replace(/"/g,'""')+'"';}return stringValue;}function getElementValue(element){const tagName=element.tagName.toLowerCase();const type=element.type?element.type.toLowerCase():'';switch(tagName){case'input':if(type==='checkbox'||type==='radio'){return element.checked?'checked':'unchecked';}else if(type==='file'){return element.files.length>0?element.files[0].name:'';}else{return element.value||'';}case'select':return element.value||'';case'textarea':return element.value||'';case'button':return element.textContent.trim()||element.value||'';default:return element.textContent.trim();}}function generateCsv(){const elementsWithIds=document.querySelectorAll('[id]');const csvRows=[];csvRows.push('ID,Value,Element Type,Element Tag');elementsWithIds.forEach(element=>{const id=element.id;const value=getElementValue(element);const elementType=element.type||'N/A';const elementTag=element.tagName.toLowerCase();if(!id.trim()){return;}csvRows.push([escapeCsvValue(id),escapeCsvValue(value),escapeCsvValue(elementType),escapeCsvValue(elementTag)].join(','));});return csvRows.join('\n');}function downloadCsv(csvContent,filename){const blob=new Blob([csvContent],{type:'text/csv;charset=utf-8;'});const link=document.createElement('a');if(link.download!==undefined){const url=URL.createObjectURL(blob);link.setAttribute('href',url);link.setAttribute('download',filename);link.style.visibility='hidden';document.body.appendChild(link);link.click();document.body.removeChild(link);}else{alert('Your browser does not support automatic downloads. Please copy the CSV content manually.');}}try{console.log('ID Scanner Bookmarklet: Starting scan...');const csvContent=generateCsv();const elementsCount=document.querySelectorAll('[id]').length;const summary=`Found ${elementsCount} elements with IDs on this page.\n\nCSV content generated successfully!`;const defaultFilename=`page-ids-${new Date().toISOString().slice(0,10)}.csv`;const filename=prompt(summary+'\n\nEnter filename for CSV download (or press OK for default):',defaultFilename);if(filename!==null){downloadCsv(csvContent,filename);console.log('ID Scanner Bookmarklet: CSV downloaded successfully!');alert(`CSV file "${filename}" downloaded successfully!\n\nFound ${elementsCount} elements with IDs.`);}else{console.log('ID Scanner Bookmarklet: Download cancelled by user.');}}catch(error){console.error('ID Scanner Bookmarklet Error:',error);alert('Error generating CSV: '+error.message);}})();
