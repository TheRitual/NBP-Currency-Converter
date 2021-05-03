let rate = document.querySelector(".js-rate");
let converter = document.querySelector(".js-converter");
let loading = document.querySelector(".js-loading");
let loadingError = document.querySelector(".js-error");
let select = document.querySelector(".js-currencyList");
let plnField = document.querySelector(".js-plnField");
let currencyField = document.querySelector(".js-currencyField");
let currencyCode = document.querySelectorAll(".js-currencyCode");

fetch("https://api.nbp.pl/api/exchangerates/tables/C/?format=json")
    .then((response) => response.json())
    .then((data) => loadData(data))
    .catch((error) => {
        loading.classList.add("info__paragraph--hidden");
        loadingError.classList.remove("info__paragraph--hidden");
        console.log(error);
    });

function loadData(data) {
    data[0].rates.forEach((element) => {
        var node = document.createElement("option");
        var textNode = document.createTextNode(element.code);
        node.setAttribute("value", element.bid);
        node.appendChild(textNode);
        select.appendChild(node);
    });
    rate.innerText = select.value;
    plnField.value = (currencyField.value * select.value).toFixed(2);
    currencyCode.forEach((element) => {
        element.innerText = select.options[select.selectedIndex].text;
    });
    loading.classList.add("info__paragraph--hidden");
    converter.classList.remove("converter--hidden");
}

select.addEventListener("change", () => {
    rate.innerText = select.value;
    currencyCode.forEach((element) => {
        element.innerText = select.options[select.selectedIndex].text;
    });
    currencyField.value = (plnField.value / select.value).toFixed(2);
});

plnField.addEventListener("change", () => {
    if (plnField.value <= 0) {
        plnField.value = 0.01;
    }
    let targetValue = (plnField.value / select.value);
    easeChange(currencyField, targetValue);
});

currencyField.addEventListener("change", () => {
    if (currencyField.value <= 0) {
        currencyField.value = 0.01;
    }
    let targetValue = (currencyField.value * select.value);
    easeChange(plnField, targetValue);
});

function doTheStep(field, targetValue, step) {
    field.value = (Number(field.value) + step).toFixed(2);
    if (
        (step > 0 && Number(field.value) < targetValue) ||
        (step < 0 && Number(field.value) > targetValue)
    ) {
        setTimeout(doTheStep, 5, field, targetValue, step);
    } else {
        field.value = targetValue.toFixed(2);
    }
}

function easeChange(field, targetValue) {
    let currentValue = field.value;
    if (Math.abs(currentValue - targetValue) > 1) {
        let step = (targetValue - currentValue) / 50;
        doTheStep(field, targetValue, step);
    } else {
        field.value = targetValue.toFixed(2);
    }
}
