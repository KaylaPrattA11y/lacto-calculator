class Save {
  constructor() {
    this.form = document.getElementById("saveFermentForm");
    this.dateStart = document.getElementById("dateStart");
    this.dateEnd = document.getElementById("dateEnd");
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

  updateDateStartValue() {
    this.dateStart.value = new Date().toISOString().split("T")[0];
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
  get todaysDate() {
    return new Date();
  }

  animateFermentLi = id => {
    // emphasize newly added ferment for a bit
    const newlyAddedFerment = document.getElementById(id);

    newlyAddedFerment.scrollIntoView();
    newlyAddedFerment.classList.add("just-added");
    setTimeout(() => {
      newlyAddedFerment.classList.remove("just-added");
    }, 500);
  }

  handleChange = e => {
    if (e.target === this.dateStart) {
      this.updateDateEndMin();
    }
  }

  handleSubmit = e => {
    e.preventDefault();

    // get the time the ferment is submitted
    const h = String(new Date().getHours());
    const m = String(new Date().getMinutes());
    const s = String(new Date().getSeconds());
    const hours = h.padStart(2, "0");
    const minutes = m.padStart(2, "0");
    const seconds = s.padStart(2, "0");
    const time = `T${hours}:${minutes}:${seconds}`;

    let thisFermentObj = {
      color: this.formData.get("color") || "transparent",
      dateTimeStart: this.formData.get("dateStart") + time,
      dateStart: this.formData.get("dateStart"),
      dateEnd: this.formData.get("dateEnd"),
      fermentName: this.formData.get("fermentName"),
      notes: this.formData.get("notes"),
    };
    
    const randomNumber = Math.floor(Math.random() * 9000 + 1000);
    const state = JSON.parse(localStorage.getItem("state"));
    const { brine, salt, unit, weight } = state;
    
    thisFermentObj.brine = brine;
    thisFermentObj.id = `ferment${randomNumber}${parseInt(brine, 10) + parseInt(weight, 10) + parseInt(salt, 10)}`;
    thisFermentObj.salt = salt;
    thisFermentObj.unit = unit;
    thisFermentObj.weight = weight;
    thisFermentObj.time = time;

    myFermentsStorage.push(thisFermentObj);
    localStorage.setItem("saved", JSON.stringify(myFermentsStorage));
    document.dispatchEvent(myFermentsModified);

    MyFerments.build();
    SaveFermentDialog.close();
    MyFermentsDialog.showModal();
    this.form.reset();
    this.animateFermentLi(thisFermentObj.id);
    
  }
  
}

const SaveFermentForm = new Save();

document.addEventListener("DOMContentLoaded", () => {
  SaveFermentForm.init();
});

