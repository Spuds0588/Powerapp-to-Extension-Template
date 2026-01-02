// [PowerApp Ext-Builder] app.js - v1.0.0 (Final Build)

// --- CONTENT MANAGEMENT FOR PRODUCT MANAGER ---
// This section contains placeholder content.
// Bookmarklet URLs are URL-encoded and ready to use.
// GIF paths point to Assets folder - replace with actual GIF files when ready.
const INSTRUCTIONAL_ASSETS = {
    idFinderBookmarklet: "javascript:(function()%7B%2F%2F%20ID%20Scanner%20Bookmarklet%20-%20Generates%20CSV%20of%20all%20ID%2FValue%20pairs%20on%20a%20page%0A%2F%2F%20Usage%3A%20Copy%20this%20code%2C%20create%20a%20bookmark%2C%20and%20paste%20as%20the%20URL%0A%0A(function()%20%7B%0A%20%20%20%20'use%20strict'%3B%0A%20%20%20%20%0A%20%20%20%20%2F%2F%20Function%20to%20escape%20CSV%20values%20(handle%20commas%2C%20quotes%2C%20newlines)%0A%20%20%20%20function%20escapeCsvValue(value)%20%7B%0A%20%20%20%20%20%20%20%20if%20(value%20%3D%3D%3D%20null%20%7C%7C%20value%20%3D%3D%3D%20undefined)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20return%20''%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20const%20stringValue%20%3D%20String(value)%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%2F%2F%20If%20value%20contains%20comma%2C%20quote%2C%20or%20newline%2C%20wrap%20in%20quotes%20and%20escape%20internal%20quotes%0A%20%20%20%20%20%20%20%20if%20(stringValue.includes('%2C')%20%7C%7C%20stringValue.includes('%22')%20%7C%7C%20stringValue.includes('%5Cn')%20%7C%7C%20stringValue.includes('%5Cr'))%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20return%20'%22'%20%2B%20stringValue.replace(%2F%22%2Fg%2C%20'%22%22')%20%2B%20'%22'%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20return%20stringValue%3B%0A%20%20%20%20%7D%0A%20%20%20%20%0A%20%20%20%20%2F%2F%20Function%20to%20get%20element%20value%20based%20on%20its%20type%0A%20%20%20%20function%20getElementValue(element)%20%7B%0A%20%20%20%20%20%20%20%20const%20tagName%20%3D%20element.tagName.toLowerCase()%3B%0A%20%20%20%20%20%20%20%20const%20type%20%3D%20element.type%20%3F%20element.type.toLowerCase()%20%3A%20''%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20switch%20(tagName)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20case%20'input'%3A%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20if%20(type%20%3D%3D%3D%20'checkbox'%20%7C%7C%20type%20%3D%3D%3D%20'radio')%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20element.checked%20%3F%20'checked'%20%3A%20'unchecked'%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20else%20if%20(type%20%3D%3D%3D%20'file')%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20element.files.length%20%3E%200%20%3F%20element.files%5B0%5D.name%20%3A%20''%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20element.value%20%7C%7C%20''%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20case%20'select'%3A%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20element.value%20%7C%7C%20''%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20case%20'textarea'%3A%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20element.value%20%7C%7C%20''%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20case%20'button'%3A%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20element.textContent.trim()%20%7C%7C%20element.value%20%7C%7C%20''%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20default%3A%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20For%20other%20elements%2C%20get%20text%20content%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20element.textContent.trim()%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20%0A%20%20%20%20%2F%2F%20Function%20to%20generate%20CSV%20content%0A%20%20%20%20function%20generateCsv()%20%7B%0A%20%20%20%20%20%20%20%20const%20elementsWithIds%20%3D%20document.querySelectorAll('%5Bid%5D')%3B%0A%20%20%20%20%20%20%20%20const%20csvRows%20%3D%20%5B%5D%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%2F%2F%20Add%20CSV%20header%0A%20%20%20%20%20%20%20%20csvRows.push('ID%2CValue%2CElement%20Type%2CElement%20Tag')%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%2F%2F%20Process%20each%20element%20with%20an%20ID%0A%20%20%20%20%20%20%20%20elementsWithIds.forEach(element%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20const%20id%20%3D%20element.id%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20const%20value%20%3D%20getElementValue(element)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20const%20elementType%20%3D%20element.type%20%7C%7C%20'N%2FA'%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20const%20elementTag%20%3D%20element.tagName.toLowerCase()%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Skip%20empty%20IDs%0A%20%20%20%20%20%20%20%20%20%20%20%20if%20(!id.trim())%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Add%20row%20to%20CSV%0A%20%20%20%20%20%20%20%20%20%20%20%20csvRows.push(%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20escapeCsvValue(id)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20escapeCsvValue(value)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20escapeCsvValue(elementType)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20escapeCsvValue(elementTag)%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D.join('%2C'))%3B%0A%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20return%20csvRows.join('%5Cn')%3B%0A%20%20%20%20%7D%0A%20%20%20%20%0A%20%20%20%20%2F%2F%20Function%20to%20download%20CSV%20file%0A%20%20%20%20function%20downloadCsv(csvContent%2C%20filename)%20%7B%0A%20%20%20%20%20%20%20%20const%20blob%20%3D%20new%20Blob(%5BcsvContent%5D%2C%20%7B%20type%3A%20'text%2Fcsv%3Bcharset%3Dutf-8%3B'%20%7D)%3B%0A%20%20%20%20%20%20%20%20const%20link%20%3D%20document.createElement('a')%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20if%20(link.download%20!%3D%3D%20undefined)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Modern%20browsers%0A%20%20%20%20%20%20%20%20%20%20%20%20const%20url%20%3D%20URL.createObjectURL(blob)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20link.setAttribute('href'%2C%20url)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20link.setAttribute('download'%2C%20filename)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20link.style.visibility%20%3D%20'hidden'%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20document.body.appendChild(link)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20link.click()%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20document.body.removeChild(link)%3B%0A%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Fallback%20for%20older%20browsers%0A%20%20%20%20%20%20%20%20%20%20%20%20alert('Your%20browser%20does%20not%20support%20automatic%20downloads.%20Please%20copy%20the%20CSV%20content%20manually.')%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20%0A%20%20%20%20%2F%2F%20Main%20execution%0A%20%20%20%20try%20%7B%0A%20%20%20%20%20%20%20%20console.log('ID%20Scanner%20Bookmarklet%3A%20Starting%20scan...')%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%2F%2F%20Generate%20CSV%20content%0A%20%20%20%20%20%20%20%20const%20csvContent%20%3D%20generateCsv()%3B%0A%20%20%20%20%20%20%20%20const%20elementsCount%20%3D%20document.querySelectorAll('%5Bid%5D').length%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%2F%2F%20Show%20results%20summary%0A%20%20%20%20%20%20%20%20const%20summary%20%3D%20%60Found%20%24%7BelementsCount%7D%20elements%20with%20IDs%20on%20this%20page.%5Cn%5CnCSV%20content%20generated%20successfully!%60%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%2F%2F%20Ask%20user%20for%20filename%0A%20%20%20%20%20%20%20%20const%20defaultFilename%20%3D%20%60page-ids-%24%7Bnew%20Date().toISOString().slice(0%2C%2010)%7D.csv%60%3B%0A%20%20%20%20%20%20%20%20const%20filename%20%3D%20prompt(%0A%20%20%20%20%20%20%20%20%20%20%20%20summary%20%2B%20'%5Cn%5CnEnter%20filename%20for%20CSV%20download%20(or%20press%20OK%20for%20default)%3A'%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20defaultFilename%0A%20%20%20%20%20%20%20%20)%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20if%20(filename%20!%3D%3D%20null)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Download%20the%20CSV%20file%0A%20%20%20%20%20%20%20%20%20%20%20%20downloadCsv(csvContent%2C%20filename)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20console.log('ID%20Scanner%20Bookmarklet%3A%20CSV%20downloaded%20successfully!')%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Show%20success%20message%0A%20%20%20%20%20%20%20%20%20%20%20%20alert(%60CSV%20file%20%22%24%7Bfilename%7D%22%20downloaded%20successfully!%5Cn%5CnFound%20%24%7BelementsCount%7D%20elements%20with%20IDs.%60)%3B%0A%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20console.log('ID%20Scanner%20Bookmarklet%3A%20Download%20cancelled%20by%20user.')%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%7D%20catch%20(error)%20%7B%0A%20%20%20%20%20%20%20%20console.error('ID%20Scanner%20Bookmarklet%20Error%3A'%2C%20error)%3B%0A%20%20%20%20%20%20%20%20alert('Error%20generating%20CSV%3A%20'%20%2B%20error.message)%3B%0A%20%20%20%20%7D%0A%7D)()%3B%0A%0A%2F%2F%20Bookmarklet%20version%20(minified%20for%20URL)%3A%0A%2F%2F%20javascript%3A(function()%7B'use%20strict'%3Bfunction%20escapeCsvValue(value)%7Bif(value%3D%3D%3Dnull%7C%7Cvalue%3D%3D%3Dundefined)%7Breturn''%3B%7Dconst%20stringValue%3DString(value)%3Bif(stringValue.includes('%2C')%7C%7CstringValue.includes('%22')%7C%7CstringValue.includes('%5Cn')%7C%7CstringValue.includes('%5Cr'))%7Breturn'%22'%2BstringValue.replace(%2F%22%2Fg%2C'%22%22')%2B'%22'%3B%7Dreturn%20stringValue%3B%7Dfunction%20getElementValue(element)%7Bconst%20tagName%3Delement.tagName.toLowerCase()%3Bconst%20type%3Delement.type%3Felement.type.toLowerCase()%3A''%3Bswitch(tagName)%7Bcase'input'%3Aif(type%3D%3D%3D'checkbox'%7C%7Ctype%3D%3D%3D'radio')%7Breturn%20element.checked%3F'checked'%3A'unchecked'%3B%7Delse%20if(type%3D%3D%3D'file')%7Breturn%20element.files.length%3E0%3Felement.files%5B0%5D.name%3A''%3B%7Delse%7Breturn%20element.value%7C%7C''%3B%7Dcase'select'%3Areturn%20element.value%7C%7C''%3Bcase'textarea'%3Areturn%20element.value%7C%7C''%3Bcase'button'%3Areturn%20element.textContent.trim()%7C%7Celement.value%7C%7C''%3Bdefault%3Areturn%20element.textContent.trim()%3B%7D%7Dfunction%20generateCsv()%7Bconst%20elementsWithIds%3Ddocument.querySelectorAll('%5Bid%5D')%3Bconst%20csvRows%3D%5B%5D%3BcsvRows.push('ID%2CValue%2CElement%20Type%2CElement%20Tag')%3BelementsWithIds.forEach(element%3D%3E%7Bconst%20id%3Delement.id%3Bconst%20value%3DgetElementValue(element)%3Bconst%20elementType%3Delement.type%7C%7C'N%2FA'%3Bconst%20elementTag%3Delement.tagName.toLowerCase()%3Bif(!id.trim())%7Breturn%3B%7DcsvRows.push(%5BescapeCsvValue(id)%2CescapeCsvValue(value)%2CescapeCsvValue(elementType)%2CescapeCsvValue(elementTag)%5D.join('%2C'))%3B%7D)%3Breturn%20csvRows.join('%5Cn')%3B%7Dfunction%20downloadCsv(csvContent%2Cfilename)%7Bconst%20blob%3Dnew%20Blob(%5BcsvContent%5D%2C%7Btype%3A'text%2Fcsv%3Bcharset%3Dutf-8%3B'%7D)%3Bconst%20link%3Ddocument.createElement('a')%3Bif(link.download!%3D%3Dundefined)%7Bconst%20url%3DURL.createObjectURL(blob)%3Blink.setAttribute('href'%2Curl)%3Blink.setAttribute('download'%2Cfilename)%3Blink.style.visibility%3D'hidden'%3Bdocument.body.appendChild(link)%3Blink.click()%3Bdocument.body.removeChild(link)%3B%7Delse%7Balert('Your%20browser%20does%20not%20support%20automatic%20downloads.%20Please%20copy%20the%20CSV%20content%20manually.')%3B%7D%7Dtry%7Bconsole.log('ID%20Scanner%20Bookmarklet%3A%20Starting%20scan...')%3Bconst%20csvContent%3DgenerateCsv()%3Bconst%20elementsCount%3Ddocument.querySelectorAll('%5Bid%5D').length%3Bconst%20summary%3D%60Found%20%24%7BelementsCount%7D%20elements%20with%20IDs%20on%20this%20page.%5Cn%5CnCSV%20content%20generated%20successfully!%60%3Bconst%20defaultFilename%3D%60page-ids-%24%7Bnew%20Date().toISOString().slice(0%2C10)%7D.csv%60%3Bconst%20filename%3Dprompt(summary%2B'%5Cn%5CnEnter%20filename%20for%20CSV%20download%20(or%20press%20OK%20for%20default)%3A'%2CdefaultFilename)%3Bif(filename!%3D%3Dnull)%7BdownloadCsv(csvContent%2Cfilename)%3Bconsole.log('ID%20Scanner%20Bookmarklet%3A%20CSV%20downloaded%20successfully!')%3Balert(%60CSV%20file%20%22%24%7Bfilename%7D%22%20downloaded%20successfully!%5Cn%5CnFound%20%24%7BelementsCount%7D%20elements%20with%20IDs.%60)%3B%7Delse%7Bconsole.log('ID%20Scanner%20Bookmarklet%3A%20Download%20cancelled%20by%20user.')%3B%7D%7Dcatch(error)%7Bconsole.error('ID%20Scanner%20Bookmarklet%20Error%3A'%2Cerror)%3Balert('Error%20generating%20CSV%3A%20'%2Berror.message)%3B%7D%7D)()%3B%0A%7D)()%3B",
    storageFinderBookmarklet: "javascript:(function()%7B%2F%2F%20Local%20Storage%20Scanner%20Bookmarklet%20-%20Generates%20CSV%20of%20all%20Local%20Storage%20key%2Fvalue%20pairs%0A%2F%2F%20Usage%3A%20Copy%20this%20code%2C%20create%20a%20bookmark%2C%20and%20paste%20as%20the%20URL%0A%0A(function()%20%7B%0A%20%20%20%20'use%20strict'%3B%0A%20%20%20%20%0A%20%20%20%20%2F%2F%20Function%20to%20escape%20CSV%20values%20(handle%20commas%2C%20quotes%2C%20newlines)%0A%20%20%20%20function%20escapeCsvValue(value)%20%7B%0A%20%20%20%20%20%20%20%20if%20(value%20%3D%3D%3D%20null%20%7C%7C%20value%20%3D%3D%3D%20undefined)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20return%20''%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20const%20stringValue%20%3D%20String(value)%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%2F%2F%20If%20value%20contains%20comma%2C%20quote%2C%20or%20newline%2C%20wrap%20in%20quotes%20and%20escape%20internal%20quotes%0A%20%20%20%20%20%20%20%20if%20(stringValue.includes('%2C')%20%7C%7C%20stringValue.includes('%22')%20%7C%7C%20stringValue.includes('%5Cn')%20%7C%7C%20stringValue.includes('%5Cr'))%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20return%20'%22'%20%2B%20stringValue.replace(%2F%22%2Fg%2C%20'%22%22')%20%2B%20'%22'%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20return%20stringValue%3B%0A%20%20%20%20%7D%0A%20%20%20%20%0A%20%20%20%20%2F%2F%20Function%20to%20get%20local%20storage%20value%20and%20type%0A%20%20%20%20function%20getLocalStorageInfo(key)%20%7B%0A%20%20%20%20%20%20%20%20try%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20const%20value%20%3D%20localStorage.getItem(key)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20if%20(value%20%3D%3D%3D%20null)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20%7B%20value%3A%20''%2C%20type%3A%20'null'%2C%20isJson%3A%20false%20%7D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Try%20to%20parse%20as%20JSON%0A%20%20%20%20%20%20%20%20%20%20%20%20try%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20const%20parsed%20%3D%20JSON.parse(value)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20%7B%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20value%3A%20JSON.stringify(parsed)%2C%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20type%3A%20typeof%20parsed%2C%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20isJson%3A%20true%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20originalValue%3A%20value%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%20catch%20(parseError)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20return%20%7B%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20value%3A%20value%2C%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20type%3A%20'string'%2C%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20isJson%3A%20false%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20originalValue%3A%20value%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%20catch%20(error)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20return%20%7B%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20value%3A%20%60Error%3A%20%24%7Berror.message%7D%60%2C%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20type%3A%20'error'%2C%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20isJson%3A%20false%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20originalValue%3A%20''%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20%0A%20%20%20%20%2F%2F%20Function%20to%20generate%20CSV%20content%0A%20%20%20%20function%20generateCsv()%20%7B%0A%20%20%20%20%20%20%20%20const%20csvRows%20%3D%20%5B%5D%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%2F%2F%20Add%20CSV%20header%0A%20%20%20%20%20%20%20%20csvRows.push('Key%2CValue%2CType%2CIs%20JSON%2COriginal%20Value')%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%2F%2F%20Get%20all%20local%20storage%20keys%0A%20%20%20%20%20%20%20%20const%20keys%20%3D%20Object.keys(localStorage)%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20if%20(keys.length%20%3D%3D%3D%200)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20csvRows.push('No%20local%20storage%20data%20found')%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20return%20csvRows.join('%5Cn')%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%2F%2F%20Process%20each%20local%20storage%20key%0A%20%20%20%20%20%20%20%20keys.forEach(key%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20const%20info%20%3D%20getLocalStorageInfo(key)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Add%20row%20to%20CSV%0A%20%20%20%20%20%20%20%20%20%20%20%20csvRows.push(%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20escapeCsvValue(key)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20escapeCsvValue(info.value)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20escapeCsvValue(info.type)%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20escapeCsvValue(info.isJson%20%3F%20'Yes'%20%3A%20'No')%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20escapeCsvValue(info.originalValue)%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D.join('%2C'))%3B%0A%20%20%20%20%20%20%20%20%7D)%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20return%20csvRows.join('%5Cn')%3B%0A%20%20%20%20%7D%0A%20%20%20%20%0A%20%20%20%20%2F%2F%20Function%20to%20download%20CSV%20file%0A%20%20%20%20function%20downloadCsv(csvContent%2C%20filename)%20%7B%0A%20%20%20%20%20%20%20%20const%20blob%20%3D%20new%20Blob(%5BcsvContent%5D%2C%20%7B%20type%3A%20'text%2Fcsv%3Bcharset%3Dutf-8%3B'%20%7D)%3B%0A%20%20%20%20%20%20%20%20const%20link%20%3D%20document.createElement('a')%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20if%20(link.download%20!%3D%3D%20undefined)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Modern%20browsers%0A%20%20%20%20%20%20%20%20%20%20%20%20const%20url%20%3D%20URL.createObjectURL(blob)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20link.setAttribute('href'%2C%20url)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20link.setAttribute('download'%2C%20filename)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20link.style.visibility%20%3D%20'hidden'%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20document.body.appendChild(link)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20link.click()%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20document.body.removeChild(link)%3B%0A%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Fallback%20for%20older%20browsers%0A%20%20%20%20%20%20%20%20%20%20%20%20alert('Your%20browser%20does%20not%20support%20automatic%20downloads.%20Please%20copy%20the%20CSV%20content%20manually.')%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20%0A%20%20%20%20%2F%2F%20Main%20execution%0A%20%20%20%20try%20%7B%0A%20%20%20%20%20%20%20%20console.log('Local%20Storage%20Scanner%20Bookmarklet%3A%20Starting%20scan...')%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%2F%2F%20Generate%20CSV%20content%0A%20%20%20%20%20%20%20%20const%20csvContent%20%3D%20generateCsv()%3B%0A%20%20%20%20%20%20%20%20const%20keysCount%20%3D%20Object.keys(localStorage).length%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%2F%2F%20Show%20results%20summary%0A%20%20%20%20%20%20%20%20const%20summary%20%3D%20%60Found%20%24%7BkeysCount%7D%20local%20storage%20keys%20on%20this%20page.%5Cn%5CnCSV%20content%20generated%20successfully!%60%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%2F%2F%20Ask%20user%20for%20filename%0A%20%20%20%20%20%20%20%20const%20defaultFilename%20%3D%20%60local-storage-%24%7Bnew%20Date().toISOString().slice(0%2C%2010)%7D.csv%60%3B%0A%20%20%20%20%20%20%20%20const%20filename%20%3D%20prompt(%0A%20%20%20%20%20%20%20%20%20%20%20%20summary%20%2B%20'%5Cn%5CnEnter%20filename%20for%20CSV%20download%20(or%20press%20OK%20for%20default)%3A'%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20defaultFilename%0A%20%20%20%20%20%20%20%20)%3B%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20if%20(filename%20!%3D%3D%20null)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Download%20the%20CSV%20file%0A%20%20%20%20%20%20%20%20%20%20%20%20downloadCsv(csvContent%2C%20filename)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20console.log('Local%20Storage%20Scanner%20Bookmarklet%3A%20CSV%20downloaded%20successfully!')%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%2F%2F%20Show%20success%20message%0A%20%20%20%20%20%20%20%20%20%20%20%20alert(%60CSV%20file%20%22%24%7Bfilename%7D%22%20downloaded%20successfully!%5Cn%5CnFound%20%24%7BkeysCount%7D%20local%20storage%20keys.%60)%3B%0A%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20console.log('Local%20Storage%20Scanner%20Bookmarklet%3A%20Download%20cancelled%20by%20user.')%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%7D%20catch%20(error)%20%7B%0A%20%20%20%20%20%20%20%20console.error('Local%20Storage%20Scanner%20Bookmarklet%20Error%3A'%2C%20error)%3B%0A%20%20%20%20%20%20%20%20alert('Error%20generating%20CSV%3A%20'%20%2B%20error.message)%3B%0A%20%20%20%20%7D%0A%7D)()%3B%0A%0A%2F%2F%20Bookmarklet%20version%20(minified%20for%20URL)%3A%0A%2F%2F%20javascript%3A(function()%7B'use%20strict'%3Bfunction%20escapeCsvValue(value)%7Bif(value%3D%3D%3Dnull%7C%7Cvalue%3D%3D%3Dundefined)%7Breturn''%3B%7Dconst%20stringValue%3DString(value)%3Bif(stringValue.includes('%2C')%7C%7CstringValue.includes('%22')%7C%7CstringValue.includes('%5Cn')%7C%7CstringValue.includes('%5Cr'))%7Breturn'%22'%2BstringValue.replace(%2F%22%2Fg%2C'%22%22')%2B'%22'%3B%7Dreturn%20stringValue%3B%7Dfunction%20getLocalStorageInfo(key)%7Btry%7Bconst%20value%3DlocalStorage.getItem(key)%3Bif(value%3D%3D%3Dnull)%7Breturn%7Bvalue%3A''%2Ctype%3A'null'%2CisJson%3Afalse%7D%3B%7Dtry%7Bconst%20parsed%3DJSON.parse(value)%3Breturn%7Bvalue%3AJSON.stringify(parsed)%2Ctype%3Atypeof%20parsed%2CisJson%3Atrue%2CoriginalValue%3Avalue%7D%3B%7Dcatch(parseError)%7Breturn%7Bvalue%3Avalue%2Ctype%3A'string'%2CisJson%3Afalse%2CoriginalValue%3Avalue%7D%3B%7D%7Dcatch(error)%7Breturn%7Bvalue%3A%60Error%3A%20%24%7Berror.message%7D%60%2Ctype%3A'error'%2CisJson%3Afalse%2CoriginalValue%3A''%7D%3B%7D%7Dfunction%20generateCsv()%7Bconst%20csvRows%3D%5B%5D%3BcsvRows.push('Key%2CValue%2CType%2CIs%20JSON%2COriginal%20Value')%3Bconst%20keys%3DObject.keys(localStorage)%3Bif(keys.length%3D%3D%3D0)%7BcsvRows.push('No%20local%20storage%20data%20found')%3Breturn%20csvRows.join('%5Cn')%3B%7Dkeys.forEach(key%3D%3E%7Bconst%20info%3DgetLocalStorageInfo(key)%3BcsvRows.push(%5BescapeCsvValue(key)%2CescapeCsvValue(info.value)%2CescapeCsvValue(info.type)%2CescapeCsvValue(info.isJson%3F'Yes'%3A'No')%2CescapeCsvValue(info.originalValue)%5D.join('%2C'))%3B%7D)%3Breturn%20csvRows.join('%5Cn')%3B%7Dfunction%20downloadCsv(csvContent%2Cfilename)%7Bconst%20blob%3Dnew%20Blob(%5BcsvContent%5D%2C%7Btype%3A'text%2Fcsv%3Bcharset%3Dutf-8%3B'%7D)%3Bconst%20link%3Ddocument.createElement('a')%3Bif(link.download!%3D%3Dundefined)%7Bconst%20url%3DURL.createObjectURL(blob)%3Blink.setAttribute('href'%2Curl)%3Blink.setAttribute('download'%2Cfilename)%3Blink.style.visibility%3D'hidden'%3Bdocument.body.appendChild(link)%3Blink.click()%3Bdocument.body.removeChild(link)%3B%7Delse%7Balert('Your%20browser%20does%20not%20support%20automatic%20downloads.%20Please%20copy%20the%20CSV%20content%20manually.')%3B%7D%7Dtry%7Bconsole.log('Local%20Storage%20Scanner%20Bookmarklet%3A%20Starting%20scan...')%3Bconst%20csvContent%3DgenerateCsv()%3Bconst%20keysCount%3DObject.keys(localStorage).length%3Bconst%20summary%3D%60Found%20%24%7BkeysCount%7D%20local%20storage%20keys%20on%20this%20page.%5Cn%5CnCSV%20content%20generated%20successfully!%60%3Bconst%20defaultFilename%3D%60local-storage-%24%7Bnew%20Date().toISOString().slice(0%2C10)%7D.csv%60%3Bconst%20filename%3Dprompt(summary%2B'%5Cn%5CnEnter%20filename%20for%20CSV%20download%20(or%20press%20OK%20for%20default)%3A'%2CdefaultFilename)%3Bif(filename!%3D%3Dnull)%7BdownloadCsv(csvContent%2Cfilename)%3Bconsole.log('Local%20Storage%20Scanner%20Bookmarklet%3A%20CSV%20downloaded%20successfully!')%3Balert(%60CSV%20file%20%22%24%7Bfilename%7D%22%20downloaded%20successfully!%5Cn%5CnFound%20%24%7BkeysCount%7D%20local%20storage%20keys.%60)%3B%7Delse%7Bconsole.log('Local%20Storage%20Scanner%20Bookmarklet%3A%20Download%20cancelled%20by%20user.')%3B%7D%7Dcatch(error)%7Bconsole.error('Local%20Storage%20Scanner%20Bookmarklet%20Error%3A'%2Cerror)%3Balert('Error%20generating%20CSV%3A%20'%2Berror.message)%3B%7D%7D)()%3B%0A%7D)()%3B",
    howToBookmarkletGif: "./Assets/bookmarklet-demo.gif", 
    howToInstallUnpackedGif: "./Assets/install-unpacked-demo.gif", 
    howToPackExtensionGif: "./Assets/pack-extension-demo.gif"
};
// ---------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    console.log('[PowerApp Ext-Builder] Initializing application v1.0.0...');

    const wizardContainer = document.getElementById('wizard-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    const GITHUB_REPO_BASE_URL = "./Power Apps Sidebar Integration/";

    const defaultConfig = {
        powerAppUrl: '', extName: '', extDescription: '',
        includeTabUrl: true, includeTabBody: false, includeLocalStorage: false,
        targetIds: [], targetLocalStorageKeys: [],
    };
    let configData = {};
    let currentStep = 0;
    let wizardSteps = [];
    let isBuilt = false;

    // --- STATE MANAGEMENT ---
    const saveState = () => {
        try {
            const state = { configData, currentStep, isBuilt };
            localStorage.setItem('powerAppBuilderState', JSON.stringify(state));
            console.log('[PowerApp Ext-Builder] State saved to localStorage.');
        } catch (e) { console.error('[PowerApp Ext-Builder] Failed to save state:', e); }
    };

    const loadState = () => {
        try {
            const savedState = JSON.parse(localStorage.getItem('powerAppBuilderState'));
            if (savedState) {
                configData = { ...defaultConfig, ...savedState.configData };
                currentStep = savedState.currentStep || 0;
                isBuilt = savedState.isBuilt || false;
                console.log('[PowerApp Ext-Builder] State loaded from localStorage.');
            } else {
                configData = { ...defaultConfig };
                console.log('[PowerApp Ext-Builder] No saved state, using defaults.');
            }
        } catch (e) {
            console.error('[PowerApp Ext-Builder] Failed to load state, resetting:', e);
            configData = { ...defaultConfig }; currentStep = 0; isBuilt = false;
        }
    };
    
    // --- WIZARD LOGIC ---
    const buildWizardSteps = () => {
        console.log('[PowerApp Ext-Builder] Building wizard steps...');
        let steps = [];

        if (!isBuilt) {
            steps = [ renderIntroStep, renderStep1, renderStep2, renderStep3_DataSource ];
            if (configData.includeTabBody) steps.push(renderStep4_FindPageData);
            if (configData.includeLocalStorage) steps.push(renderStep5_FindStorageData);
            // Always include test/preview step so users can test CORS and basic functionality
            steps.push(renderStep6_TestAndSimulate);
            steps.push(renderStep7_Review);
            steps.push(renderStep10_Build);
        } else {
            steps = [ renderStep11_InstallGuide, renderStep12_DistributionGuide ];
        }
        
        wizardSteps = steps;
        console.log(`[PowerApp Ext-Builder] Total steps in current phase: ${wizardSteps.length}`);
    };
    
    const renderCurrentStep = () => {
        if (currentStep < 0 || currentStep >= wizardSteps.length) {
            console.warn(`[PowerApp Ext-Builder] Invalid step index ${currentStep}, resetting to 0.`);
            currentStep = 0;
        }
        console.log(`[PowerApp Ext-Builder] Rendering step ${currentStep + 1}/${wizardSteps.length}`);
        wizardContainer.innerHTML = wizardSteps[currentStep]();
        
        // Handle layout for special steps
        const restartBtn = document.getElementById('restart-wizard-header-btn');
        const header = document.querySelector('header');
        const wizardNav = document.querySelector('.wizard-navigation');
        const container = document.querySelector('.container');
        
        // Check if we're on the Test & Preview step
        const isTestPreviewStep = wizardSteps[currentStep] === renderStep6_TestAndSimulate;
        
        if (restartBtn && header && wizardNav && container) {
            if (!isBuilt && currentStep === 0) {
                // Hide header and navigation on intro (hero)
                restartBtn.style.display = 'none';
                header.style.minHeight = '0';
                header.style.padding = '0';
                wizardNav.style.display = 'none';
                container.style.maxWidth = '1200px';
            } else if (isTestPreviewStep) {
                // Expand container for Test & Preview step
                restartBtn.style.display = 'block';
                header.style.minHeight = '50px';
                header.style.padding = '15px 30px';
                wizardNav.style.display = 'flex';
                container.style.maxWidth = '1200px';
            } else {
                // Standard width for other steps
                restartBtn.style.display = 'block';
                header.style.minHeight = '50px';
                header.style.padding = '15px 30px';
                wizardNav.style.display = 'flex';
                container.style.maxWidth = 'var(--container-width)';
            }
        }
        
        addEventListenersForStep();
        updateNavButtons();
    };

    const saveCurrentStepData = () => {
        const activeStep = wizardContainer.querySelector('.wizard-step');
        if (!activeStep) return;

        const getValue = (id) => document.getElementById(id)?.value.trim();
        const getChecked = (id) => document.getElementById(id)?.checked;
        const getArrayFromText = (id) => getValue(id)?.split(',').map(s => s.trim()).filter(Boolean) || [];

        // This is a robust way to map render functions to save actions
        const saveDataMap = new Map([
            [renderStep1, () => configData.powerAppUrl = getValue('powerAppUrl')],
            [renderStep2, () => {
                configData.extName = getValue('extName');
                configData.extDescription = getValue('extDescription');
            }],
            [renderStep3_DataSource, () => {
                configData.includeTabUrl = getChecked('includeTabUrl');
                configData.includeTabBody = getChecked('includeTabBody');
                configData.includeLocalStorage = getChecked('includeLocalStorage');
            }],
            [renderStep4_FindPageData, () => configData.targetIds = getArrayFromText('targetIds')],
            [renderStep5_FindStorageData, () => configData.targetLocalStorageKeys = getArrayFromText('targetLocalStorageKeys')]
        ]);

        const saveAction = saveDataMap.get(wizardSteps[currentStep]);
        if (saveAction) {
            saveAction();
            console.log(`[PowerApp Ext-Builder] Saved data for step ${currentStep + 1}`);
        }
    };
    
    const renderInstructionalGif = (assetUrl, altText) => `
        <div class="gif-placeholder">
            <img src="${assetUrl}" alt="${altText}" class="instructional-gif" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="gif-missing-text" style="display: none;">
                <span>📹 GIF Demo Placeholder</span>
                <small>Replace with actual demo GIF in Assets folder</small>
            </div>
        </div>`;

    // --- RENDER FUNCTIONS ---
    const renderIntroStep = () => `
        <div class="wizard-step active">
            <div class="hero-section">
                <div class="hero-content">
                    <div class="hero-left">
                        <img src="Assets/magic-wand-wizard-svgrepo-com.svg" alt="Wizard Logo" class="hero-logo">
                        <h1 class="hero-title">Power App Chrome Extension Builder</h1>
                        <p class="hero-subtitle">A step-by-step wizard to package your Power App into a browser extension.</p>
                        <p class="hero-description">Transform your Power App into a powerful browser sidebar extension in minutes.</p>
                        <button id="hero-get-started-btn" class="hero-cta-btn">Get Started →</button>
                    </div>
                    <div class="hero-right">
                        <div class="browser-mockup">
                            <div class="browser-content">
                                <div class="browser-main-area">
                                    <span>🌐 Any Website</span>
                                </div>
                                <div class="browser-sidebar">
                                    <div class="browser-sidebar-toolbar">
                                        <div class="browser-toolbar-left">
                                            <button class="browser-toolbar-button">🔄</button>
                                        </div>
                                        <div class="browser-toolbar-right">
                                            <span class="browser-status-indicator">●</span>
                                        </div>
                                    </div>
                                    <div class="browser-sidebar-content">
                                        <div class="animated-gradient">
                                            <div class="power-app-content">
                                                <div class="power-app-emoji">🤩</div>
                                                <div class="power-app-text">Your Power App Here</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    
    const renderStep1 = () => `
        <div class="wizard-step active">
            <h2>Power App URL</h2>
            <p>Let's start by providing the URL to your published Power App.</p>
            <div class="form-group">
                <label for="powerAppUrl">Power App URL *</label>
                <input type="url" id="powerAppUrl" placeholder="https://apps.powerapps.com/play/..." value="${configData.powerAppUrl}" required>
                <p class="description">The URL where your Power App is published and accessible.</p>
            </div>
        </div>`;
    
    const renderStep2 = () => `
        <div class="wizard-step active">
            <h2>Extension Identity</h2>
            <p>Give your extension a name and description. These will be visible in the browser.</p>
            <div class="form-group">
                <label for="extName">Extension Name *</label>
                <input type="text" id="extName" placeholder="My Power App Extension" value="${configData.extName}" required>
                <p class="description">This will appear as the extension name in Chrome.</p>
            </div>
            <div class="form-group">
                <label for="extDescription">Extension Description</label>
                <textarea id="extDescription" placeholder="A custom extension for my Power App">${configData.extDescription}</textarea>
                <p class="description">A brief description of what your extension does.</p>
            </div>
        </div>`;
    
    const renderStep3_DataSource = () => `
        <div class="wizard-step active">
            <h2>Select Data Sources</h2>
            <p>What data should your extension send to the Power App?</p>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="includeTabUrl" ${configData.includeTabUrl ? 'checked' : ''}>
                    <strong>Current Tab URL</strong> - Send the URL of the active browser tab
                </label>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="includeTabBody" ${configData.includeTabBody ? 'checked' : ''}>
                    <strong>Page Data (HTML Elements)</strong> - Send specific data from the webpage
                </label>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="includeLocalStorage" ${configData.includeLocalStorage ? 'checked' : ''}>
                    <strong>Local Storage</strong> - Send data from the browser's local storage
                </label>
            </div>
        </div>`;
    
    const renderStep5_FindStorageData = () => `
        <div class="wizard-step active">
            <h2>Find Local Storage Data</h2>
            <p>Use our helper tool to find the Local Storage keys you want to send to your app.</p>
            <ol>
                <li>Open your target website in a new tab.</li>
                <li>Drag this bookmarklet to your bookmarks bar: <a href="${INSTRUCTIONAL_ASSETS.storageFinderBookmarklet}" class="bookmarklet-link">Find Storage Data</a></li>
                <li>Click the bookmarklet to see available Local Storage keys.</li>
                <li>Copy the keys you want to use.</li>
            </ol>
            ${renderInstructionalGif(INSTRUCTIONAL_ASSETS.howToBookmarkletGif, 'How-to guide for using a bookmarklet')}
            <div class="form-group">
                <label for="targetLocalStorageKeys">Paste your Local Storage Keys here</label>
                <textarea id="targetLocalStorageKeys" placeholder="user-token, session-id, preference">${configData.targetLocalStorageKeys.join(', ')}</textarea>
                <p class="description">Separate keys with commas.</p>
            </div>
        </div>`;
    
    const renderStep6_TestAndSimulate = () => {
        const hasAnyData = configData.includeTabUrl || configData.includeTabBody || configData.includeLocalStorage;
        return `
        <div class="wizard-step active">
            <div class="test-preview-section">
                <div class="test-preview-content">
                    <div class="test-preview-left">
                        <h2>Test & Preview</h2>
                        <p>Preview your Power App and test if it loads correctly. This helps verify CORS settings and basic functionality.</p>
                        <p class="preview-note"><strong>What you're seeing:</strong> An accurate preview of your extension in Chrome. The toolbar at the top has a refresh button (🔄) and status indicator (●), exactly matching the generated extension's appearance.</p>
                        ${!hasAnyData ? '<p class="preview-info"><em>Note: You haven\'t selected any data sources yet. You can still preview your Power App to ensure it loads properly.</em></p>' : '<p class="preview-info">Test how your Power App will receive data from the extension by entering sample values below.</p>'}
                        
                        <div class="test-inputs">
                            ${configData.includeTabUrl ? `
                                <div class="form-group">
                                    <label for="simTabUrl">Test Tab URL</label>
                                    <input type="text" id="simTabUrl" placeholder="https://example.com/page" value="https://example.com">
                                </div>
                            ` : ''}
                            ${configData.includeTabBody && configData.targetIds.length > 0 ? configData.targetIds.map(id => `
                                <div class="form-group">
                                    <label for="sim_${id}">Test value for "${id}"</label>
                                    <input type="text" id="sim_${id}" placeholder="Sample data for ${id}">
                                </div>
                            `).join('') : ''}
                            ${configData.includeLocalStorage && configData.targetLocalStorageKeys.length > 0 ? configData.targetLocalStorageKeys.map(key => `
                                <div class="form-group">
                                    <label for="simloc_${key}">Test value for "${key}"</label>
                                    <input type="text" id="simloc_${key}" placeholder="Sample data for ${key}">
                                </div>
                            `).join('') : ''}
                        </div>
                    </div>
                    <div class="test-preview-right">
                        <div class="preview-sticky-content">
                            <div class="browser-mockup">
                                <div class="browser-content">
                                    <div class="browser-main-area">
                                        <span>🌐 Active Browser Tab</span>
                                    </div>
                                    <div class="browser-sidebar">
                                        <!-- Match template's exact toolbar structure -->
                                        <div class="browser-sidebar-toolbar">
                                            <div class="browser-toolbar-left">
                                                <button class="browser-toolbar-button" title="Refresh Power App">🔄</button>
                                            </div>
                                            <div class="browser-toolbar-right">
                                                <span class="browser-status-indicator">●</span>
                                            </div>
                                        </div>
                                        <div class="browser-sidebar-content">
                                            <iframe id="previewFrame" src="${configData.powerAppUrl}"></iframe>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ${hasAnyData ? '<button id="simulateBtn" class="action-btn preview-update-btn">Update Preview</button>' : ''}
                        </div>
                    </div>
                </div>
                ${hasAnyData ? `
                <div class="power-fx-section">
                    <h3>Power Fx Snippets</h3>
                    <p>Use these formulas in your Power App to parse the incoming data:</p>
                    <div class="code-snippet-container">
                        <button class="copy-btn" onclick="navigator.clipboard.writeText(this.nextElementSibling.textContent)">Copy</button>
                        <pre>// Get URL parameter (tabURL)
Set(gblTabURL, Param("tabURL"));

// Parse JSON page data (tabBody)
Set(gblTabBody, ParseJSON(Param("tabBody")));

// Parse JSON local storage data (tabLocalStorage)
Set(gblLocalStorage, ParseJSON(Param("tabLocalStorage")));</pre>
                    </div>
                </div>` : ''}
            </div>
        </div>`;
    };
    
    const renderStep7_Review = () => `
        <div class="wizard-step active">
            <h2>Review Your Configuration</h2>
            <p>Please review your settings before building the extension.</p>
            <h3>Extension Details</h3>
            <p><strong>Name:</strong> ${configData.extName || '(Not set)'}</p>
            <p><strong>Description:</strong> ${configData.extDescription || '(Not set)'}</p>
            <p><strong>Power App URL:</strong> ${configData.powerAppUrl || '(Not set)'}</p>
            <h3>Data Sources</h3>
            <ul>
                ${configData.includeTabUrl ? '<li>✓ Current Tab URL</li>' : ''}
                ${configData.includeTabBody ? `<li>✓ Page Data (${configData.targetIds.length} elements)</li>` : ''}
                ${configData.includeLocalStorage ? `<li>✓ Local Storage (${configData.targetLocalStorageKeys.length} keys)</li>` : ''}
                ${!configData.includeTabUrl && !configData.includeTabBody && !configData.includeLocalStorage ? '<li>No data sources selected</li>' : ''}
            </ul>
            <p><em>If anything looks incorrect, use the Previous button to go back and make changes.</em></p>
        </div>`;
    
    const renderStep10_Build = () => `
        <div class="wizard-step active">
            <h2>Build Your Extension</h2>
            <p>You're all set! Click the button below to build and download your extension.</p>
            <p>This will:</p>
            <ul>
                <li>Fetch the necessary template files from GitHub</li>
                <li>Apply your custom configuration</li>
                <li>Generate a complete Chrome Extension</li>
                <li>Download it as a .zip file</li>
            </ul>
            <p><strong>Note:</strong> Make sure you have a stable internet connection.</p>
        </div>`;
    const renderStep4_FindPageData = () => `
        <div class="wizard-step active">
            <h2>Find Page Data</h2>
            <p>Use our helper tool to find the IDs of elements on a webpage to send to your app.</p>
            <ol>
                <li>Open your target website in a new tab.</li>
                <li>Drag this bookmarklet to your bookmarks bar: <a href="${INSTRUCTIONAL_ASSETS.idFinderBookmarklet}" class="bookmarklet-link">Find Page Data</a></li>
                <li>Click the bookmarklet, then click the items on the page you want to capture.</li>
                <li>When finished, copy the IDs from the popup.</li>
            </ol>
            ${renderInstructionalGif(INSTRUCTIONAL_ASSETS.howToBookmarkletGif, 'How-to guide for using a bookmarklet')}
            <div class="form-group">
                <label for="targetIds">Paste your copied Element IDs here</label>
                <textarea id="targetIds" placeholder="customer-name, order-id, status-field">${configData.targetIds.join(', ')}</textarea>
                <p class="description">Separate IDs with commas.</p>
            </div>
        </div>`;
    const renderStep11_InstallGuide = () => `
        <div class="wizard-step active">
            <h2>Install and Test Your Extension</h2>
            <p>Your download should have started. Follow these steps to install and test it in your browser.</p>
            <ol>
                <li>Find the downloaded <code>.zip</code> file and <strong>unzip it</strong> into a new folder.</li>
                <li>Open Chrome and navigate to <code>chrome://extensions</code>.</li>
                <li>In the top-right corner, turn on the <strong>"Developer mode"</strong> toggle.</li>
                <li>Click the <strong>"Load unpacked"</strong> button.</li>
                <li>Select the entire folder you unzipped in step 1.</li>
            </ol>
            ${renderInstructionalGif(INSTRUCTIONAL_ASSETS.howToInstallUnpackedGif, 'GIF guide for installing an unpacked Chrome extension')}
        </div>`;
    const renderStep12_DistributionGuide = () => `
        <div class="wizard-step active">
            <h2>How to Share Your Extension</h2>
            <p>Once you've confirmed your extension works, here's how you can share it with others.</p>
            <div class="distro-tabs">
                <button class="distro-tab-btn active" data-tab="simple">Simple Share</button>
                <button class="distro-tab-btn" data-tab="corporate">Corporate Deployment</button>
                <button class="distro-tab-btn" data-tab="store">Chrome Web Store</button>
            </div>
            <div id="simple" class="distro-tab-content active">
                <h3>Simple Share (Manual Installation)</h3>
                <p><strong>Best for:</strong> Quick sharing with a small group of trusted users.</p>
                <ol>
                    <li>Simply send the <code>.zip</code> file you downloaded to your colleagues.</li>
                    <li>They will need to follow the same installation steps you just completed (unzip and load unpacked).</li>
                    <li><strong>Note:</strong> They will need to keep Developer Mode enabled, and the extension folder must remain on their computer.</li>
                </ol>
                <p><strong>Pros:</strong> Fast, no approval process needed</p>
                <p><strong>Cons:</strong> Requires technical knowledge, shows a warning banner, not ideal for large teams</p>
            </div>
            <div id="corporate" class="distro-tab-content">
                <h3>Deploy within your Organization</h3>
                <p><strong>Best for:</strong> Official, secure deployment to employees without manual steps.</p>
                <p>This method requires your IT department's involvement. Here's what you need to do:</p>
                <ol>
                    <li>On the <code>chrome://extensions</code> page, click the "Pack extension" button.</li>
                    <li>For "Extension root directory", select the unzipped folder of your extension.</li>
                    <li><strong>Leave "Private key file" blank the first time.</strong> Click "Pack extension".</li>
                    <li>This will create a <code>.crx</code> file and a <code>.pem</code> file. <strong>KEEP THE .PEM FILE SAFE!</strong></li>
                    <li>Provide the <code>.crx</code> file to your IT department for deployment via Google Workspace Admin Console.</li>
                </ol>
                ${renderInstructionalGif(INSTRUCTIONAL_ASSETS.howToPackExtensionGif, 'GIF guide for packing a Chrome extension')}
                <p><strong>Pros:</strong> Professional, silent deployment, automatic updates possible</p>
                <p><strong>Cons:</strong> Requires IT involvement and Google Workspace admin access</p>
            </div>
            <div id="store" class="distro-tab-content">
                <h3>Publish to Chrome Web Store</h3>
                <p><strong>Best for:</strong> Public distribution or formal internal app catalog.</p>
                <ol>
                    <li>Create a <a href="https://chrome.google.com/webstore/devconsole" target="_blank">Chrome Web Store Developer account</a> (one-time $5 fee).</li>
                    <li>Prepare assets: 128x128 icon, promotional images, description, screenshots.</li>
                    <li>Upload your extension's folder (unzipped) via the Developer Dashboard.</li>
                    <li>Fill out the listing information and privacy details.</li>
                    <li>Submit for review (can take a few days to several weeks).</li>
                    <li>Once approved, users can install it directly from the Chrome Web Store.</li>
                </ol>
                <p><strong>Pros:</strong> Professional, discoverable, automatic updates, no IT needed</p>
                <p><strong>Cons:</strong> Review process, $5 fee, public or unlisted visibility options only</p>
                <p><a href="https://developer.chrome.com/docs/webstore/publish/" target="_blank">Learn more about publishing to the Chrome Web Store</a></p>
            </div>
        </div>`;

    // --- BUILD LOGIC ---
    const handleBuild = async () => {
        console.log('[PowerApp Ext-Builder] Build process started.');
        nextBtn.disabled = true;
        nextBtn.classList.add('building');
        nextBtn.textContent = 'Building...';

        const filesToFetch = [
            'background.js', 'content-script.js', 'style.css', 'sidebar.html', 'sidebar.js'
        ];
        
        try {
            // Helper function to generate a simple placeholder icon
            const generateIcon = (size) => {
                return new Promise((resolve) => {
                    const canvas = document.createElement('canvas');
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext('2d');
                    
                    // Draw a gradient background using custom palette
                    const gradient = ctx.createLinearGradient(0, 0, size, size);
                    gradient.addColorStop(0, '#182575'); // resolution-blue
                    gradient.addColorStop(1, '#232F9F'); // international-klein-blue
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, size, size);
                    
                    // Draw a white "P" for Power App
                    ctx.fillStyle = 'white';
                    ctx.font = `bold ${size * 0.6}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('P', size / 2, size / 2);
                    
                    canvas.toBlob(resolve, 'image/png');
                });
            };
            
            const filePromises = filesToFetch.map(async (filePath) => {
                const url = GITHUB_REPO_BASE_URL + filePath;
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
                const content = await response.text();
                return { path: filePath, content };
            });

            const manifestPromise = fetch(GITHUB_REPO_BASE_URL + 'manifest.json').then(async res => {
                if (!res.ok) throw new Error(`Failed to fetch manifest.json: ${res.statusText}`);
                return res.json();
            });
            const [manifestTemplate, ...downloadedFiles] = await Promise.all([manifestPromise, ...filePromises]);

            // Generate icon files
            const [icon16, icon48, icon128] = await Promise.all([
                generateIcon(16),
                generateIcon(48),
                generateIcon(128)
            ]);

            const zip = new JSZip();
            
            // Add downloaded files
            downloadedFiles.forEach(file => {
                zip.file(file.path, file.content);
            });
            
            // Add generated icons to icons/ folder
            zip.file('icons/icon16.png', icon16);
            zip.file('icons/icon48.png', icon48);
            zip.file('icons/icon128.png', icon128);

            // Generate config.js matching the template structure
            const configObject = {
                powerAppUrl: configData.powerAppUrl,
                parameters: {
                    includeTabUrl: configData.includeTabUrl,
                    includeTabBody: configData.includeTabBody,
                    targetIds: configData.targetIds,
                    includeLocalStorage: configData.includeLocalStorage,
                    targetLocalStorageKeys: configData.targetLocalStorageKeys
                },
                triggers: {
                    onTabChange: false,
                    onUrlChange: false,
                    onTimer: {
                        enabled: false,
                        interval: 2000
                    }
                },
                floatingButton: {
                    enabled: false,
                    targetUrls: [],
                    position: "top-center",
                    text: "⚡ Open Power App",
                    tooltip: "Open Power Apps Sidebar",
                    color: "#007bff"
                },
                sidebar: {
                    showToolbar: true,
                    persistence: "background"
                },
                manualRefreshButton: {
                    enabled: false,
                    targetUrls: []
                }
            };
            
            const configJsContent = `// [PowerApps Sidebar] Configuration File - Generated by PowerApp Ext-Builder\n\nexport const config = ${JSON.stringify(configObject, null, 2)};\n\nconsole.log('[PowerApps Sidebar] Configuration loaded:', config);`;
            zip.file("config.js", configJsContent);

            manifestTemplate.name = configData.extName || "Power App Extension";
            manifestTemplate.description = configData.extDescription || "A custom Power App extension.";
            zip.file("manifest.json", JSON.stringify(manifestTemplate, null, 2));

            const zipBlob = await zip.generateAsync({ type: "blob" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(zipBlob);
            const safeName = (configData.extName || 'extension').replace(/[^a-z0-9]/gi, '_').toLowerCase();
            link.download = `${safeName}.zip`;
            link.click();
            URL.revokeObjectURL(link.href);
            console.log('[PowerApp Ext-Builder] Build successful, download triggered.');

            isBuilt = true;
            currentStep = 0;
            buildWizardSteps();
            renderCurrentStep();
            saveState();

        } catch (error) {
            console.error('[PowerApp Ext-Builder] Build failed:', error);
            alert(`An error occurred while building the extension: ${error.message}. Please check your internet connection and try again.`);
        } finally {
            nextBtn.disabled = false;
            nextBtn.classList.remove('building');
            updateNavButtons();
        }
    };

    // --- EVENT LISTENERS & INITIALIZATION ---
    const addEventListenersForStep = () => {
        // Handle hero CTA button on intro slide
        const heroCTA = document.getElementById('hero-get-started-btn');
        if (heroCTA) {
            heroCTA.addEventListener('click', () => {
                // Move to next step
                if (currentStep < wizardSteps.length - 1) {
                    saveCurrentStepData();
                    currentStep++;
                    buildWizardSteps();
                    renderCurrentStep();
                    saveState();
                }
            });
        }
        
        // Handle simulation button for Step 6
        const simulateBtn = document.getElementById('simulateBtn');
        if (simulateBtn) {
            simulateBtn.addEventListener('click', () => {
                const previewFrame = document.getElementById('previewFrame');
                let params = new URLSearchParams();
                
                if (configData.includeTabUrl) {
                    const tabUrl = document.getElementById('simTabUrl')?.value || '';
                    params.append('tabURL', tabUrl);
                }
                
                if (configData.includeTabBody) {
                    const data = {};
                    configData.targetIds.forEach(id => {
                        const value = document.getElementById(`sim_${id}`)?.value || '';
                        if (value) data[id] = value;
                    });
                    if (Object.keys(data).length > 0) {
                        params.append('tabBody', JSON.stringify(data));
                    }
                }
                
                if (configData.includeLocalStorage) {
                    const storage = {};
                    configData.targetLocalStorageKeys.forEach(key => {
                        const value = document.getElementById(`simloc_${key}`)?.value || '';
                        if (value) storage[key] = value;
                    });
                    if (Object.keys(storage).length > 0) {
                        params.append('tabLocalStorage', JSON.stringify(storage));
                    }
                }
                
                const newUrl = `${configData.powerAppUrl}${configData.powerAppUrl.includes('?') ? '&' : '?'}${params.toString()}`;
                previewFrame.src = newUrl;
                console.log('[PowerApp Ext-Builder] Preview updated with URL:', newUrl);
            });
        }
        
        // Handle distribution tab switching for Step 12
        const distroTabBtns = document.querySelectorAll('.distro-tab-btn');
        distroTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                // Update active tab button
                distroTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active tab content
                document.querySelectorAll('.distro-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(targetTab)?.classList.add('active');
            });
        });
    };
    
    const updateNavButtons = () => {
        prevBtn.disabled = currentStep === 0;
        
        // Check if we're on the intro step
        const isOnIntroStep = !isBuilt && currentStep === 0;
        
        // Check if we're on the final build step
        const isOnBuildStep = wizardSteps[currentStep] === renderStep10_Build;
        
        if (isOnIntroStep) {
            nextBtn.textContent = 'Get Started →';
            nextBtn.disabled = false;
            nextBtn.style.visibility = 'visible';
        } else if (isOnBuildStep) {
            nextBtn.textContent = 'Build & Download';
            nextBtn.disabled = false;
            nextBtn.style.visibility = 'visible';
        } else if (isBuilt && currentStep === wizardSteps.length - 1) {
            // On the final distribution guide step - hide the Next button
            nextBtn.style.visibility = 'hidden';
        } else {
            nextBtn.textContent = 'Next';
            nextBtn.disabled = false;
            nextBtn.style.visibility = 'visible';
        }
    };
    
    nextBtn.addEventListener('click', () => {
        // Check if we're on the build step
        const isOnBuildStep = wizardSteps[currentStep] === renderStep10_Build;
        
        if (isOnBuildStep) {
            handleBuild();
            return;
        }
        
        saveCurrentStepData();
        
        // Check if we need to rebuild wizard (for conditional steps)
        const needsRebuild = wizardSteps[currentStep] === renderStep3_DataSource;
        
        if (currentStep < wizardSteps.length - 1) {
            currentStep++;
            if (needsRebuild) {
                buildWizardSteps();
            }
            renderCurrentStep();
            saveState();
        }
    });
    
    prevBtn.addEventListener('click', () => {
        saveCurrentStepData();
        
        if (currentStep > 0) {
            currentStep--;
            const needsRebuild = wizardSteps[currentStep] === renderStep3_DataSource;
            if (needsRebuild) {
                buildWizardSteps();
            }
            renderCurrentStep();
            saveState();
        }
    });
    
    // Header restart button (always visible)
    const restartHeaderBtn = document.getElementById('restart-wizard-header-btn');
    if (restartHeaderBtn) {
        restartHeaderBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to start over? This will clear your current configuration.')) {
                localStorage.removeItem('powerAppBuilderState');
                location.reload();
            }
        });
    }
    
    loadState();
    buildWizardSteps();
    renderCurrentStep();
});