class FermentsFilter {
  constructor() {
    this.group = document.getElementById("myFermentsFilter");
    this.buttons = this.group.querySelectorAll("[data-value]");
    this.noFermentsAvailable = document.getElementById("noFermentsAvailable");
  }

  init() {
    this.update();
    this.addEventListeners();
  }
  
  update() {
    this.updateLengthTexts();
    this.updateNoFermentsAvailableText();
  }

  updateLengthTexts = () => {
    this.buttons.forEach(button => {
      if (button.dataset.value === "0") {
        button.setAttribute("data-length", MyFerments.all.length);
      }
      if (button.dataset.value === "1") {
        button.setAttribute("data-length", MyFerments.current.length);
      }
      if (button.dataset.value === "2") {
        button.setAttribute("data-length", MyFerments.completed.length);
      }
    });
  }

  addEventListeners = () => {
    this.buttons.forEach(button => {
      button.addEventListener("click", e => this.select(e.target.dataset.value));
      button.addEventListener("keydown", e => this.handleNavigation(e));
    });
  };

  select(value) {
    this.reset();
    this.group.querySelector(`[data-value="${value}"]`).setAttribute("aria-checked", "true");
    this.group.querySelector(`[data-value="${value}"]`).setAttribute("tabindex", "0");
    this.updateVisibility(value);
    this.updateNoFermentsAvailableText(value);
  }

  reset() {
    this.buttons.forEach(button => {
      button.setAttribute("aria-checked", "false");
      button.setAttribute("tabindex", "-1");
    });
  }

  updateVisibility(value) {
    if (value === "0") {
      MyFerments.all.forEach(f => f.removeAttribute("hidden"));
    }
    if (value === "1") {
      MyFerments.all.forEach(f => {
        const isInProgress = f.dataset.complete === "false";

        f.toggleAttribute("hidden", !isInProgress);
      });
    }
    if (value === "2") {
      MyFerments.all.forEach(f => {
        const isComplete = f.dataset.complete === "true";

        f.toggleAttribute("hidden", !isComplete);
      });
    }
  }

  updateNoFermentsAvailableText(value) {
    this.noFermentsAvailable.toggleAttribute("hidden", !this.allFermentsHidden);
    if (value === "0") {
      this.noFermentsAvailable.innerText = "No ferments available.";
    }
    if (value === "1") {
      this.noFermentsAvailable.innerText = "No ferments in progress.";
    }
    if (value === "2") {
      this.noFermentsAvailable.innerText = "No ferments completed.";
    }
  }

  handleNavigation = e => {
    const l = e.code === "ArrowLeft";
    const r = e.code === "ArrowRight";
    if (!l && !r) return;

    const p = e.target.previousElementSibling;
    const n = e.target.nextElementSibling;

    if (l && p && p.matches("[data-value]")) {
      this.select(p.dataset.value);
      p.focus();
    }
    if (r && n && n.matches("[data-value]")) {
      this.select(n.dataset.value);
      n.focus();
    }
  }

  get allFermentsHidden() {
    return [...MyFerments.all].every(f => f.hasAttribute("hidden"));
  }

}

const Filter = new FermentsFilter();

document.addEventListener("DOMContentLoaded", () => {
  Filter.init();
});