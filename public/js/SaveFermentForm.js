class SaveFermentForm {
  constructor() {
    this.form = document.getElementById("saveFermentForm");
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners = () => {
    this.form.addEventListener("submit", e => this.handleSubmit(e));
  }

  get formData() {
    return new FormData(this.form);
  }

  get isEditing() {
    return this.form.hasAttribute("data-edit");
  }

  get targetFerment() {
    return this.form.dataset.edit;
  }

  handleSubmit = e => {
    e.preventDefault();

    let thisFermentObj = {
      color: this.formData.get("color") || "transparent",
      dateEnd: this.formData.get("dateEnd"),
      fermentName: this.formData.get("fermentName"),
      notes: this.formData.get("notes"),
    };
  
    if (this.isEditing) {
      const { brine, dateStart, salt, unit, weight } = getObjectWithId(myFermentsStorage, this.targetFerment);
  
      thisFermentObj.brine = formatDecimal(brine);
      thisFermentObj.dateStart = dateStart;
      thisFermentObj.id = this.targetFerment;
      thisFermentObj.salt = formatDecimal(salt);
      thisFermentObj.unit = unit;
      thisFermentObj.weight = formatDecimal(weight);
  
      localStorage.setItem("saved", JSON.stringify(replaceObjectWithId(myFermentsStorage, this.targetFerment, thisFermentObj)));
  
    } else {
      const dateStart = new Date();
      const randomNumber = Math.floor(Math.random() * 9000 + 1000);
      const state = JSON.parse(localStorage.getItem("state"));
      const { brine, salt, unit, weight } = state;
  
      thisFermentObj.brine = formatDecimal(brine);
      thisFermentObj.dateStart = dateStart;
      thisFermentObj.id = `ferment${randomNumber}${parseInt(brine, 10) + parseInt(weight, 10) + parseInt(salt, 10)}`;
      thisFermentObj.salt = formatDecimal(salt);
      thisFermentObj.unit = unit;
      thisFermentObj.weight = formatDecimal(weight);
  
      myFermentsStorage.push(thisFermentObj);
      localStorage.setItem("saved", JSON.stringify(myFermentsStorage));
    }
  
    let params = new URLSearchParams(location.search);
    params.set('showModal', 'myFermentsDialog');
    window.location.search = params.toString();
  }
}
