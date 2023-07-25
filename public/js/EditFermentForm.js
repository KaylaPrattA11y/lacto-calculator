class EditFermentForm {
  constructor() {
    this.form = document.getElementById("editFermentForm");
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners = () => {
    this.form.addEventListener("submit", e => this.handleSubmit(e));
  }

  reset() {
    this.form.reset();
  }

  get formData() {
    return new FormData(this.form);
  }

  get targetFerment() {
    return this.form.dataset.edit;
  }

  handleSubmit = e => {
    e.preventDefault();

    let thisFermentObj = {
      color: this.formData.get("editColor") || "transparent",
      dateEnd: this.formData.get("editDateEnd"),
      fermentName: this.formData.get("editFermentName"),
      notes: this.formData.get("editNotes"),
    };
  
    const { brine, dateStart, salt, unit, weight } = getObjectWithId(myFermentsStorage, this.targetFerment);

    thisFermentObj.brine = brine;
    thisFermentObj.dateStart = dateStart;
    thisFermentObj.id = this.targetFerment;
    thisFermentObj.salt = salt;
    thisFermentObj.unit = unit;
    thisFermentObj.weight = weight;

    localStorage.setItem("saved", JSON.stringify(replaceObjectWithId(myFermentsStorage, this.targetFerment, thisFermentObj)));

    ferments.build(myFermentsStorage);
    editFermentDialog.close();
    this.form.reset();

  }
}

const editFermentForm = new EditFermentForm();

document.addEventListener("DOMContentLoaded", () => {
  editFermentForm.init();
});
