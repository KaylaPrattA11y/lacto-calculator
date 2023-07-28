const hideBodyScrollbar = doHide => {
  if (isStandalone()) return;
  if (doHide) {
    document.body.style.overflowY = "hidden";
    document.body.style.paddingInlineEnd = "16px";
  } else {
    document.body.style.overflowY = "auto";
    document.body.style.paddingInlineEnd = "0";
  }
}

const closeAllDialogs = () => document.querySelectorAll("dialog[open]")?.forEach(dialog => dialog.close());

const handleToggleDialog = e => {
  const dialog = document.getElementById(e.target.getAttribute("aria-controls"));
  const isOpen = dialog.hasAttribute("open");

  hideBodyScrollbar(!isOpen);
  if (isOpen) {
    dialog.close();
  } else {
    closeAllDialogs();
    dialog.showModal();
    dialog.dispatchEvent(new CustomEvent("showModal"));
  }
}

class Dialog {
  constructor(id) {
    this.id = id;
    this.dialog = document.getElementById(id);
    this.hasAForm = this.dialog.querySelectorAll("form").length > 0;
  }

  init() {
    this.addEventListeners();
  }

  close() {
    this.dialog.close();
  }

  showModal() {
    this.dialog.showModal();
    hideBodyScrollbar(true);
  }

  addEventListeners = () => {
    this.dialog.addEventListener("close", () => this.handleClose());
    this.dialog.addEventListener("cancel", () => this.handleCancel());
    this.dialog.addEventListener("showModal", () => this.handleOpen());
  }

  handleOpen = () => {
    if (this.id === "myFermentsDialog") {
      // refresh the list every time it is opened
      MyFerments.build();
    }
    if (this.id === "saveFermentDialog") {
      SaveFermentForm.updateDateStartValue();
      SaveFermentForm.updateDateEndMin();
    }
    if (this.id === "editFermentDialog") {
      EditFermentForm.updateDateEndMin();
    }
  }

  handleClose = () => {
    if (this.id === "myFermentsDialog") {
      fermentsMenu.openMenu(false);
    }
    if (
      this.id === "importFermentsDialog" || 
      this.id === "editFermentDialog" || 
      this.id === "confirmDeleteAllDialog") {
      MyFermentsDialog.showModal();
    }
    if (this.hasAForm) {
      this.forms.forEach(f => f.reset());
    }
  }

  handleCancel = () => {
    hideBodyScrollbar(false);
  }

  get forms() {
    return this.dialog.querySelectorAll("form");
  }

  get isOpen() {
    return this.dialog.hasAttribute("open");
  }
}

const ConfirmDeleteAllDialog = new Dialog("confirmDeleteAllDialog");
const SaveFermentDialog = new Dialog("saveFermentDialog");
const EditFermentDialog = new Dialog("editFermentDialog");
const ImportFermentsDialog = new Dialog("importFermentsDialog");
const MyFermentsDialog = new Dialog("myFermentsDialog");

document.addEventListener("DOMContentLoaded", () => {
  ConfirmDeleteAllDialog.init();
  SaveFermentDialog.init();
  EditFermentDialog.init();
  ImportFermentsDialog.init();
  MyFermentsDialog.init();
});

document.addEventListener("click", e => {
  if (e.target.matches("button[aria-haspopup='dialog']")) {
    handleToggleDialog(e);
  }
});