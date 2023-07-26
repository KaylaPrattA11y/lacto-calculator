class Import {
  constructor() {
    this.form = document.getElementById("importFermentsForm");
    this.fileInput = this.form.querySelector("[type='file']");
    this.submitButton = this.form.querySelector("[type='submit']");
    this.fileList = document.getElementById("fileList");
    this.yourFileText = document.getElementById("yourFileText");
    this.errorMessage = document.getElementById("errorMessage");
  }

  init() {
    this.setAttributes();
    this.addEventListeners();
  }

  setAttributes = () => {
    this.errorMessage.toggleAttribute("hidden", true);
    this.yourFileText.toggleAttribute("hidden", true);
    this.fileList.toggleAttribute("hidden", true);
    this.submitButton.toggleAttribute("disabled", true);
    this.fileList.innerHTML = "";
    this.fileList.dataset.length = "0";
  }

  addEventListeners = () => {
    this.form.addEventListener("submit", e => this.handleSubmit(e));
    this.form.addEventListener("change", () => this.handleChange());
    this.form.addEventListener("reset", () => this.handleReset());
  }

  checkFile = async () => {
    const [file] = this.fileInput.files;

    if (file) {
      const fileText = await file.text();
      const parsedOutput = JSON.parse(fileText);

      this.yourFileText.removeAttribute("hidden");
      this.fileList.toggleAttribute("hidden", false);
      this.fileList.innerHTML = "";
      if (isIterable(parsedOutput)) {
        // reverse the array so the newest created ferment is first in the list
        const toReversed = parsedOutput.toReversed();

        this.fileList.dataset.length = parsedOutput.length;
        [...toReversed].forEach((o) => this.buildPreview(o));
      } else {
        this.activateErrorState(true);
        this.fileList.dataset.length = "0";
      }

    }
  }

  buildPreview = item => {
    const { id, brine, dateStart, fermentName, notes, salt, unit, weight } = item;
          
    if (!id || !brine || !dateStart || !salt || !unit || !weight) {
      this.activateErrorState(true);
      this.fileList.dataset.length = "0";
    } else {
      const li = document.createElement("li");

      li.className = "ferment-import";
      li.innerHTML = `
        <div class="ferment-key">ID:</div> <div class="ferment-value">${id}</div>
        ${fermentName ? "<div class='ferment-key'>Name: </div>" + "<div class='ferment-value'>"+fermentName+"</div>" : ""} 
        <div class="ferment-key">Started:</div> <div class="ferment-value">${formatDate(dateStart)}</div>
        <div class="ferment-key">Brine:</div> <div class="ferment-value">${formatDecimal(brine)}%</div> 
        <div class="ferment-key">Weight:</div> <div class="ferment-value">${formatDecimal(weight)} ${unit}</div> 
        <div class="ferment-key">Salt:</div> <div class="ferment-value">${formatDecimal(salt)} ${unit}</div> 
        ${notes ? "<div class='ferment-key'>Notes:</div>" + "<div class='ferment-value'>"+notes+"</div>" : ""}
      `;
      this.fileList.appendChild(li);
      this.activateErrorState(false);
    }
  }

  submitFile = async () => {
    const [file] = this.fileInput.files;

    if (file) {
      const fileText = await file.text();
      const parsedOutput = JSON.parse(fileText);
      
      localStorage.setItem("saved", JSON.stringify(parsedOutput));
      document.dispatchEvent(myFermentsModified);
      MyFerments.build();
    }
  }

  activateErrorState = hasError => {
    this.errorMessage.toggleAttribute("hidden", !hasError);
    this.yourFileText.toggleAttribute("hidden", hasError);
    this.submitButton.toggleAttribute("disabled", hasError);
  }

  handleReset = () => {
    this.setAttributes();
  }

  handleChange = () => {
    this.checkFile();
    this.submitButton.toggleAttribute("disabled", false);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.submitFile();
  }
}

const ImportFermentsForm = new Import();

document.addEventListener("DOMContentLoaded", () => {
  ImportFermentsForm.init();
});
