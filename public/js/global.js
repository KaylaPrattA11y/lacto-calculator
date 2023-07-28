// Constants
const dateStartEl = document.getElementById("dateStart");
const dateEndEl = document.getElementById("dateEnd");
const editFermentNameEl = document.getElementById("editFermentName");
const editDateStartEl = document.getElementById("editDateStart");
const editDateEndEl = document.getElementById("editDateEnd");
const editNotesEl = document.getElementById("editNotes");
const myFermentsModified = new CustomEvent("myFermentsModified");
const shareButtons = document.querySelectorAll("button[data-share]");

const sortByOldest = data => {
  if (!data) return;
  return data.sort(({dateTimeStart: a}, {dateTimeStart: b}) => a < b ? -1 : a > b ? 1 : 0);
}
const sortByNewest = data => {
  if (!data) return;
  return data.sort(({dateTimeStart: a}, {dateTimeStart: b}) => a < b ? -1 : a > b ? 1 : 0).toReversed();
}

let myFermentsStorage = JSON.parse(localStorage.getItem("saved")) || [];

// PWA
const isStandalone = () =>  window.matchMedia('(display-mode: standalone)').matches || document.referrer.includes('android-app://');

const isIterable = input => {  
  if (input === null || input === undefined) {
    return false;
  }
  return typeof input[Symbol.iterator] === 'function';
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

// update the variable every time a change is made to the saved ferments
document.addEventListener("myFermentsModified", () => {
  myFermentsStorage = sortByNewest(JSON.parse(localStorage.getItem("saved"))) || [];
});

document.addEventListener("DOMContentLoaded", () => {
  // check if can share
  if (navigator.canShare) {
    shareButtons.forEach(button => button.removeAttribute("hidden"));
  }
});