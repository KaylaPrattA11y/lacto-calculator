class FermentsMenu {
  constructor() {
    this.menu = document.getElementById("fermentsMenuContainer");
    this.button = this.menu.querySelector("[aria-haspopup='menu']");
    this.confirmDeleteAllButton = document.getElementById("confirmDeleteAll");
    this.confirmImportButton = document.getElementById("confirmImport");
    this.exportButton = this.menu.querySelector("[data-menuitem='1']");
    this.importButton = this.menu.querySelector("[data-menuitem='2']");
  }

  init() {
    this.addEventListeners();
    this.updateExportButtonAttrs();
  } 
  
  addEventListeners = () => {
    this.menuButtons.forEach(button => button.addEventListener("click", () => this.toggleOptionsMenu()));
    this.confirmDeleteAllButton.addEventListener("click", () => ferments.deleteAllFerments());
  }
  
  updateExportButtonAttrs = () => {
    this.exportButton.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(myFermentsStorage)));
    this.exportButton.setAttribute("download", `Ferments ${new Date()}.json`);
  }

  openMenu(doOpen) {
    this.button.setAttribute("aria-expanded", doOpen);
  }

  toggleOptionsMenu() {
    this.button.setAttribute("aria-expanded", !this.isOpen);
  }

  get isOpen() {
    return this.button.getAttribute("aria-expanded") === "true";
  }

  get menuButtons() {
    return this.menu.querySelectorAll("button");
  }
}

const fermentsMenu = new FermentsMenu();

document.addEventListener("DOMContentLoaded", () => {
  fermentsMenu.init();
});

document.addEventListener("click", e => {
  if (!e.target.matches("#fermentMenu") && !e.target.matches("#fermentMenuButton")) {
    fermentsMenu.openMenu(false);
  }
});