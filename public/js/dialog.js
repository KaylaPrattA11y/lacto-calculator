document.addEventListener("DOMContentLoaded", () => {
  const dialogButtons = document.querySelectorAll("button[aria-haspopup='dialog']");
  const dialogs = document.querySelectorAll("dialog");

  const hideBodyScrollbar = isOpen => {
    if (isOpen) {
      document.body.style.overflowY = "auto";
      document.body.style.paddingInlineEnd = "0";
    } else {
      document.body.style.overflowY = "hidden";
      document.body.style.paddingInlineEnd = "16px";
    }
  }

  dialogButtons.forEach(button => button.addEventListener("click", e => {
    const dialog = document.getElementById(`${e.target.getAttribute("aria-controls")}`);
    const isOpen = dialog.hasAttribute("open");

    hideBodyScrollbar(isOpen);
    if (isOpen) {
      dialog.close();
    } else {
      dialog.showModal();
    }
  }));

  dialogs.forEach(dialog => dialog.addEventListener("cancel", () => {
    const isOpen = dialog.hasAttribute("open");
    
    hideBodyScrollbar(isOpen);
  }));
});