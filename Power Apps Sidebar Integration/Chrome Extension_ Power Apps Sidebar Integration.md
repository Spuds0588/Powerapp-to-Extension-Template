# Chrome Extension: Power Apps Sidebar Integration

## Overview
This Chrome extension embeds a **Power App** within the browser's sidebar, dynamically passing **the active tab's URL and parsed page content** as URL parameters to the Power App iframe. The solution minimizes context switching while providing a seamless **enhancement layer** for browser-based workflows.

## Goals
1. **Embed** a Power App via an **iframe** within Chrome's sidebar.
2. **Pass the active tab's URL (`tabURL`)** dynamically.
3. **Extract structured data from the active tab (`tabBody`)**, converting elements **with IDs** into a **key-value JSON object**.
4. **Ensure dynamic updates** without triggering Power App reloads.
5. **Use only vanilla HTML5, CSS, and JavaScript**—no external libraries.
6. **Minimize permissions and maintain lightweight functionality**.

---

## Functional Requirements

### 1. Power App Embedding
- The extension sidebar **contains an iframe** that loads the Power App.
- The **base URL of the Power App is clearly defined in the script** for customization.

### 2. Active Tab URL Handling (`tabURL`)
- The **entire active tab's URL** is captured and passed dynamically.
- The Power App developer is responsible for parsing and utilizing it.

### 3. Active Tab Body Parsing (`tabBody`)
- Only **elements with IDs** are included.
- The JSON structure follows a **key-value pair format**:  
  ```json
  { "elementID1": "value1", "elementID2": "checked", "elementID3": "unchecked" }
  ```
- **Checkboxes and radio buttons** store `"checked"` or `"unchecked"` values.
- No sanitization is performed—values are preserved **exactly** as retrieved.

### 4. Dynamic Parameter Updates
- `tabURL` and `tabBody` **update dynamically** every **1-2 seconds**.
- Updates occur **without triggering an iframe reload**.

### 5. Sidebar Persistence & Behavior
- The sidebar **persists across tabs**.
- A configurable variable determines whether the Power App iframe:
  - **Remains running in the background** (hidden when closed).
  - **Fully shuts down** when the user closes the sidebar.

### 6. Permissions & Security
- Uses **minimal permissions** (`activeTab`, `tabs`).
- No unnecessary access to all URLs or broader system features.

### 7. Extension Activation Behavior
- **Manual activation** required.
- Once activated, the extension **remains open across sessions**.

### 8. Performance Optimization
- Stores the **previous tabBody and tabURL** in **local/session storage**.
- Only **rewrites parameters** when a meaningful change is detected.

---

## Implementation Details

### Technologies Used
- **HTML5** for the UI structure.
- **CSS** for basic styling.
- **JavaScript** for handling tab interactions, JSON formatting, and iframe updates.

### Core Script Outline
1. **Detect active tab changes**.
2. **Extract the full tab URL**.
3. **Parse the document body**:
   - Iterate over all elements with IDs.
   - Capture values of form elements and static text.
   - Structure results into a **flat JSON object**.
4. **Store previous values in session/local storage**.
5. **Update iframe parameters only if values have changed**.

### Expected Directory Structure
```
/powerapps-sidebar-extension
│── manifest.json
│── background.js
│── sidebar.html
│── sidebar.js
│── style.css
│── README.md
```

### Example URL Parameters Passed to Power Apps
```
https://powerapps.microsoft.com/my-app?tabURL=https://example.com&tabBody={"inputField1":"hello","checkbox1":"checked"}
```

### Future Extension Plans
- Build a **web app** that **automatically generates** Chrome extension ZIPs based on user-defined Power App URLs.
- Explore enhancements for **structured data extraction** beyond element IDs.

---

## Conclusion
This PRD outlines a lightweight, **vanilla JavaScript-powered** Chrome extension that serves as an **open-source template** for embedding Power Apps into browser workflows. Organizations can **customize parameters and behavior** as needed while maintaining full control over their implementation.
