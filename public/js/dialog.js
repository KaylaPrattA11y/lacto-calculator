const hideBodyScrollbar = isOpen => {
  if (isStandalone()) return;
  if (isOpen) {
    document.body.style.overflowY = "auto";
    document.body.style.paddingInlineEnd = "0";
  } else {
    document.body.style.overflowY = "hidden";
    document.body.style.paddingInlineEnd = "16px";
  }
}

const closeAllDialogs = () => document.querySelectorAll("dialog[open]")?.forEach(dialog => dialog.close());

const handleToggleDialog = e => {
  const dialog = document.getElementById(e.target.getAttribute("aria-controls"));
  const isOpen = dialog.hasAttribute("open");

  hideBodyScrollbar(isOpen);
  if (isOpen) {
    dialog.close();
    // adjust window history
    if (isStandalone()) {
      window.history.back();
    }
  } else {
    closeAllDialogs();
    dialog.showModal();
    dialog.dispatchEvent(new CustomEvent("showModal"));

    // Add to history state
    if (isStandalone()) {
      window.history.pushState({ isPopup: true }, 'Dialog');
    }

  }
}

class Dialog {
  constructor(id) {
    this.id = id;
    this.dialog = document.getElementById(id);
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners = () => {
    this.dialog.addEventListener("close", () => this.handleClose());
    this.dialog.addEventListener("showModal", () => this.handleOpen());
  }

  handleOpen = () => {
    if (this.id === "myFermentsDialog") {
      // refresh the list every time it is opened
      ferments.build(myFermentsStorage);
    }
    if (this.id === "saveFermentDialog") {
      // disallow end date to be newer than start date
      const date = new Date();
      const todaysdatePlusOne = addOneDay(date).toISOString().split('T')[0];

      dateEndEl.setAttribute("min", todaysdatePlusOne);
    }
  }

  handleClose = () => {
    hideBodyScrollbar(!this.isOpen);
  }

  get isOpen() {
    return this.dialog.hasAttribute("open");
  }
}
