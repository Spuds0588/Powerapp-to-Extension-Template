// Content Script for Floating Button Injection
// This runs automatically on pages matching the patterns

console.log('[PowerApps Sidebar] Content script loaded');

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'INJECT_FLOATING_BUTTON') {
    console.log('[PowerApps Sidebar] Received injection request');
    try {
      injectFloatingButton(message.buttonConfig);
      sendResponse({ success: true });
    } catch (error) {
      console.error('[PowerApps Sidebar] Content script injection failed:', error);
      sendResponse({ success: false, error: error.message });
    }
  }
});

// Function to inject floating button into page
function injectFloatingButton(buttonConfig) {
  console.log('[PowerApps Sidebar] Content script: Injecting floating button');
  
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
    console.log('[PowerApps Sidebar] Floating button clicked');
    chrome.runtime.sendMessage({ type: 'OPEN_SIDEBAR' });
    button.style.display = 'none';
  });
  
  // Add to page
  document.body.appendChild(button);
  
  console.log('[PowerApps Sidebar] Content script: Button created and added to DOM');
  console.log('[PowerApps Sidebar] Content script: Button element:', button);
  
  // Verify button is visible
  setTimeout(() => {
    const rect = button.getBoundingClientRect();
    console.log('[PowerApps Sidebar] Content script: Button bounding rect:', rect);
    console.log('[PowerApps Sidebar] Content script: Button visible:', rect.width > 0 && rect.height > 0);
  }, 100);
}
