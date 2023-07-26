class Edit {
  constructor() {
    this.form = document.getElementById("editFermentForm");
  }

  init() {
    this.addEventListeners();
  }

  reset() {
    this.form.reset();
  }
  
  addEventListeners = () => {
    this.form.addEventListener("submit", e => this.handleSubmit(e));
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
    document.dispatchEvent(myFermentsModified);

    MyFerments.build();
    EditFermentDialog.close();
    this.form.reset();

  }
}

const EditFermentForm = new Edit();

document.addEventListener("DOMContentLoaded", () => {
  EditFermentForm.init();
});
