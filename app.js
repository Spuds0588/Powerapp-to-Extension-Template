// [PowerApp Ext-Builder] app.js - v1.0.0 (Final Build)

// --- CONTENT MANAGEMENT FOR PRODUCT MANAGER ---
// This section contains placeholder content.
// Please provide the final URLs and bookmarklet code.
const INSTRUCTIONAL_ASSETS = {
    idFinderBookmarklet: "javascript:alert('ID Finder Bookmarklet - Coming Soon!')",
    storageFinderBookmarklet: "javascript:alert('Storage Finder Bookmarklet - Coming Soon!')",
    howToBookmarkletGif: "https://i.imgur.com/h3i6aHq.gif", // Placeholder GIF
    howToInstallUnpackedGif: "https://i.imgur.com/dfj2k2A.gif", // Placeholder GIF
    howToPackExtensionGif: "https://i.imgur.com/caY922E.gif" // Placeholder GIF
};
// ---------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    console.log('[PowerApp Ext-Builder] Initializing application v1.0.0...');

    const wizardContainer = document.getElementById('wizard-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    const GITHUB_REPO_BASE_URL = "https://raw.githubusercontent.com/Spuds0588/Powerapp-to-Extension-Template/main/src/";

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
            steps = [ renderStep1, renderStep2, renderStep3_DataSource ];
            if (configData.includeTabBody) steps.push(renderStep4_FindPageData);
            if (configData.includeLocalStorage) steps.push(renderStep5_FindStorageData);
            if (configData.includeTabUrl || configData.includeTabBody || configData.includeLocalStorage) {
                steps.push(renderStep6_TestAndSimulate);
            }
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
    
    const renderInstructionalGif = (assetUrl, altText) => `<img src="${assetUrl}" alt="${altText}" class="instructional-gif">`;

    // --- RENDER FUNCTIONS (omitting unchanged ones for brevity) ---
    const renderStep1 = () => `...`; // Unchanged
    const renderStep2 = () => `...`; // Unchanged
    const renderStep3_DataSource = () => `...`; // Unchanged
    const renderStep5_FindStorageData = () => `...`; // Unchanged
    const renderStep6_TestAndSimulate = () => `...`; // Unchanged
    const renderStep7_Review = () => `...`; // Unchanged
    const renderStep10_Build = () => `...`; // Unchanged
    const renderStep4_FindPageData = () => `
        <div class="wizard-step active">
            <h2>Step 4: Find Page Data</h2>
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
            <h2>Step 11: Install and Test Your Extension</h2>
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
            <h2>Step 12: How to Share Your Extension</h2>
            <p>Once you've confirmed your extension works, here’s how you can share it with others.</p>
            <div class="distro-tabs">
                <button class="distro-tab-btn active" data-tab="simple">Simple Share</button>
                <button class="distro-tab-btn" data-tab="corporate">Corporate Deployment</button>
                <button class="distro-tab-btn" data-tab="store">Chrome Web Store</button>
            </div>
            <div id="simple" class="distro-tab-content active">...</div>
            <div id="corporate" class="distro-tab-content">
                 <h3>Deploy within your Organization</h3>
                <p><strong>Best for:</strong> Official, secure deployment to employees without manual steps.</p>
                <p>This method requires your IT department's involvement. Here's what you need to do:</p>
                <ol>
                    <li>On the <code>chrome://extensions</code> page, click the "Pack extension" button.</li>
                    <li>For "Extension root directory", select the unzipped folder of your extension.</li>
                    <li><strong>Leave "Private key file" blank the first time.</strong> Click "Pack extension".</li>
                    <li>This will create a <code>.crx</code> file and a <code>.pem</code> file. <strong>KEEP THE .PEM FILE SAFE!</strong></li>
                    <li>Provide the <code>.crx</code> file to your IT department for deployment.</li>
                </ol>
                ${renderInstructionalGif(INSTRUCTIONAL_ASSETS.howToPackExtensionGif, 'GIF guide for packing a Chrome extension')}
            </div>
            <div id="store" class="distro-tab-content">...</div>
        </div>`;

    // --- BUILD LOGIC ---
    const handleBuild = async () => {
        console.log('[PowerApp Ext-Builder] Build process started.');
        nextBtn.disabled = true;
        nextBtn.classList.add('building');
        nextBtn.textContent = 'Building...';

        const filesToFetch = [
            'background.js', 'content.js', 'sidebar.css', 'sidebar.html', 'sidebar.js',
            'icons/icon16.png', 'icons/icon48.png', 'icons/icon128.png'
        ];
        
        try {
            const filePromises = filesToFetch.map(async (filePath) => {
                const url = GITHUB_REPO_BASE_URL + filePath;
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
                const isBinary = filePath.endsWith('.png');
                const content = isBinary ? await response.blob() : await response.text();
                return { path: filePath, content };
            });

            const manifestPromise = fetch(GITHUB_REPO_BASE_URL + 'manifest.json').then(res => res.json());
            const [manifestTemplate, ...downloadedFiles] = await Promise.all([manifestPromise, ...filePromises]);

            const zip = new JSZip();
            downloadedFiles.forEach(file => zip.file(file.path, file.content));

            const configJsContent = `// [PowerApps Sidebar] Config - Generated by PowerApp Ext-Builder\n\nexport const config = ${JSON.stringify(configData, null, 2)};`;
            zip.file("js/config.js", configJsContent); // Placing in a js folder as per template structure

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
    // Unchanged from previous version
    // ...
    
    loadState();
    buildWizardSteps();
    renderCurrentStep();
});