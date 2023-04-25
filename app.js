import { stores } from "/data.js";

document.addEventListener("click", function (e) {
  if (e.target.dataset.button) {
    console.log(e.target.dataset.button);
    filterResult(e.target.dataset.button);
  }
});

function filterResult(targetResult) {
  const storeType = stores.filter(function (store) {
    return store.type === targetResult;
  });
  handleClick(storeType);
}

function handleClick(arrays) {
  let displayHtml = "";

  console.log(arrays);

  arrays.forEach(function (store) {
    displayHtml += `
          <div class="item">
            <div class="store-desc">${store.itemcode}</div>
            <div class="store-item">${store.item}</div>
            <div class="copy-btn" id="copy"><i class="fa-solid fa-copy"></i></div>
          </div>
        `;
  });

  document.getElementById("display-results").innerHTML = displayHtml;
  document.getElementById("store-header").innerHTML = arrays[0].type;
}
