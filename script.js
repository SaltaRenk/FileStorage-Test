"use strict";
// Добавляем объявление типов для переменных
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadSelectedFile = exports.showFileContent = exports.uploadFile = exports.submitAndCloseModal = exports.closeModal = exports.openModal = exports.createFolder = exports.handleFileInput = exports.handleFileSelection = exports.changeFolderName = exports.deleteElement = exports.changeFileName = void 0;
var selectedFile;
var choisedFile;
var filesRotate = document.getElementById('filesRotate');
// Добавляем тип HTMLInputElement для fileInput
var fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.txt,.pdf';
fileInput.onchange = function () { return handleFileInput(fileInput.files[0]); };
// Обновляем соответствующие функции с явными типами переменных
function changeFileName() {
    var renamedFolder = document.querySelector(".focused");
    renamedFolder.innerText = prompt('Enter new file name:') || '';
}
exports.changeFileName = changeFileName;
function deleteElement() {
    var subFolderList = document.querySelector(".focused");
    if (subFolderList) {
        subFolderList.remove();
    }
}
exports.deleteElement = deleteElement;
function changeFolderName() {
    var renamedFolder = document.querySelector(".focused");
    renamedFolder.innerText = prompt('Enter new folder name:') || '';
}
exports.changeFolderName = changeFolderName;
function handleFileSelection() {
    fileInput.click();
}
exports.handleFileSelection = handleFileSelection;
function handleFileInput(file) {
    if (file) {
        choisedFile = file;
        openModal();
    }
    else {
        console.log('Файл не выбран для загрузки');
    }
}
exports.handleFileInput = handleFileInput;
filesRotate.addEventListener("contextmenu", function (event) {
    var test = document.querySelector('.focused');
    var test1 = prompt('change');
    test.setAttribute('title', test1);
});
filesRotate.addEventListener("click", function (event) {
    var target = event.target;
    if (target.tagName === "LI") {
        var folders = filesRotate.getElementsByTagName("li");
        for (var i = 0; i < folders.length; i++) {
            folders[i].classList.remove("focused");
            folders[i].style.backgroundColor = "";
        }
        target.classList.add("focused");
        target.style.backgroundColor = "grey";
    }
});
function createFolder() {
    var focusedFolder = filesRotate.querySelector(".focused");
    if (focusedFolder) {
        var subFolderName = prompt('Enter subfolder name:');
        if (subFolderName) {
            var subFolderList = focusedFolder.querySelector('ul');
            if (!subFolderList) {
                subFolderList = document.createElement('ul');
                focusedFolder.appendChild(subFolderList);
            }
            var newSubFolder = document.createElement('li');
            newSubFolder.classList.add('folder');
            newSubFolder.innerText = subFolderName;
            subFolderList.appendChild(newSubFolder);
        }
    }
    else {
        var newFolder = document.createElement("li");
        newFolder.classList.add("root-folder");
        newFolder.textContent = prompt('Enter folder name:');
        ;
        filesRotate.appendChild(newFolder);
    }
}
exports.createFolder = createFolder;
function openModal() {
    var modal = document.getElementById('myModal');
    modal.style.display = 'block';
}
exports.openModal = openModal;
function closeModal() {
    var modal = document.getElementById('myModal');
    modal.style.display = 'none';
}
exports.closeModal = closeModal;
function submitAndCloseModal() {
    uploadFile();
    closeModal();
}
exports.submitAndCloseModal = submitAndCloseModal;
function uploadFile() {
    var fileInput = document.getElementById('fileInput');
    var uploadedFile = choisedFile;
    var fileDescriptionInput = document.getElementById("fileDescriptionInput");
    var fileDescription = fileDescriptionInput.value;
    fetch('/upload', {
        method: 'POST',
        body: uploadedFile
    })
        .then(function (response) {
        var filesRotate = document.getElementById('filesRotate');
        var listItem = document.createElement('li');
        listItem.textContent = uploadedFile.name;
        listItem.onclick = function () {
            selectedFile = uploadedFile;
            showFileContent(uploadedFile);
        };
        listItem.setAttribute('data-description', fileDescription);
        listItem.setAttribute('title', fileDescription);
        var focusedFolder = filesRotate.querySelector(".focused");
        if (focusedFolder) {
            var subfilesRotate = document.querySelector("ul");
            if (subfilesRotate) {
                subfilesRotate = document.createElement("ul");
                focusedFolder.appendChild(subfilesRotate);
            }
            var newSubFile = document.createElement("li");
            newSubFile.textContent = uploadedFile;
            newSubFile.addEventListener("click", function () {
                showFileContent(uploadedFile);
            });
            subfilesRotate.appendChild(listItem);
        }
        else {
            filesRotate.appendChild(listItem);
        }
    })
        .catch(function (error) {
        console.error('Ошибка при загрузке файла:', error);
    });
}
exports.uploadFile = uploadFile;
function showFileContent(file) {
    var reader = new FileReader();
    reader.onload = function (e) {
        var _a;
        var fileContentDiv = document.getElementById('fileContent');
        if (fileContentDiv) {
            fileContentDiv.textContent = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
        }
    };
    reader.readAsText(file);
}
exports.showFileContent = showFileContent;
// Функция для скачивания выбранного файла
function downloadSelectedFile() {
    if (selectedFile) {
        var blob = new Blob([selectedFile], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = document.querySelector(".focused").innerHTML;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    else {
        console.log('Файл не выбран для скачивания');
    }
}
exports.downloadSelectedFile = downloadSelectedFile;
