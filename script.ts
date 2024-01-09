// Добавляем объявление типов для переменных

var selectedFile: any;
var choisedFile: any;
var filesRotate = document.getElementById('filesRotate');
// Добавляем тип HTMLInputElement для fileInput
const fileInput: HTMLInputElement = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.txt,.pdf';
fileInput.onchange = () => handleFileInput(fileInput.files![0]);

// Обновляем соответствующие функции с явными типами переменных
export function changeFileName(): void {
  let renamedFolder: HTMLElement | null = document.querySelector(".focused");
    renamedFolder!.innerText = prompt('Enter new file name:') || '';
}

export function deleteElement(): void {
  let subFolderList: HTMLElement | null = document.querySelector(".focused");
  if (subFolderList) {
    subFolderList.remove();
  }
}

export function changeFolderName() : void{
  let renamedFolder: HTMLElement | null = document.querySelector(".focused");
  renamedFolder!.innerText = prompt('Enter new folder name:') || '';
}

export function handleFileSelection(): void {
  fileInput.click();
}

export function handleFileInput(file: File | undefined): void {
  if (file) {
    choisedFile = file;
    openModal();
  } else {
    console.log('Файл не выбран для загрузки');
  }
}

filesRotate!.addEventListener("contextmenu", function(event){
    let test = document.querySelector('.focused');
    let test1: string = prompt('change')!;
    test!.setAttribute('title', test1);
  });
  
  filesRotate!.addEventListener("click", function(event) {
    const target = event.target as HTMLElement;
    if (target.tagName === "LI") {
      const folders = filesRotate!.getElementsByTagName("li");
      for (let i = 0; i < folders.length; i++) {
        folders[i].classList.remove("focused");
        folders[i].style.backgroundColor = "";
      }
      target.classList.add("focused");
      target.style.backgroundColor = "grey";
    }
  });
  
  export function createFolder() {
    const focusedFolder = filesRotate!.querySelector(".focused");
  
  if (focusedFolder) {
    let subFolderName = prompt('Enter subfolder name:');
    if (subFolderName) {
      let subFolderList = focusedFolder.querySelector('ul');
      if (!subFolderList) {
        subFolderList = document.createElement('ul');
        focusedFolder.appendChild(subFolderList);
      }
      let newSubFolder = document.createElement('li');
      newSubFolder.classList.add('folder');
      newSubFolder.innerText = subFolderName;
      subFolderList.appendChild(newSubFolder);
    }
  } else {
    const newFolder = document.createElement("li");
    newFolder.classList.add("root-folder");
    newFolder.textContent = prompt('Enter folder name:');;
    filesRotate!.appendChild(newFolder);
  }
  }
  
  export function openModal(): void {
    let modal = document.getElementById('myModal');
    modal!.style.display = 'block';
  }
  
  export function closeModal(): void {
    let modal = document.getElementById('myModal');
    modal!.style.display = 'none';
  }
  
  export function submitAndCloseModal() {
    uploadFile();
    closeModal();
  }

  export function uploadFile(): void {
    let fileInput = document.getElementById('fileInput');
    let uploadedFile = choisedFile;
    let fileDescriptionInput = (<HTMLInputElement>document.getElementById("fileDescriptionInput"));
    let fileDescription = fileDescriptionInput!.value;
  
    fetch('/upload', {
      method: 'POST',
      body: uploadedFile
    })
    .then(response => {
      let filesRotate = document.getElementById('filesRotate');
      const listItem = document.createElement('li');
      listItem.textContent = uploadedFile!.name;
      listItem.onclick = () => {
        selectedFile = uploadedFile;
        showFileContent(uploadedFile!);
      };
  
      listItem.setAttribute('data-description', fileDescription);
      listItem.setAttribute('title', fileDescription);
  
      const focusedFolder = filesRotate!.querySelector(".focused");
      if (focusedFolder) {
          let subfilesRotate = document.querySelector("ul");
          if (subfilesRotate) {
            subfilesRotate = document.createElement("ul");
            focusedFolder.appendChild(subfilesRotate);
          }
          let newSubFile = document.createElement("li");
          newSubFile.textContent = uploadedFile;
          newSubFile.addEventListener("click", function() {
            showFileContent(uploadedFile); 
          });
          subfilesRotate!.appendChild(listItem);
        } else {
          filesRotate!.appendChild(listItem);
        }
    })
    .catch(error => {
      console.error('Ошибка при загрузке файла:', error);
    });
  }

  export function showFileContent(file: File): void {
    const reader = new FileReader();
    reader.onload = function(e: ProgressEvent<FileReader>): void {
      const fileContentDiv: HTMLElement | null = document.getElementById('fileContent');
      if (fileContentDiv) {
        fileContentDiv.textContent = e.target?.result as string;
      }
    };
    reader.readAsText(file);
  }
  
  // Функция для скачивания выбранного файла
  export function downloadSelectedFile(): void {
    if (selectedFile) {
      const blob = new Blob([selectedFile], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (document.querySelector(".focused") as HTMLElement).innerHTML;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      console.log('Файл не выбран для скачивания');
    }
  }
  