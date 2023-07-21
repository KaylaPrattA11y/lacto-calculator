// Constants
const dialogs = document.querySelectorAll("dialog");
const deleteFermentButtons = document.querySelectorAll("button[data-delete]");
const saveFermentForm = document.getElementById("saveFermentForm");
const saveFermentButton = document.getElementById("saveFermentButton");
const saveFermentDialog = document.getElementById("saveFermentDialog");
const myFermentsDialog = document.getElementById("myFermentsDialog");
const fermentNameEl = document.getElementById("fermentName");
const dateEndEl = document.getElementById("dateEnd");
const notesEl = document.getElementById("notes");
const myFermentsList = document.getElementById("myFermentsList");
const myFermentsFilter = document.getElementById("myFermentsFilter");
const myFermentsStorage = JSON.parse(localStorage.getItem("saved")) || [];

// PWA
const isStandalone = () =>  window.matchMedia('(display-mode: standalone)').matches || document.referrer.includes('android-app://');

// URL params
const checkUrlParams = () => {
  // check for URL params that open a modal
  let params = new URLSearchParams(location.search);
  if (params.get("showModal")) {
    document.getElementById(params.get("showModal")).showModal();
  }
}

// Objects
const getObjectWithId = (arr, id) => {
  const objWithIdIndex = arr.findIndex(obj => obj.id === id);

  return arr[objWithIdIndex];
}
const removeObjectWithId = (arr, id) => {
  const objWithIdIndex = arr.findIndex(obj => obj.id === id);

  if (objWithIdIndex > -1) {
    arr.splice(objWithIdIndex, 1);
  }
  return arr;
}
const replaceObjectWithId = (arr, id, newObj) => {
  const objWithIdIndex = arr.findIndex(obj => obj.id === id);
  
  if (objWithIdIndex > -1) {
    arr.splice(objWithIdIndex, 1, newObj);
  }
  return arr;
}
