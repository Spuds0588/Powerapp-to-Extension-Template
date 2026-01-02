# Power App to Browser Extension Template

[Try Build Wizard Here](https://spuds0588.github.io/Powerapp-to-Extension-Template/)

## 1. Overview

This repository provides a production-ready template for embedding a Microsoft Power App into a browser's side panel. It acts as a powerful bridge, allowing you to create a seamless enhancement layer over existing web applications.

The extension dynamically passes context—such as the active tab's URL, specific data from the page's DOM, and local storage items—directly to your Power App as URL parameters. This allows for rich, context-aware interactions and minimizes the need for users to switch between tabs, streamlining their workflows.

This template is built with vanilla HTML, CSS, and JavaScript, ensuring it is lightweight, has no external dependencies, and is easy to customize.

**Project ID:** `spuds0588-powerapp-template-v1.2.0`

---

## 2. Key Features

*   **Direct Power App Integration**: Embeds your Power App in an `iframe` within the browser's side panel (Chrome, Edge, etc.).
*   **Highly Configurable**: All core functionality is controlled via a single, easy-to-understand `config.js` file. No code changes are needed for basic setup.
*   **Contextual Data Passing**: Send critical data to your Power App:
    *   **`tabURL`**: The full URL of the user's active tab.
    *   **`tabBody`**: A JSON object containing values from specific HTML elements on the page (e.g., input fields, text areas).
    *   **`tabLocalStorage`**: A JSON object containing data from specified keys in the browser's local storage.
*   **Flexible Event Triggers**: Choose when the extension sends data to the Power App:
    *   **`onTabChange`**: When the user switches tabs.
    *   **`onUrlChange`**: When the URL of the active tab changes (ideal for Single Page Applications).
    *   **`onTimer`**: On a recurring interval, for continuous polling.
*   **Optional Floating Button**: For a more integrated feel, you can inject a floating button on specific websites that opens the extension's side panel.
*   **Enterprise Ready**: Includes detailed guides for private deployment via the Chrome/Edge web stores and mass deployment using Microsoft Intune.

---

## 3. How It Works

The extension is composed of several key scripts that work together:

1.  **`config.js` (The Control Center)**: This is where you configure everything. You set your Power App URL, which data to capture, and what events should trigger an update.
2.  **`background.js` (The Event Listener)**: This service worker runs in the background, listening for browser events you've enabled in the config (like tab or URL changes). When a trigger event occurs, it notifies the sidebar. It also manages the injection of the floating button.
3.  **`sidebar.js` (The Data Handler)**: This is the brain of the side panel. When it's opened or notified by the background script, it executes scripts in the active tab to scrape the required data (DOM elements, local storage). It then constructs a new URL with this data as parameters and sets it as the source for the Power App `iframe`.
4.  **`content-script.js` (The Injector)**: If the floating button is enabled, this script is injected into the target web pages to create and manage the button.

This decoupled architecture ensures the extension is efficient, only performing data-intensive scraping when absolutely necessary.

---

## 4. Getting Started: 5-Minute Quick Start

Follow these steps to get a basic version of your extension running locally.

### Step 1: Download the Template
Download the code from this repository and unzip it into a folder on your computer.

### Step 2: Configure Your Power App URL
Open the `config.js` file in a text editor. Find the `powerAppUrl` line and replace `"powerapps-URL-Goes-Here"` with the actual URL of your Power App.

```javascript
// [PowerApps Sidebar] Configuration File - v1.2.0

export const config = {
  // REQUIRED: The base URL of your Power App.
  powerAppUrl: "https://apps.powerapps.com/play/e/your-environment-id/a/your-app-id?tenantId=your-tenant-id",
  // ... rest of the config
```

### Step 3: Load the Extension in Your Browser

**For Google Chrome:**
1.  Open Chrome and navigate to `chrome://extensions`.
2.  Enable the **"Developer mode"** toggle in the top-right corner.
3.  Click the **"Load unpacked"** button.
4.  Select the folder where you unzipped the extension files.

**For Microsoft Edge:**
1.  Open Edge and navigate to `edge://extensions`.
2.  Enable the **"Developer mode"** toggle on the bottom-left.
3.  Click the **"Load unpacked"** button.
4.  Select the folder where you unzipped the extension files.

### Step 4: Test It!
The extension icon should now appear in your browser's toolbar. Click it to open the side panel, and you should see your Power App load! By default, it will already be passing the current tab's URL as a parameter.

---

## 5. Detailed Configuration (`config.js`)

This is where you'll customize the extension's behavior. Open `config.js` and modify the following sections as needed.

### `parameters`
Control which data gets sent to your Power App. This is useful for optimizing performance and avoiding overly long URLs.

*   `includeTabUrl`: (Default: `true`) Set to `true` to pass the active tab's URL.
*   `includeTabBody`: (Default: `false`) Set to `true` to scrape data from the web page.
    *   **`targetIds`**: This is a critical array. You must list the HTML `id` attributes of the elements you want to capture. The extension will create a JSON object where the keys are these IDs and the values are the element's content.
*   `includeLocalStorage`: (Default: `false`) Set to `true` to read data from the browser's local storage.
    *   **`targetLocalStorageKeys`**: List the local storage keys you want to capture.

**Example `parameters` configuration:**
```javascript
parameters: {
  includeTabUrl: true,
  includeTabBody: true,
  targetIds: [
    "usernameField", // <input id="usernameField">
    "caseNumber"     // <span id="caseNumber">
  ],
  includeLocalStorage: true,
  targetLocalStorageKeys: [
    "userPreferences",
    "sessionToken"
  ]
},```

### `triggers`
Define which browser events will trigger a data refresh and update the Power App `iframe`.

*   `onTabChange`: (Default: `false`) Updates when the user switches to a different tab.
*   `onUrlChange`: (Default: `false`) Updates when the URL changes within the same tab (e.g., navigating in a single-page app like SharePoint or Salesforce).
*   `onTimer`: (Default: `false`) Updates continuously on a set interval.
    *   **`enabled`**: Set to `true` to enable.
    *   **`interval`**: Time in milliseconds (e.g., `2000` for 2 seconds). Use with caution, as this can be resource-intensive.

### `floatingButton`
Configure a button that appears on specific web pages to launch the sidebar.

*   `enabled`: (Default: `false`) Set to `true` to enable the button.
*   `targetUrls`: An array of URL patterns where the button should appear. Use `*` as a wildcard (e.g., `"https://*.my-app.com/*"`).
*   `position`: Where the button appears on the screen (e.g., `"bottom-right"`).
*   `text`, `tooltip`, `color`: Customize the button's appearance.

---

## 6. Preparing Your Power App to Receive Data

Once the extension is configured, you need to set up your Power App to read the incoming URL parameters. Use the `Param()` function in Power Fx.

Place this code in the **`OnStart`** property of your App or on the **`OnVisible`** property of the relevant screen.

```powerapps-dot
// OnStart of the App or OnVisible of the main screen

// 1. Capture the raw URL parameters
Set(gblRawTabURL, Param("tabURL"));
Set(gblRawTabBody, Param("tabBody"));
Set(gblRawLocalStorage, Param("tabLocalStorage"));

// 2. Process the parameters
// The Tab URL can usually be used directly
If(!IsBlank(gblRawTabURL),
    UpdateContext({ varTabURL: gblRawTabURL })
);

// The tabBody and tabLocalStorage parameters are JSON strings and must be parsed
If(!IsBlank(gblRawTabBody),
    // Use ParseJSON to convert the string into an object
    // Set a global variable or collection with the parsed data
    Set(gblTabBodyObject, ParseJSON(gblRawTabBody))
);

If(!IsBlank(gblRawLocalStorage),
    Set(gblLocalStorageObject, ParseJSON(gblRawLocalStorage))
);
```

**Accessing Parsed Data:**
Once parsed, you can access the data from the `gblTabBodyObject` or `gblLocalStorageObject` variables. For example, to get the value of an element with `id="usernameField"`:

```powerapps-dot
// In a Label's Text property:
Text(gblTabBodyObject.usernameField)

// In a TextInput's Default property:
Text(gblLocalStorageObject.userPreferences.theme) // Accessing a nested value```
```


## 7. Deployment Guide

Once you've tested your extension locally, you can deploy it to your users.

### Step 1: Package Your Extension
Create a `.zip` file containing all the extension files (`manifest.json`, `config.js`, etc.). **Do not** include the parent folder, only the files themselves.

### Step 2: Private Deployment (Chrome Web Store)

This method is best for sharing with a limited group of testers or within your organization if you use Google Workspace.

1.  **Register as a Developer**: Go to the [Chrome Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard) and pay the one-time $5 registration fee.
2.  **Upload Your Extension**: Click "Add new item", upload your `.zip` file, and fill in the required store listing details (name, description, icons).
3.  **Set Visibility**: In the "Visibility" options, choose **"Private"**. This allows you to specify a list of Google Group testers who can install it. Alternatively, choose **"Unlisted"** so anyone with the direct link can install it, but it won't appear in public search results.
4.  **Publish**: Submit the extension for review. The review process is typically faster for private listings.

### Step 3: Private Deployment (Microsoft Edge Add-ons)

This is the preferred method for users in a Microsoft-centric environment.

1.  **Register as a Developer**: Go to the [Microsoft Partner Center](https://partner.microsoft.com/en-us/dashboard/microsoftedge) and register for a developer account.
2.  **Create a New Submission**: Start a new extension submission and upload your `.zip` package.
3.  **Set Visibility**: In the "Visibility" settings, choose **"Hidden"**. This makes the add-on undiscoverable in the store, and only users with a direct link can install it.
4.  **Publish**: Submit for certification. Once approved, you can share the direct store link with your users.

### Step 4: Enterprise Deployment via Microsoft Intune

For corporate environments, Intune is the most robust way to force-install the extension on users' managed browsers.

**Prerequisite**: The extension must first be published to the Chrome or Edge store (a hidden/unlisted link is fine). You will need the **Extension ID** from the store URL.

**To Deploy to Microsoft Edge:**
1.  Navigate to the **Microsoft Intune admin center**.
2.  Go to **Devices -> Configuration Profiles -> Create Profile**.
3.  Select **Platform: `Windows 10 and later`** and **Profile type: `Settings catalog`**.
4.  Give the profile a name (e.g., "Edge - Power App Helper Extension").
5.  In the Settings picker, search for and select **"Microsoft Edge" -> "Extensions"**.
6.  Check the setting **"Control which extensions are installed silently"**.
7.  Close the settings picker. In the configuration pane, **enable** the setting.
8.  Enter the Extension ID from the Microsoft Edge Add-ons store. For example: `abcdefghijklmnopabcdefghijklmnop`.
9.  Assign this profile to the desired user or device groups and complete the wizard.

**To Deploy to Google Chrome:**
1.  The process is nearly identical to Edge. In the Settings picker, search for and select **"Google" -> "Google Chrome" -> "Extensions"**.
2.  Check the setting **"Configure the list of force-installed apps and extensions"**.
3.  Close the settings picker and **enable** the setting.
4.  Enter the Extension ID from the Chrome Web Store followed by the update URL in this format: `yourextensionidhere;https://clients2.google.com/service/update2/crx`.
5.  Assign the profile and save.

The extension will be automatically and silently installed on the users' browsers the next time they sync their policies.

---

## 8. Testing and Debugging

You can debug different parts of the extension using your browser's Developer Tools.

*   **To Debug the Side Panel**: Open the side panel, right-click inside your Power App, and select "Inspect". This will open a dedicated DevTools window for the side panel, where you can view console logs from `sidebar.js`.
*   **To Debug the Background Script**: Go to `chrome://extensions` or `edge://extensions`, find your extension, and click the link to inspect the "Service worker". This is where you'll see logs from `background.js`.
*   **To Debug the Content Script**: Open the Developer Tools (F12) on a webpage where the content script (`content-script.js`) is supposed to run. You'll see its logs in the main console.

The scripts contain detailed console logs prefixed with `[PowerApps Sidebar]` to help you trace the execution flow. When reporting an issue, please include these logs.
