// DATABASE INFO
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://fibre-b9004-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const itemCodes = ref(database, "items");
const displayResults = document.getElementById("display-results");
let displayHTML = "";

// ITEM CODES JS

const selectStoreType = `
    <select name="display-items" id="display-items">
        <option value="ethernet" data-button="ethernet">Ethernet</option>
        <option value="newsite" data-button="newsite">Newsite</option>
        <option value="exchange" data-button="exchange">Exchange</option>
        <option value="overhead" data-button="overhead">Overhead</option>
        <option value="nodes" data-button="nodes">Nodes</option>
        <option value="blownfibre" data-button="blownfibre">Blown Fibre</option>
        <option value="consumables" data-button="consumables">Consumables</option>
        <option value="tools" data-button="tools">Tools</option>
        <option value="misc" data-button="misc">Misc</option>
      </select>`;

let selected = "";

if (window.location.href === "https://kjfibre.netlify.app/stores") {
  onValue(itemCodes, function (snapshot) {
    selected = document.getElementById("display-items").options[document.getElementById("display-items").selectedIndex].getAttribute("data-button");
    console.log(selected);
    const newItemList = [];
    let itemList = Object.entries(snapshot.val());

    for (let i = 0; i < itemList.length; i++) {
      let newKey = itemList[i][0];
      let newEntry = itemList[i][1];

      newItemList.push({
        key: newKey,
        itemname: newEntry.itemname,
        itemcode: newEntry.itemcode,
        storetype: newEntry.storetype,
      });
    }

    document.addEventListener("change", function (e) {
      console.log(e.target.value);
      displayHTML = "";
      const filterItems = newItemList.filter((store) => {
        return store.storetype === e.target.value;
      });
      render(filterItems);
      document.getElementById("display-results").innerHTML = displayHTML;
    });

    const filterItems = newItemList.filter((store) => {
      return store.storetype === selected;
    });

    render(filterItems);

    document.getElementById("display-results").innerHTML = displayHTML;
  });

  function render(filterItems) {
    filterItems.forEach((filteredItem) => {
      displayHTML += `
            <div class="item" >
              <div class="store-info">
                <div class="store-item">${filteredItem.itemname}</div>
                <div>${filteredItem.itemcode}</div>
              </div>
            </div>
          `;
    });
  }
}

// FIBRE COLOUR CODES

let elementSize = null;
let fibreSelect = null;

const maxElementFibre = 12;
const maxElementFibreEight = 8;

const fibreColours = ["blue", "orange", "green", "red", "slate", "yellow", "brown", "purple", "black", "white", "pink", "aqua"];
const fibreColoursEight = ["blue", "orange", "green", "red", "slate", "yellow", "brown", "purple"];

// DOM Selectors

const fibreNumber = document.getElementById("fibre-number");
const elementNumber = document.getElementById("fibre-element");
const displayFibre = document.getElementById("display-fibre");
const displayElement = document.getElementById("display-element");
const twelveFibre = document.getElementById("12f");
const eightFibre = document.getElementById("8f");

function getFibreNumber() {
  const fibre = fibreNumber.value;
  const elementValue = Math.ceil(fibre / 12);

  let fibreColour = fibre < 13 ? fibre / elementValue - 1 : fibre - (elementValue - 1) * 12 - 1;

  let coloursHtml = fibreColours
    .map((fibreColour, index) => {
      return `<span class="fibre-span ${fibreColour}-fibre">${maxElementFibre * elementValue - (11 - index)}</span> `;
    })
    .join("");

  if (fibreNumber.value === "" || fibreNumber.value === "0") {
  } else if (fibreNumber.value > 864) {
    displayFibre.innerHTML = `
        <div class="alert">MAX FIBRE COUNT 864</div>
    `;
  } else {
    displayFibre.innerHTML = `
        <div>Fibre <span class="accent">${fibre}<span> is  <span class="${fibreColours[fibreColour]}-fibre inline-span">${fibreColours[fibreColour]}</span></div>
        <div>and is in ELEMENT <span class="accent">${elementValue}</span></div>
        <div class="colour-display">${coloursHtml}</div>`;
  }
}

function getFibreNumberEight() {
  const fibre = fibreNumber.value;
  const elementValue = Math.ceil(fibre / 8);

  let fibreColour = fibre < 9 ? fibre / elementValue - 1 : fibre - (elementValue - 1) * 8 - 1;

  let coloursHtml = fibreColoursEight
    .map((fibreColour, index) => {
      return `<span class="fibre-span ${fibreColour}-fibre">${maxElementFibreEight * elementValue - (7 - index)}</span> `;
    })
    .join("");

  if (fibreNumber.value === "" || fibreNumber.value === "0") {
  } else if (fibreNumber.value > 96) {
    displayFibre.innerHTML = `
        <div class="alert">MAX FIBRE COUNT 96</div>
    `;
  } else {
    displayFibre.innerHTML = `
        <div>Fibre <span class="accent">${fibre}<span> is  <span class="${fibreColoursEight[fibreColour]}-fibre inline-span">${fibreColoursEight[fibreColour]}</span></div>
        <div>and is in ELEMENT <span class="accent">${elementValue}</span></div>
        <div class="colour-display">${coloursHtml}</div>`;
  }
}

function getElementNumber() {
  let coloursHtml = fibreColours
    .map((fibreColour, index) => {
      return `<span class="fibre-span ${fibreColour}-fibre">${maxElementFibre * elementNumber.value - (11 - index)}</span> `;
    })
    .join("");

  if (elementNumber.value === "" || elementNumber === "0") {
  } else if (elementNumber.value > 72) {
    displayElement.innerHTML = `<div id="element-Count" class="alert">MAX ELEMENT COUNT 72</div>`;
  } else {
    displayElement.innerHTML = `
      <div>Fibre numbers in ELEMENT <span class="accent">${elementNumber.value}</span></div>
      <div class="colour-display">${coloursHtml}</div>`;
  }
}

function getElementNumberEight() {
  let coloursHtml = fibreColoursEight
    .map((fibreColour, index) => {
      return `<span class="fibre-span ${fibreColour}-fibre">${maxElementFibreEight * elementNumber.value - (7 - index)}</span> `;
    })
    .join("");

  if (elementNumber.value === "" || elementNumber === "0") {
  } else if (elementNumber.value > 12) {
    displayElement.innerHTML = `<div id="element-Count" class="alert">MAX ELEMENT COUNT 12</div>`;
  } else {
    displayElement.innerHTML = `
      <div>Fibre numbers in ELEMENT <span class="accent">${elementNumber.value}</span></div>
      <div class="colour-display">${coloursHtml}</div>`;
  }
}

// Reset Content

function resetValues() {
  fibreNumber.value = "";
  elementNumber.value = "";
  displayElement.innerHTML = "";
  displayFibre.innerHTML = "";
}

// Event Listeners

fibreNumber?.addEventListener("keyup", function () {
  fibreNumber.value === "" ? resetValues() : null;

  if (fibreSelect === 12) {
    getFibreNumber();
  } else if (fibreSelect === 8) {
    getFibreNumberEight();
  }
});

elementNumber?.addEventListener("keyup", function () {
  if (fibreSelect === 12) {
    getElementNumber();
  } else if (fibreSelect === 8) {
    getElementNumberEight();
  }
});

document.getElementById("reset")?.addEventListener("click", () => {
  resetValues();
});

twelveFibre?.addEventListener("click", function () {
  fibreSelect = 12;
  resetValues();
  eightFibre.classList.remove("active");
  twelveFibre.classList.add("active");
});

eightFibre?.addEventListener("click", function () {
  fibreSelect = 8;
  resetValues();
  eightFibre.classList.add("active");
  twelveFibre.classList.remove("active");
});

// SFP ARRAY INFO

const SFP = [
  {
    SFPName: "SFP-05",
    PartNumb: "0061003014",
    Speed: "Gig",
    Distance: "16km",
    LatchColour: "Blue",
  },
  {
    SFPName: "SFP-06",
    PartNumb: "0061003015",
    Speed: "Gig",
    Distance: "16km",
    LatchColour: "Purple",
  },
  {
    SFPName: "SFP-07",
    PartNumb: "0061003018",
    Speed: "Gig",
    Distance: "40km",
    LatchColour: "Blue",
  },
  {
    SFPName: "SFP-08",
    PartNumb: "0061003019",
    Speed: "Gig",
    Distance: "40km",
    LatchColour: "Purple",
  },
  {
    SFPName: "SFP-21",
    PartNumb: "0061003028",
    Speed: "Gig",
    Distance: "66km",
    LatchColour: "Purple",
  },
  {
    SFPName: "SFP-22",
    PartNumb: "0061003029",
    Speed: "Gig",
    Distance: "66km",
    LatchColour: "Gold",
  },
  {
    SFPName: "SFP-23",
    PartNumb: "0061003030",
    Speed: "Gig",
    Distance: "86km",
    LatchColour: "Green",
  },
  {
    SFPName: "SFP-24",
    PartNumb: "0061003031",
    Speed: "Gig",
    Distance: "86km",
    LatchColour: "Red",
  },
  {
    SFPName: "SFP-09",
    PartNumb: "0061003006",
    Speed: "Gig",
    Distance: "Cust Port",
    LatchColour: "Silver",
  },
  {
    SFPName: "SFP-10",
    PartNumb: "0061003008",
    Speed: "Gig",
    Distance: "Cust Port",
    LatchColour: "Blue",
  },
  {
    SFPName: "SFP-98",
    PartNumb: "1061903214-02",
    Speed: "1 Gig",
    Distance: "16km",
    LatchColour: "Blue",
  },
  {
    SFPName: "SFP-99",
    PartNumb: "1061903215-02",
    Speed: "1 Gig",
    Distance: "16km",
    LatchColour: "Purple",
  },
  {
    SFPName: "SFP-100",
    PartNumb: "1061903218-02",
    Speed: "1 Gig",
    Distance: "40km",
    LatchColour: "Blue",
  },
  {
    SFPName: "SFP-101",
    PartNumb: "1061903219-02",
    Speed: "1 Gig",
    Distance: "40km",
    LatchColour: "Purple",
  },
  {
    SFPName: "SFP-104",
    PartNumb: "106705880-01",
    Speed: "1 Gig",
    Distance: "86km",
    LatchColour: "Green",
  },
  {
    SFPName: "SFP-105",
    PartNumb: "106705881-01",
    Speed: "1 Gig",
    Distance: "86km",
    LatchColour: "Red",
  },
  {
    SFPName: "SFP-009",
    PartNumb: "1061705854-02",
    Speed: "1 Gig",
    Distance: "Cust Port",
    LatchColour: "Black",
  },
  {
    SFPName: "SFP-010",
    PartNumb: "1061705850-02",
    Speed: "1 Gig",
    Distance: "Cust Port",
    LatchColour: "Blue",
  },
  {
    SFPName: "SFP-106",
    PartNumb: "0061705890",
    Speed: "N/A",
    Distance: "RJ45",
    LatchColour: "Yellow",
  },
  {
    SFPName: "SFP-207",
    PartNumb: "1061701887-01",
    Speed: "10 Gig",
    Distance: "16km",
    LatchColour: "Blue",
  },
  {
    SFPName: "SFP-206",
    PartNumb: "1061701888-01",
    Speed: "10 Gig",
    Distance: "16km",
    LatchColour: "Blue",
  },
  {
    SFPName: "SFP-208",
    PartNumb: "1061701848-01",
    Speed: "10 Gig",
    Distance: "26km",
    LatchColour: "Blue",
  },
  {
    SFPName: "SFP-209",
    PartNumb: "1061701849-01",
    Speed: "10 Gig",
    Distance: "26km",
    LatchColour: "Blue",
  },
  {
    SFPName: "SFP-210",
    PartNumb: "1061701889-01",
    Speed: "10 Gig",
    Distance: "40km",
    LatchColour: "Blue",
  },
  {
    SFPName: "SFP-211",
    PartNumb: "1061701890-01",
    Speed: "10 Gig",
    Distance: "40km",
    LatchColour: "Blue",
  },
  {
    SFPName: "SFP-212",
    PartNumb: "1061701858-01",
    Speed: "10 Gig",
    Distance: "Cust Port",
    LatchColour: "Grey",
  },
  {
    SFPName: "SFP-213",
    PartNumb: "1061701859-01",
    Speed: "10 Gig",
    Distance: "Cust Port",
    LatchColour: "Blue",
  },

];

function getSFPInfo() {
  console.log(SFP);
  const SFPHtml = SFP.map((data) => {
    return `
    <div class="wrapper-row">
      <div class="wrapper-column">${data.SFPName}</div>
      <div class="wrapper-column">${data.PartNumb}</div>
      <div class="wrapper-column">${data.Distance}</div>
      <div class="wrapper-column">${data.LatchColour}</div>
    </div>  
    `;
  }).join(" ");

  document.querySelector(".display-sfp").innerHTML = SFPHtml;
}

getSFPInfo();
