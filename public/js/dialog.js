class Dialog {
  constructor(id) {
    this.id = id;
    this.dialog = document.getElementById(id);
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners = () => {
    this.toggleButtons.forEach(button => button.addEventListener("click", () => this.handleToggleDialog()));
    this.dialog.addEventListener("close", () => this.handleClose());
  }

  handleToggleDialog = () => {
    const showModal = new CustomEvent("showModal");

    this.hideBodyScrollbar(this.isOpen);
    if (this.isOpen) {
      this.dialog.close();
      // adjust window history
      if (isStandalone()) {
        window.history.back();
      }
    } else {
      this.dialog.dispatchEvent(showModal);
      this.dialog.showModal();

      // disallow end date to be newer than start date
      if (this.id === "saveFermentDialog") {
        const date = new Date();
        const todaysdate = addOneDay(date).toISOString().split('T')[0];

        dateEndEl.setAttribute("min", todaysdate);
      }

      // Add to history state
      if (isStandalone()) {
        window.history.pushState({ isPopup: true }, 'Dialog');
      }
    }
  }

  handleClose = () => {
    if (this.id === "myFermentsDialog") {
      // if has URL params, clear them
      let params = new URLSearchParams(location.search);
      if (params.get("showModal")) {
        document.getElementById(params.get("showModal")).showModal();
        params.delete("showModal");
        window.location.search = params.toString();
      } else {
        window.location.reload();
      }
    } else {
      this.hideBodyScrollbar(!this.isOpen);
      saveFermentDialog.querySelector("h2").innerText = "Save this ferment";
      saveFermentForm.toggleAttribute("data-edit", false);
    }
  }

  hideBodyScrollbar = () => {
    if (isStandalone()) return;
    if (this.isOpen) {
      document.body.style.overflowY = "auto";
      document.body.style.paddingInlineEnd = "0";
    } else {
      document.body.style.overflowY = "hidden";
      document.body.style.paddingInlineEnd = "16px";
    }
  }

  get toggleButtons() {
    return document.querySelectorAll(`button[aria-haspopup="dialog"][aria-controls="${this.id}"]`);
  }

  get isOpen() {
    return this.dialog.hasAttribute("open");
  }
}
