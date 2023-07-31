class Edit {
  constructor() {
    this.form = document.getElementById("editFermentForm");
    this.fermentName = document.getElementById("editFermentName");
    this.fermentName = document.getElementById("editFermentName");
    this.dateStart = document.getElementById("editDateStart");
    this.dateEnd = document.getElementById("editDateEnd");
    this.notes = document.getElementById("editNotes");
    this.submitButton = this.form.querySelector("button[type='submit']");
  }

  init() {
    this.addEventListeners();
  }

  reset() {
    this.form.reset();
    this.submitButton.toggleAttribute("disabled", true);
  }
  
  updateDateEndMin() {
    // set to one day ahead of Start Date
    const ds = new Date(this.dateStart.value);
    this.dateEnd.setAttribute("min", formatDateForInputField(addOneDay(ds)));
  }

  populateFormFields() {
    const { brine, weight, salt, unit, color, dateStart, dateEnd, fermentName, notes } = MyFerments.getFermentData(this.targetFerment);

    this.form.querySelector("[data-label='brine']").innerText = formatDecimal(brine);
    this.form.querySelector("[data-label='weight']").innerText = formatDecimal(weight);
    this.form.querySelector("[data-label='salt']").innerText = formatDecimal(salt);
    this.form.querySelectorAll("[data-label='unit']").forEach(u => u.innerText = unit);
    this.dateStart.value = dateStart.split("T")[0];
    this.dateEnd.value = dateEnd;
    this.fermentName.value = fermentName;
    this.notes.value = notes;
    document.querySelector(`[name='editColor'][value='${color}']`).checked = true;
  }
  
  addEventListeners = () => {
    this.form.addEventListener("submit", e => this.handleSubmit(e));
    this.form.addEventListener("change", e => this.handleChange(e));
    this.form.addEventListener("input", () => this.handleInput());
    this.form.addEventListener("reset", () => this.reset());
  }

  get formData() {
    return new FormData(this.form);
  }

  get targetFerment() {
    return this.form.dataset.edit;
  }

  animateFermentLi = id => {
    // emphasize newly edited ferment for a bit
    const newlyEditedFerment = document.getElementById(id);

    newlyEditedFerment.scrollIntoView();
    newlyEditedFerment.classList.add("just-edited");
    setTimeout(() => {
      newlyEditedFerment.classList.remove("just-edited");
    }, 1000);
  }

  handleChange = e => {
    if (e.target === this.dateStart) {
      this.updateDateEndMin();
    }
  }

  handleInput = () => {
    this.submitButton.removeAttribute("disabled");
  }

  handleSubmit = e => {
    e.preventDefault();

    let thisFermentObj = {
      color: this.formData.get("editColor") || "transparent",
      dateStart: this.formData.get("editDateStart"),
      dateEnd: this.formData.get("editDateEnd"),
      fermentName: this.formData.get("editFermentName"),
      notes: this.formData.get("editNotes"),
    };
  
    const { brine, salt, unit, weight, time } = MyFerments.getFermentData(this.targetFerment);

    thisFermentObj.brine = brine;
    thisFermentObj.id = this.targetFerment;
    thisFermentObj.salt = salt;
    thisFermentObj.unit = unit;
    thisFermentObj.weight = weight;
    thisFermentObj.time = time;

    localStorage.setItem("saved", JSON.stringify(replaceObjectWithId(myFermentsStorage, this.targetFerment, thisFermentObj)));
    document.dispatchEvent(myFermentsModified);

    MyFerments.build();
    EditFermentDialog.close();
    this.form.reset();
    this.animateFermentLi(thisFermentObj.id);

  }
}

const EditFermentForm = new Edit();

document.addEventListener("DOMContentLoaded", () => {
  EditFermentForm.init();
});
