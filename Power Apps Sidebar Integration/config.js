// [PowerApps Sidebar] Configuration File - v1.2.0

export const config = {
  // REQUIRED: The base URL of your Power App.
  powerAppUrl: "https://apps.powerapps.com/play/e/default-89d3503d-9ffc-4fc1-ac69-f1be7c70d8cd/a/4ef44cfa-83ae-4361-800b-23c3e64b0c4d?tenantId=89d3503d-9ffc-4fc1-ac69-f1be7c70d8cd&hint=b02e73d3-ef9b-45d4-a94d-af3c4930e49f&sourcetime=1760235721579",  
  // --- PARAMETER CONFIGURATION ---
  // Control which parameters are passed to the Power App to prevent overload
  parameters: {
    // Pass the active tab's URL as 'tabURL' parameter
    includeTabUrl: true,
    
    // Pass the JSON object of element IDs and values as 'tabBody' parameter
    includeTabBody: true,
    
    // Specific IDs to track and include in tabBody (instead of all IDs)
    // Add the IDs you want to monitor here
    targetIds: [
      // Example IDs - replace with your actual IDs:
      // "username",
      // "password", 
      // "submit-button",
      // "form-field-1"
      "loanStageTitle",
      "loan-number"
    ],
    
    // Pass local storage data as 'tabLocalStorage' parameter
    includeLocalStorage: true,
    
    // Specific local storage keys to track and include in tabLocalStorage
    // Add the keys you want to monitor here
    targetLocalStorageKeys: [
      // Example keys - replace with your actual keys:
      // "userPreferences",
      // "sessionData",
      // "formState",
      // "appSettings"
      "activeUserId"
    ]
  },

  // --- TRIGGER CONFIGURATION ---
  // The extension will update the Power App when these events occur.
  // Set the desired triggers to 'true' to enable them.
  triggers: {
    // Update when the user switches to a different tab.
    onTabChange: true,

    // Update when the URL of the current tab changes (e.g., in a Single Page App).
    onUrlChange: true,

    // Continuously update the current tab on a timer.
    // Optional: Enable for automatic updates every 1-2 seconds
    onTimer: {
      enabled: false,
      // Interval in milliseconds. Recommended: 2000 (2 seconds) for frequent updates.
      interval: 2000
    }
  },

  // --- FLOATING BUTTON CONFIGURATION ---
  // Adds a floating button overlay to specified pages
  floatingButton: {
    // Enable floating button overlay
    enabled: true,
    
    // Array of URL patterns where floating button should appear
    targetUrls: [
      // Example URLs - replace with your actual URLs:
      // "https://myapp.com/*",
      // "https://*.company.com/*"
      "https://*"
    ],
    
    // Position of the floating button
    // Options: "top-left", "top-right", "bottom-left", "bottom-right", "top-center", "bottom-center"
    position: "top-center",
    
    // Button text/icon (emoji or text)
    text: "⚡Open Test",
    
    // Button tooltip text
    tooltip: "Open Power Apps Sidebar",
    
    // Button color (hex color code)
    color: "#007bff"
  },

  // --- SIDEBAR CONFIGURATION ---
  sidebar: {
    // Show toolbar with refresh button and status
    showToolbar: true,
    
    // Sidebar persistence behavior
    // "background": Keep running when sidebar is closed
    // "shutdown": Fully shut down when sidebar is closed
    persistence: "background"
  },

  // (Future Feature) Configuration for the manual refresh button.
  manualRefreshButton: {
      enabled: true,
      // The button will only be injected on pages matching these patterns.
      // Example: ["https://github.com/*", "https://*.atlassian.net/*"]
      targetUrls: ['https://umortgage.myarive.com/*']
  }
};

console.log('[PowerApps Sidebar] Configuration loaded:', config);