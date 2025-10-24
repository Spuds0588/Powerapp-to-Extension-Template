// [PowerApps Sidebar] Sidebar Script - v1.2.0 (Trigger-based)

import { config } from './config.js';

const powerAppIframe = document.getElementById('powerapp-iframe');
const refreshButton = document.getElementById('refresh-button');
const statusIndicator = document.getElementById('status-indicator');
const sidebarToolbar = document.getElementById('sidebar-toolbar');
let previousData = { tabURL: null, tabBody: null, tabLocalStorage: null };
let refreshTimeout = null;

/**
 * Initializes the sidebar.
 */
function initialize() {
  console.log('[PowerApps Sidebar] Initializing sidebar script.');
  
  // Configure toolbar visibility
  if (!config.sidebar.showToolbar) {
    sidebarToolbar.classList.add('hidden');
  }
  
  // Set up refresh button
  if (refreshButton) {
    refreshButton.addEventListener('click', handleManualRefresh);
  }
  
  // Update status indicator
  updateStatusIndicator('initializing');
  
  if (config.powerAppUrl && config.powerAppUrl.includes('YOUR_APP_ID_HERE')) {
    console.warn('[PowerApps Sidebar] WARNING: Power App URL is not configured. Please update config.js');
    document.body.innerHTML = '<h1>Configuration Needed</h1><p>Please set your Power App URL in <strong>config.js</strong>.</p>';
    updateStatusIndicator('error');
    return;
  }
  
  powerAppIframe.src = config.powerAppUrl;
  updateStatusIndicator('loading');

  // Perform an initial fetch when the sidebar is opened.
  fetchDataAndUpdateUrl();

  // Set up the timer only if it's enabled in the config.
  if (config.triggers.onTimer.enabled) {
    console.log(`[PowerApps Sidebar] Trigger: Timer enabled with interval: ${config.triggers.onTimer.interval}ms`);
    setInterval(fetchDataAndUpdateUrl, config.triggers.onTimer.interval);
  }

  // Notify background script that sidebar is ready
  try {
    chrome.runtime.sendMessage({ type: 'SIDEBAR_READY' });
  } catch (error) {
    console.log('[PowerApps Sidebar] Could not notify background script.');
  }
}

/**
 * Fetches data from the active tab and updates the iframe src.
 */
async function fetchDataAndUpdateUrl() {
  console.log('[PowerApps Sidebar] Starting data fetch and URL update...');
  try {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!activeTab || !activeTab.id || !activeTab.url.startsWith('http')) {
      console.log('[PowerApps Sidebar] No active/valid tab found. Skipping update.');
      return;
    }

    let tabBody = null;
    let tabLocalStorage = null;
    
    // Only scrape page content if tabBody parameter is enabled
    if (config.parameters.includeTabBody) {
      // First inject the target IDs into the page
      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: (targetIds) => {
          window.targetIds = targetIds;
        },
        args: [config.parameters.targetIds]
      });

      // Then scrape the specific IDs
      const injectionResults = await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: scrapePageContent,
      });

      // Gracefully handle cases where the script couldn't be injected
      if (!injectionResults || !injectionResults[0]) {
          console.warn('[PowerApps Sidebar] Could not execute script in active tab. It might be a protected page.');
          return;
      }

      tabBody = injectionResults[0].result;
      console.log(`[PowerApps Sidebar] Scraped ${Object.keys(tabBody).length} target elements.`);
    }
    
    // Only fetch local storage if tabLocalStorage parameter is enabled
    if (config.parameters.includeLocalStorage) {
      // Inject the target local storage keys into the page
      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: (targetKeys) => {
          window.targetLocalStorageKeys = targetKeys;
        },
        args: [config.parameters.targetLocalStorageKeys]
      });

      // Then scrape the specific local storage keys
      const localStorageResults = await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: scrapeLocalStorage,
      });

      // Gracefully handle cases where the script couldn't be injected
      if (!localStorageResults || !localStorageResults[0]) {
          console.warn('[PowerApps Sidebar] Could not execute local storage script in active tab.');
      } else {
        tabLocalStorage = localStorageResults[0].result;
        console.log(`[PowerApps Sidebar] Scraped ${Object.keys(tabLocalStorage).length} local storage keys.`);
      }
    }

    const tabURL = activeTab.url;
    const currentData = { tabURL, tabBody, tabLocalStorage };

    // We still check for changes to avoid redundant reloads if the user
    // quickly toggles between two tabs with the same state.
    const hasChanged = JSON.stringify(previousData) !== JSON.stringify(currentData);

    if (hasChanged) {
      console.log('[PowerApps Sidebar] Data has changed. Updating iframe src.');
      previousData = currentData;
      updateIframeSrc(currentData);
    } else {
      console.log('[PowerApps Sidebar] Data has not changed. Skipping iframe src update.');
    }
  } catch (error) {
    console.error('[PowerApps Sidebar] Error during data fetch:', error.message);
  }
}

/**
 * Constructs a new URL and sets the iframe src.
 */
function updateIframeSrc(data) {
  const baseUrl = config.powerAppUrl.split('?')[0];
  const existingParams = new URL(config.powerAppUrl).searchParams;
  const params = new URLSearchParams();

  for (const [key, value] of existingParams.entries()) {
    params.set(key, value);
  }

  // Only add parameters if they are enabled in config
  if (config.parameters.includeTabUrl) {
    params.set('tabURL', data.tabURL);
    console.log('[PowerApps Sidebar] Adding tabURL parameter');
  }
  
  if (config.parameters.includeTabBody && data.tabBody) {
    params.set('tabBody', JSON.stringify(data.tabBody));
    console.log(`[PowerApps Sidebar] Added tabBody parameter with ${Object.keys(data.tabBody).length} elements`);
  }
  
  if (config.parameters.includeLocalStorage && data.tabLocalStorage) {
    params.set('tabLocalStorage', JSON.stringify(data.tabLocalStorage));
    console.log(`[PowerApps Sidebar] Added tabLocalStorage parameter with ${Object.keys(data.tabLocalStorage).length} keys`);
  }

  const newSrc = `${baseUrl}?${params.toString()}`;
  console.log(`[PowerApps Sidebar] Setting new iframe src with ${params.toString().split('&').length} parameters (${newSrc.length} chars total)`);
  
  // Add error handling for iframe loading
  powerAppIframe.onerror = function() {
    console.error('[PowerApps Sidebar] Failed to load Power App iframe. URL may be too long or invalid.');
    updateStatusIndicator('error');
  };
  
  powerAppIframe.onload = function() {
    console.log('[PowerApps Sidebar] Power App iframe loaded successfully');
    updateStatusIndicator('ready');
  };
  
  powerAppIframe.src = newSrc;
  updateStatusIndicator('updating');
}

/**
 * Updates the status indicator in the toolbar
 */
function updateStatusIndicator(status) {
  if (!statusIndicator) return;
  
  const statusMap = {
    'initializing': { text: '●', color: '#ffc107', title: 'Initializing...' },
    'loading': { text: '●', color: '#17a2b8', title: 'Loading...' },
    'updating': { text: '●', color: '#28a745', title: 'Updating...' },
    'ready': { text: '●', color: '#28a745', title: 'Ready' },
    'error': { text: '●', color: '#dc3545', title: 'Error' }
  };
  
  const statusInfo = statusMap[status] || statusMap['ready'];
  statusIndicator.textContent = statusInfo.text;
  statusIndicator.style.color = statusInfo.color;
  statusIndicator.title = statusInfo.title;
}

/**
 * Handles manual refresh button click
 */
function handleManualRefresh() {
  console.log('[PowerApps Sidebar] Manual refresh triggered');
  
  // Disable button temporarily to prevent spam
  if (refreshButton) {
    refreshButton.disabled = true;
    refreshButton.textContent = '⏳';
    
    // Re-enable after 2 seconds
    refreshTimeout = setTimeout(() => {
      refreshButton.disabled = false;
      refreshButton.textContent = '🔄';
    }, 2000);
  }
  
  // Force refresh
  fetchDataAndUpdateUrl();
}

/**
 * This function is injected into the active tab to scrape its content.
 * Now only scrapes specific IDs defined in config.parameters.targetIds
 */
function scrapePageContent() {
  // Get the target IDs from the global config (passed via chrome.storage or message)
  const targetIds = window.targetIds || [];
  
  if (targetIds.length === 0) {
    console.log('[PowerApps Sidebar] No target IDs specified. Returning empty data.');
    return {};
  }
  
  const data = {};
  let foundCount = 0;
  
  targetIds.forEach(targetId => {
    const element = document.getElementById(targetId);
    if (element) {
      let value;
      if (element.nodeName === 'INPUT') {
        const inputType = element.type.toLowerCase();
        if (inputType === 'checkbox' || inputType === 'radio') {
          value = element.checked ? 'checked' : 'unchecked';
        } else { 
          value = element.value; 
        }
      } else if (['SELECT', 'TEXTAREA'].includes(element.nodeName)) {
        value = element.value;
      } else { 
        value = element.textContent.trim(); 
      }
      data[targetId] = value;
      foundCount++;
    } else {
      console.log(`[PowerApps Sidebar] Target ID '${targetId}' not found on page.`);
    }
  });
  
  console.log(`[PowerApps Sidebar] Found ${foundCount} of ${targetIds.length} target IDs.`);
  return data;
}

/**
 * This function is injected into the active tab to scrape local storage content.
 * Only scrapes specific keys defined in config.parameters.targetLocalStorageKeys
 */
function scrapeLocalStorage() {
  // Get the target local storage keys from the global config
  const targetKeys = window.targetLocalStorageKeys || [];
  
  if (targetKeys.length === 0) {
    console.log('[PowerApps Sidebar] No target local storage keys specified. Returning empty data.');
    return {};
  }
  
  const data = {};
  let foundCount = 0;
  
  targetKeys.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      if (value !== null) {
        // Try to parse as JSON, fallback to string if it fails
        try {
          data[key] = JSON.parse(value);
        } catch (parseError) {
          // If it's not valid JSON, store as string
          data[key] = value;
        }
        foundCount++;
      } else {
        console.log(`[PowerApps Sidebar] Local storage key '${key}' not found.`);
      }
    } catch (error) {
      console.log(`[PowerApps Sidebar] Error accessing local storage key '${key}': ${error.message}`);
    }
  });
  
  console.log(`[PowerApps Sidebar] Found ${foundCount} of ${targetKeys.length} target local storage keys.`);
  return data;
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'TRIGGER_UPDATE') {
        console.log('[PowerApps Sidebar] Received TRIGGER_UPDATE message from background.');
        fetchDataAndUpdateUrl();
    }
});

initialize();