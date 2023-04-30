import { stores } from "/data.js";

document.addEventListener("click", function (e) {
  if (e.target.dataset.button) {
    filterResult(e.target.dataset.button);
  } else if (e.target.dataset.copycat) {
    handleCopyCode(e.target.dataset.copycat);
    console.log(e.target.dataset.copycat);
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
            <div class="store-item">${store.item}</div>
            <div class="copy-btn" id="copy"><i class="fa-solid fa-copy" data-copycat="${store.itemcode}"></i></div>
          </div>
        `;
  });

  document.getElementById("display-results").innerHTML = displayHtml;
  document.getElementById("store-header").innerHTML = arrays[0].type;
}

function handleCopyCode(itemcode) {
  navigator.clipboard
    .writeText(itemcode)
    .then(() => {
      console.log("successfully copied");
    })
    .catch(() => {
      console.log("something went wrong");
    });
}
