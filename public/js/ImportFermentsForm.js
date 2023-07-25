class ImportFermentsForm {
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
    this.submitButton.toggleAttribute("disabled", true);
    this.fileList.innerHTML = "";
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
      this.fileList.innerHTML = "";
      if (isIterable(parsedOutput)) {
        [...parsedOutput].forEach(o => {
          const li = document.createElement("li");
          const { brine, dateStart, fermentName, notes, salt, unit, weight } = o;
          
          if (!brine || !dateStart || !salt || !unit || !weight) {
            this.activateErrorState(true);
          } else {
            li.innerText = `Ferment Name: ${fermentName || "untitled"}, Date Started: ${formatDate(dateStart)}, Brine: ${formatDecimal(brine)}%, Weight: ${formatDecimal(weight)} ${unit}, Salt: ${formatDecimal(salt)} ${unit}, Notes: ${notes || ""}`;
            this.fileList.appendChild(li);
            this.activateErrorState(false);
          }
        });
      } else {
        this.activateErrorState(true);
      }

    }
  }

  submitFile = async () => {
    const [file] = this.fileInput.files;

    if (file) {
      const fileText = await file.text();
      const parsedOutput = JSON.parse(fileText);
      
      localStorage.setItem("saved", JSON.stringify(parsedOutput));
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
    location.reload();
  }
}

const importFermentsForm = new ImportFermentsForm();

document.addEventListener("DOMContentLoaded", () => {
  importFermentsForm.init();
});
