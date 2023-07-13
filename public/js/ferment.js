const deleteFermentButtons = document.querySelectorAll("button[data-delete]");
const saveFermentForm = document.getElementById("saveFermentForm");
const saveFermentButton = document.getElementById("saveFermentButton");
const saveFermentDialog = document.getElementById("saveFermentDialog");
const viewFermentsDialog = document.getElementById("viewFermentsDialog");
const fermentName = document.getElementById("fermentName");
const dateStart = document.getElementById("dateStart");
const notes = document.getElementById("notes");
const date = new Date();
const todaysdate = date.toISOString().split('T')[0];
const savedFermentsList = document.getElementById("savedFermentsList");
const savedFermentsStorage = JSON.parse(localStorage.getItem("saved")) || [];

const addFerment = (f) => {
  const li = document.createElement("li");
  const sd = new Date(f.dateStart);
  const d = sd.getDate();
  sd.setDate(d + 1);
  const startDateTime = new Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(sd);

  li.id = f.id;
  li.className = "ferment";
  li.innerHTML = `
    <div class="ferment-header">
      <div>
        <h3>${f.fermentName}</h3>
        <div class="ferment-date">
          <kay-icon class="carbon:calendar" aria-hidden="true"></kay-icon> 
          <time datetime="${f.dateStart}">${startDateTime}</time>
        </div>
      </div>
      <button type="button" class="btn-default" aria-controls="${f.id}" data-share hidden>
        <kay-icon class="carbon:share" aria-hidden="true"></kay-icon> Share
      </button>
    </div>
    <div class="ferment-body">
      <ul class="ferment-details">
        <li>
          <div>Brine:</div>
          <div><span>${f.brine}</span><span class="ferment-unit">%</span></div>
        </li>
        <li>
          <div>Weight:</div>
          <div><span>${f.weight}</span> <span class="ferment-unit">${f.unit}</span></div>
        </li>
        <li>
          <div>Salt:</div>
          <div><span>${f.salt}</span> <span class="ferment-unit">${f.unit}</span></div>
        </li>
      </ul>
      <p class="ferment-notes">${f.notes}</p>
      <button type="button" class="btn-default" aria-controls="${f.id}" data-delete>
        <kay-icon class="carbon:trash-can" aria-hidden="true"></kay-icon> Delete
      </button>
    </div>`;
  savedFermentsList.insertAdjacentElement("afterbegin", li);
};

const addFerments = (savedFermentsStorage) => {
  if (!savedFermentsStorage) return;
  savedFermentsStorage.forEach((f) => addFerment(f));
};

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

const handleShare = button => {
  button.addEventListener("click", async () => {
    const id = button.getAttribute("aria-controls");
    const { brine, weight, salt, unit, fermentName, dateStart, notes } = getObjectWithId(savedFermentsStorage, id);
    const shareData = {
      title: "Brine Calculator | Lacto-fermentation",
      text: `${fermentName ? fermentName+" | " : ""}Started: ${dateStart}, Brine: ${brine}%, Weight: ${weight} ${unit}, Salt: ${salt} ${unit}, ${notes ? "Notes: "+notes : ""}`,
      url: "https://kaylapratta11y.github.io/lacto-calculator/",
    };
    console.log(shareData)

    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log(err)
    }
  });
}

const setTodaysDate = () => {
  // set default start date as today's date
  dateStart.value = todaysdate;
  dateStart.setAttribute("max", todaysdate);
}

document.addEventListener("DOMContentLoaded", () => {

  setTodaysDate();

  document.addEventListener("click", e => {

    // delete ferment
    if (e.target.matches("button[data-delete]")) {
      const savedFermentsStorage = JSON.parse(localStorage.getItem("saved"));
      const id = e.target.getAttribute("aria-controls");

      document.getElementById(id).remove();
      removeObjectWithId(savedFermentsStorage, id);
      localStorage.setItem("saved", JSON.stringify(savedFermentsStorage));
    }

    if (e.target.matches("button[data-share]")) {
      handleShare(e.target);
    }

  });

  saveFermentForm.addEventListener("submit", e => {
    e.preventDefault();

    const randomNumber = Math.floor(Math.random() * 9000 + 1000);
    const state = JSON.parse(localStorage.getItem("state"));
    const thisFerment = {
      id: `ferment-${randomNumber}-${parseInt(state.brine, 10) + parseInt(state.weight, 10) + parseInt(state.salt, 10)}`,
      brine: parseInt(state.brine, 10),
      weight: parseInt(state.weight, 10),
      salt: state.salt,
      unit: state.unit,
      fermentName: fermentName.value || "",
      dateStart: dateStart.value,
      notes: notes.value || "",
    };
  
    savedFermentsStorage.push(thisFerment);
    addFerment(thisFerment);
    localStorage.setItem("saved", JSON.stringify(savedFermentsStorage));


    saveFermentDialog.close();
    viewFermentsDialog.showModal();
  });

  saveFermentDialog.addEventListener("cancel", () => {
    saveFermentForm.reset();
    setTodaysDate();
  });
  saveFermentDialog.addEventListener("close", () => {
    saveFermentForm.reset();
    setTodaysDate();
  });

  addFerments(savedFermentsStorage);
});
