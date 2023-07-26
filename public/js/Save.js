class Save {
  constructor() {
    this.form = document.getElementById("saveFermentForm");
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

  handleSubmit = e => {
    e.preventDefault();

    let thisFermentObj = {
      color: this.formData.get("color") || "transparent",
      dateEnd: this.formData.get("dateEnd"),
      fermentName: this.formData.get("fermentName"),
      notes: this.formData.get("notes"),
    };
    
    const dateStart = new Date();
    const randomNumber = Math.floor(Math.random() * 9000 + 1000);
    const state = JSON.parse(localStorage.getItem("state"));
    const { brine, salt, unit, weight } = state;

    thisFermentObj.brine = brine;
    thisFermentObj.dateStart = dateStart;
    thisFermentObj.id = `ferment${randomNumber}${parseInt(brine, 10) + parseInt(weight, 10) + parseInt(salt, 10)}`;
    thisFermentObj.salt = salt;
    thisFermentObj.unit = unit;
    thisFermentObj.weight = weight;

    myFermentsStorage.push(thisFermentObj);
    localStorage.setItem("saved", JSON.stringify(myFermentsStorage));

    MyFerments.build();
    SaveFermentDialog.close();
    MyFermentsDialog.showModal();
    this.form.reset();

  }
  
}

const SaveFermentForm = new Save();

document.addEventListener("DOMContentLoaded", () => {
  SaveFermentForm.init();
});
