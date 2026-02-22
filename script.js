document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const downloadBtn = document.getElementById('download-btn');
    const adSection = document.getElementById('ad-section');
    const uploadContainer = document.getElementById('upload-container');

    // File Validation Elements
    const fileUpload = document.getElementById('file-upload');
    const errorMessage = document.getElementById('error-message');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');

    // Processing Elements
    const processBtn = document.getElementById('process-btn');
    const processingStatus = document.getElementById('processing-status');
    const timerElement = document.getElementById('timer');
    const formatContainer = document.getElementById('format-container');
    const formatSelect = document.getElementById('format-select');

    console.log("UI Loading...");

    // FLOW 1: Initial Website Load
    window.addEventListener('load', () => {
        console.log("UI Loaded Completely.");

        setTimeout(() => {
            // Hide Download Button and Advertisement Section
            if (downloadBtn) downloadBtn.classList.add('hidden');
            if (adSection) adSection.classList.add('hidden');

            // Display Upload Box
            if (uploadContainer) uploadContainer.classList.remove('hidden');

            console.log("Transition Complete. System ready.");
        }, 1500);
    });

    // FLOW 2: File Selection & Validation
    let uploadedImageFile = null;

    if (fileUpload) {
        fileUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];

            if (!file) return;

            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                // Invalid
                errorMessage.textContent = "Only image files are allowed";
                errorMessage.classList.remove('hidden');
                previewContainer.classList.add('hidden');
                processBtn.classList.add('hidden');
                if (formatContainer) formatContainer.classList.add('hidden');

                fileUpload.value = '';
                uploadedImageFile = null;
            } else {
                // Valid
                errorMessage.classList.add('hidden');

                // Generate preview
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImage.src = e.target.result;
                    previewContainer.classList.remove('hidden');
                    uploadedImageFile = file;
                    console.log("Image loaded.");

                    // Show Process Button
                    processBtn.classList.remove('hidden');
                    // Hide format container until processed (optional, based on flow)
                    if (formatContainer) formatContainer.classList.add('hidden');
                };
                reader.readAsDataURL(file);

                // Ensure download button is disabled (if visible)
                downloadBtn.disabled = true;
            }
        });
    }

    // FLOW 3: Processing Timer
    if (processBtn) {
        processBtn.addEventListener('click', () => {
            // UI Updates for Processing Start
            processBtn.classList.add('hidden');

            processingStatus.classList.remove('hidden');

            // Show Ad Section and Download Button (Disabled)
            adSection.classList.remove('hidden');
            downloadBtn.classList.remove('hidden');
            downloadBtn.disabled = true;
            downloadBtn.textContent = "Download Locked";

            // Timer Logic
            let timeLeft = 10;
            timerElement.textContent = `${timeLeft}s`;

            const timerInterval = setInterval(() => {
                timeLeft--;
                timerElement.textContent = `${timeLeft}s`;

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    finishProcessing();
                }
            }, 1000);
        });
    }

    function finishProcessing() {
        // Hide Processing Status
        processingStatus.classList.add('hidden');

        // Show Format Selection
        if (formatContainer) formatContainer.classList.remove('hidden');

        // Unlock Download Button
        downloadBtn.disabled = false;
        downloadBtn.textContent = "Download Now";

        console.log("Processing complete. Download unlocked.");
    }

    // FLOW 4: Download & Conversion
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (downloadBtn.disabled || !uploadedImageFile) return;

            console.log("Starting conversion...");
            const format = formatSelect ? formatSelect.value : 'image/png';

            // Create a canvas to draw the image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            // Create URL for the file to load into Image object
            const url = URL.createObjectURL(uploadedImageFile);

            img.onload = () => {
                // Set canvas dimensions to match image
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw image
                ctx.drawImage(img, 0, 0);

                // Convert to selected format
                // toDataURL returns a base64 encoded string
                const dataURL = canvas.toDataURL(format);

                // Determine extension
                let ext = 'png';
                if (format === 'image/jpeg') ext = 'jpg';
                if (format === 'image/webp') ext = 'webp';

                // Trigger Download
                const link = document.createElement('a');
                link.href = dataURL;
                link.download = `converted-image.${ext}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Cleanup
                URL.revokeObjectURL(url);
                console.log(`Download triggered for ${format}`);
            };

            img.src = url;
        });
    }
});
