function uploadFile() {
    var fileInput = document.getElementById('fileInput');
    var fileList = document.getElementById('fileList');

    var files = fileInput.files;
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var row = fileList.insertRow();
        var filenameCell = row.insertCell(0);
        var sizeCell = row.insertCell(1);
        var shareCell = row.insertCell(2); // Add a new cell for the share button

        filenameCell.textContent = file.name;
        sizeCell.textContent = formatFileSize(file.size);

        // Create a share button
        var shareButton = document.createElement('button');
        shareButton.textContent = 'Share';
        shareButton.onclick = function(file) {
            return function() {
                uploadFileToService(file);
            };
        }(file);
        shareCell.appendChild(shareButton);
    }
}

function formatFileSize(bytes) {
    if (bytes == 0) return '0 Bytes';
    var k = 1024,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function uploadFileToService(file) {
    var formData = new FormData();
    formData.append('file', file);

    fetch('http://file.io/?expires=1d', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Display the shareable link
        if (data.success) {
            alert('Shareable link for ' + file.name + ': ' + data.link);
        } else {
            alert('Error uploading file: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error uploading file:', error);
        alert('Error uploading file. Please try again later.');
    });
}
