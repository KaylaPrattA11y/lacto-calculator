class Edit {
  constructor() {
    this.form = document.getElementById("editFermentForm");
    this.dateStart = document.getElementById("editDateStart");
    this.dateEnd = document.getElementById("editDateEnd");
  }

  init() {
    this.addEventListeners();
  }

  reset() {
    this.form.reset();
  }
  
  addEventListeners = () => {
    this.form.addEventListener("submit", e => this.handleSubmit(e));
    this.form.addEventListener("change", e => this.handleChange(e));
  }

  updateDateEndMin() {
    this.dateEnd.setAttribute("min", this.dateStartValue);
  }

  get dateStartValue() {
    return this.dateStart.value;
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

  handleSubmit = e => {
    e.preventDefault();

    let thisFermentObj = {
      color: this.formData.get("editColor") || "transparent",
      dateStart: this.formData.get("editDateStart"),
      dateEnd: this.formData.get("editDateEnd"),
      fermentName: this.formData.get("editFermentName"),
      notes: this.formData.get("editNotes"),
    };
  
    const { brine, salt, unit, weight, time } = getObjectWithId(myFermentsStorage, this.targetFerment);

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
