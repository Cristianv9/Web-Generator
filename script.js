document.getElementById("load-template").addEventListener("click", function () {
    const dropdown = document.getElementById("template-dropdown");
    const selectedTemplate = dropdown.value;

    if (selectedTemplate) {
        // Set the iframe's source to the selected template
        const iframe = document.getElementById("preview-frame");
        iframe.src = selectedTemplate;
    } else {
        alert("Please select a template!");
    }
});
