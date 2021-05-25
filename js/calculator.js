{
    const doTheStep = (field, targetValue, step) => {
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

    const niceTransition = (field, targetValue) => {
        let currentValue = field.value;
        if (Math.abs(currentValue - targetValue) > 1) {
            let step = (targetValue - currentValue) / 50;
            doTheStep(field, targetValue, step);
        } else {
            field.value = targetValue.toFixed(2);
        }
    }

    const changeCurrencyText = () => {
        const plnField = document.querySelector(".js-plnField");
        const currencyField = document.querySelector(".js-currencyField");
        const currencyCodes = document.querySelectorAll(".js-currencyCode");
        const select = document.querySelector(".js-currencyList");
        const rate = document.querySelector(".js-rate");
        rate.innerText = select.value;
        currencyCodes.forEach((element) => {
            element.innerText = document.querySelector(".js-currencyList option:checked").text;
        });
        currencyField.value = (plnField.value / select.value).toFixed(2);
    }

    const bindEvents = () => {
        const plnField = document.querySelector(".js-plnField");
        const currencyField = document.querySelector(".js-currencyField");
        const select = document.querySelector(".js-currencyList");

        select.addEventListener("input", changeCurrencyText);

        plnField.addEventListener("input", () => {
            plnField.value = plnField.value < 0.01 ? 0.01 : Number(plnField.value).toFixed(2);
            const targetValue = plnField.value / select.value;
            niceTransition(currencyField, targetValue);
        });

        currencyField.addEventListener("input", () => {
            currencyField.value = currencyField.value < 0.01 ? 0.01 : Number(currencyField.value).toFixed(2);
            const targetValue = currencyField.value * select.value;
            niceTransition(plnField, targetValue);
        });

    }

    const showError = () => {
        const loading = document.querySelector(".js-loading");
        const loadingError = document.querySelector(".js-error");
        loading.classList.add("info__paragraph--hidden");
        loadingError.classList.remove("info__paragraph--hidden");
    }

    const showApp = () => {
        const converter = document.querySelector(".js-converter");
        const loading = document.querySelector(".js-loading");
        loading.classList.add("info__paragraph--hidden");
        converter.classList.remove("converter--hidden");
    }

    const createCurrencyTable = (data) => {
        const currencyTable = [];
        data[0].rates.forEach((element) => {
            currencyTable.push({ code: element.code, bid: element.bid });
        });
        return currencyTable;
    }

    const renderCurrencyList = (currencyTable) => {
        const select = document.querySelector(".js-currencyList");
        let htmlString = "";
        for (const currency of currencyTable) {
            htmlString += `<option value="${currency.bid}" class="js-currencyOption">${currency.code}</option>\n`;
        }
        select.innerHTML = htmlString;
        changeCurrencyText();
    }

    const loadApp = (data) => {
        showApp();
        renderCurrencyList(createCurrencyTable(data));
        bindEvents();
    }

    const fetchData = () => {
        return fetch("https://api.nbp.pl/api/exchangerates/tables/C/?format=json")
            .then((response) => response.json())
            .catch((error) => {
                showError();
                console.log(error);
            });
    }

    const init = () => {
        fetchData().then(loadApp);
    }

    init();

}