// [PowerApps Sidebar] Background Service Worker - v1.2.0

import { config } from './config.js';

// Track if sidebar is ready to receive messages
let sidebarReady = false;

// Track if sidebar is currently open
let sidebarOpen = false;

// Listen for messages from sidebar
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SIDEBAR_READY') {
    sidebarReady = true;
    sidebarOpen = true;
    console.log('[PowerApps Sidebar] Sidebar is ready to receive messages.');
  } else if (message.type === 'SIDEBAR_CLOSED') {
    sidebarOpen = false;
    console.log('[PowerApps Sidebar] Sidebar closed.');
  }
});

// Open the side panel when the extension icon is clicked.
chrome.action.onClicked.addListener((tab) => {
  console.log('[PowerApps Sidebar] Extension icon clicked. Opening side panel.');
  chrome.sidePanel.open({ tabId: tab.id });
  // Reset sidebar ready state when opening
  sidebarReady = false;
});

// Helper function to check if URL matches patterns
function urlMatchesPatterns(url, patterns) {
  if (!patterns || patterns.length === 0) return false;
  
  return patterns.some(pattern => {
    // Convert wildcard pattern to regex
    const regexPattern = pattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape special regex chars
      .replace(/\\\*/g, '.*'); // Convert wildcards to regex
    const regex = new RegExp('^' + regexPattern + '$');
    return regex.test(url);
  });
}

// Helper function to handle floating button injection with comprehensive error handling
async function handleFloatingButton(tab) {
  if (!config.floatingButton.enabled || !tab.url || !tab.url.startsWith('http')) {
    return;
  }
  
  if (urlMatchesPatterns(tab.url, config.floatingButton.targetUrls)) {
    console.log(`[PowerApps Sidebar] Attempting to inject floating button for URL: ${tab.url}`);
    console.log(`[PowerApps Sidebar] Tab ID: ${tab.id}, Tab status: ${tab.status}`);
    
    // Check if we can inject scripts on this page
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          console.log('[PowerApps Sidebar] Test script executed successfully');
          return { success: true, url: window.location.href };
        }
      });
      console.log('[PowerApps Sidebar] Test injection successful:', results);
    } catch (testError) {
      console.error('[PowerApps Sidebar] Test injection failed:', testError);
      console.error('[PowerApps Sidebar] Error details:', {
        name: testError.name,
        message: testError.message,
        stack: testError.stack
      });
      return; // Don't try to inject if test fails
    }
    
    // Try content script approach first (more reliable)
    try {
      console.log(`[PowerApps Sidebar] Trying content script injection for URL: ${tab.url}`);
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'INJECT_FLOATING_BUTTON',
        buttonConfig: config.floatingButton
      });
      
      if (response && response.success) {
        console.log('[PowerApps Sidebar] Content script injection successful');
        return;
      } else {
        console.log('[PowerApps Sidebar] Content script injection failed:', response);
      }
    } catch (contentScriptError) {
      console.log('[PowerApps Sidebar] Content script not available:', contentScriptError.message);
    }
    
    // Fallback to programmatic injection
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`[PowerApps Sidebar] Programmatic injection attempt ${attempt} for URL: ${tab.url}`);
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: injectFloatingButton,
          args: [config.floatingButton]
        });
        console.log('[PowerApps Sidebar] Programmatic injection successful:', results);
        return; // Success, exit retry loop
      } catch (error) {
        console.error(`[PowerApps Sidebar] Programmatic injection attempt ${attempt} failed:`, error);
        console.error('[PowerApps Sidebar] Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        if (attempt < 3) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, attempt * 500));
        }
      }
    }
    console.error('[PowerApps Sidebar] All injection methods failed for URL:', tab.url);
  }
}

// Function to inject floating button into page
function injectFloatingButton(buttonConfig) {
  // Remove existing floating button if any
  const existingButton = document.getElementById('powerapps-floating-button');
  if (existingButton) {
    existingButton.remove();
  }
  
  // Remove existing styles if any
  const existingStyle = document.getElementById('powerapps-floating-button-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Create floating button
  const button = document.createElement('button');
  button.id = 'powerapps-floating-button';
  button.className = `floating-button position-${buttonConfig.position}`;
  button.textContent = buttonConfig.text;
  button.title = buttonConfig.tooltip;
  
  // Add inline styles as fallback
  button.style.cssText = `
    position: fixed !important;
    z-index: 2147483647 !important;
    background: ${buttonConfig.color || '#007bff'} !important;
    color: white !important;
    border: 2px solid red !important;
    border-radius: 25px !important;
    padding: 12px 20px !important;
    cursor: pointer !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    opacity: 1 !important;
    display: block !important;
    visibility: visible !important;
    pointer-events: auto !important;
  `;
  
  // Set position based on config
  const positionMap = {
    'top-left': { top: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
    'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)' },
    'bottom-center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)' }
  };
  
  const position = positionMap[buttonConfig.position] || positionMap['bottom-center'];
  Object.assign(button.style, position);
  
  // Add click handler
  button.addEventListener('click', () => {
    // Send message to background script to open sidebar
    chrome.runtime.sendMessage({ type: 'OPEN_SIDEBAR' });
    button.classList.add('hidden');
  });
  
  // Listen for sidebar close events
  const checkSidebarClosed = () => {
    // Check if sidebar is still open by trying to communicate with it
    chrome.runtime.sendMessage({ type: 'CHECK_SIDEBAR_STATUS' }, (response) => {
      if (response && !response.sidebarOpen) {
        button.classList.remove('hidden');
      }
    });
  };
  
  // Check every 2 seconds if sidebar is closed
  const sidebarCheckInterval = setInterval(checkSidebarClosed, 2000);
  
  // Clean up interval when button is removed
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const removedNodes = Array.from(mutation.removedNodes);
        if (removedNodes.includes(button)) {
          clearInterval(sidebarCheckInterval);
          observer.disconnect();
        }
      }
    });
  });
  observer.observe(document.body, { childList: true });
  
  // Add styles with improved design and animations
  const style = document.createElement('style');
  style.id = 'powerapps-floating-button-styles';
  style.textContent = `
    .floating-button {
      position: fixed !important;
      z-index: 2147483647 !important; /* Maximum z-index value */
      background: ${buttonConfig.color || '#007bff'} !important;
      color: white !important;
      border: none !important;
      border-radius: 25px !important;
      padding: 12px 20px !important;
      cursor: pointer !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      opacity: 1 !important; /* Start visible for debugging */
      transform: translateY(0) !important; /* Start in final position */
      white-space: nowrap !important;
      min-width: auto !important;
      height: auto !important;
      display: block !important;
      visibility: visible !important;
      pointer-events: auto !important;
      /* Add a temporary border for debugging */
      border: 2px solid red !important;
    }
    .floating-button:hover {
      background: ${adjustColorBrightness(buttonConfig.color || '#007bff', -20)} !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
    }
    .floating-button.hidden {
      opacity: 0 !important;
      transform: translateY(20px) !important;
      pointer-events: none !important;
    }
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .position-top-left { top: 20px !important; left: 20px !important; }
    .position-top-right { top: 20px !important; right: 20px !important; }
    .position-bottom-left { bottom: 20px !important; left: 20px !important; }
    .position-bottom-right { bottom: 20px !important; right: 20px !important; }
    .position-top-center { top: 20px !important; left: 50% !important; transform: translateX(-50%) !important; }
    .position-bottom-center { bottom: 20px !important; left: 50% !important; transform: translateX(-50%) !important; }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(button);
  
  // Debug: Log button creation and verify it's in the DOM
  console.log('[PowerApps Sidebar] Button created and added to DOM');
  console.log('[PowerApps Sidebar] Button element:', button);
  console.log('[PowerApps Sidebar] Button computed style:', window.getComputedStyle(button));
  console.log('[PowerApps Sidebar] Button position:', {
    top: button.style.top,
    bottom: button.style.bottom,
    left: button.style.left,
    right: button.style.right,
    position: button.style.position,
    zIndex: button.style.zIndex
  });
  
  // Verify button is visible
  setTimeout(() => {
    const rect = button.getBoundingClientRect();
    console.log('[PowerApps Sidebar] Button bounding rect:', rect);
    console.log('[PowerApps Sidebar] Button visible:', rect.width > 0 && rect.height > 0);
  }, 100);
}

// Helper function to adjust color brightness
function adjustColorBrightness(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

// Listen for messages from floating button
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_SIDEBAR') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.sidePanel.open({ tabId: tabs[0].id });
        sidebarReady = false;
      }
    });
  } else if (message.type === 'CHECK_SIDEBAR_STATUS') {
    sendResponse({ sidebarOpen: sidebarOpen });
  }
});

// Listener for when the user switches to a different tab
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  
  // Handle floating button injection
  await handleFloatingButton(tab);
  
  // Handle trigger updates
  if (config.triggers.onTabChange && sidebarReady) {
    console.log('[PowerApps Sidebar] Trigger: Active tab switched. Notifying sidebar.');
    try {
      await chrome.runtime.sendMessage({ type: 'TRIGGER_UPDATE' });
    } catch (error) {
      console.log('[PowerApps Sidebar] Sidebar not ready for messages yet.');
      sidebarReady = false;
    }
  }
});

// Listener for when a tab is updated (e.g., URL change)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // We only care about URL changes for the active tab.
  if (changeInfo.url && tab.active) {
    // Handle floating button injection for URL changes
    await handleFloatingButton(tab);
    
    // Handle trigger updates
    if (config.triggers.onUrlChange && sidebarReady) {
      console.log('[PowerApps Sidebar] Trigger: Active tab URL changed. Notifying sidebar.');
      try {
        await chrome.runtime.sendMessage({ type: 'TRIGGER_UPDATE' });
      } catch (error) {
        console.log('[PowerApps Sidebar] Sidebar not ready for messages yet.');
        sidebarReady = false;
      }
    }
  }
});

console.log('[PowerApps Sidebar] Background service worker started. Awaiting triggers.');