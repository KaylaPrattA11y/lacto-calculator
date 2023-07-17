class Calculator {
  constructor() {
    this.calculator = document.getElementById("calculator");
    this.brine = document.getElementById("brine");
    this.weight = document.getElementById("weight");
    this.salt = document.getElementById("salt");
    this.category = document.getElementById("category");
    this.valueLabels = document.querySelectorAll("[data-label]");
    this.unitRadios = document.querySelectorAll("input[type=radio][name=unit]");
  }

  init() {
    this.localStorageCheck();
    this.calculate();
    this.updateValueLabels();
    this.addEventListeners();
  }
  
  calculate() {
    this.salt.value = this.formatDecimal(((this.brine.value * this.weight.value) / 100));
    localStorage.setItem("state", JSON.stringify(this.state));
    this.updateValueLabels();
  }

  formatDecimal = (number) => new Intl.NumberFormat("default", { maximumSignificantDigits: 3 }).format(number);

  updateValueLabels() {
    this.valueLabels.forEach(el =>{
      const { label } = el.dataset;

      if (label === "brine") {
        el.innerText = this.formatDecimal(this.state.brine);
      }
      if (label === "weight") {
        el.innerText = this.formatDecimal(this.state.weight);
      }
      if (label === "salt") {
        el.innerText = this.state.salt;
      }
      if (label === "unit") {
        el.innerText = this.state.unit;
      }
    });
    localStorage.setItem("state", JSON.stringify(this.state));
  }

  addEventListeners = () => {
    // update selected unit text
    this.unitRadios.forEach(radio => radio.addEventListener("change", () => this.updateValueLabels()));
    
    // calculate on user input
    [this.brine, this.weight].forEach(input => input.addEventListener("input", () => this.calculate()));
    
    // select all text on user click
    [this.brine, this.weight].forEach(input => input.addEventListener("click", e => e.target.select()));
    
    // update brine percentage when food category is changed
    this.category.addEventListener("change", () => {
      if (this.category.value !== "") {
        this.brine.value = this.category.value;
      }
      this.calculate();
    });
  }

  localStorageCheck = () => {
    if (localStorage.getItem("state")) {
      this.state = JSON.parse(localStorage.getItem("state"));
    } else {
      localStorage.setItem("state", JSON.stringify(this.state));
    }
  }

  get unit() {
    return document.querySelector("[name=unit]:checked").value;
  }

  get state() {
    return {
      brine: this.brine.value,
      weight: this.weight.value,
      salt: this.salt.value,
      category: this.category.value,
      unit: this.unit
    }
  }

  set state(s) {
    const { brine, weight, salt, category, unit} = s;

    this.brine.value = brine;
    this.weight.value = weight;
    this.salt.value = salt;
    this.category.value = category;
    this.category.querySelector(`option[value="${category}"]`).toggleAttribute("selected", true);
    this.calculator.querySelector(`input[name="unit"][value="${unit}"]`).toggleAttribute("checked", true);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const calculator = new Calculator();
  
  calculator.init();
});