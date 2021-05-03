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

    const easeChange = (field, targetValue) => {
        let currentValue = field.value;
        if (Math.abs(currentValue - targetValue) > 1) {
            let step = (targetValue - currentValue) / 50;
            doTheStep(field, targetValue, step);
        } else {
            field.value = targetValue.toFixed(2);
        }
    }

    const onChangeCurrency = () => {
        const plnField = document.querySelector(".js-plnField");
        const currencyField = document.querySelector(".js-currencyField");
        const currencyCode = document.querySelectorAll(".js-currencyCode");
        const select = document.querySelector(".js-currencyList");
        const rate = document.querySelector(".js-rate");
        rate.innerText = select.value;
        currencyCode.forEach((element) => {
            element.innerText = select.options[select.selectedIndex].text;
        });
        currencyField.value = (plnField.value / select.value).toFixed(2);
    }

    const bindEvents = () => {
        const plnField = document.querySelector(".js-plnField");
        const currencyField = document.querySelector(".js-currencyField");
        const select = document.querySelector(".js-currencyList");

        select.addEventListener("change", () => onChangeCurrency());

        plnField.addEventListener("change", () => {
            plnField.value = plnField.value < 0.01 ? 0.1 : Number(plnField.value).toFixed(2);
            const targetValue = (plnField.value / select.value);
            easeChange(currencyField, targetValue);
        });

        currencyField.addEventListener("change", () => {
            currencyField.value = currencyField.value < 0.01 ? 0.1 : Number(currencyField.value).toFixed(2);
            const targetValue = (currencyField.value * select.value);
            easeChange(plnField, targetValue);
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
            htmlString += `<option value="${currency.bid}">${currency.code}</option>\n`;
        }
        select.innerHTML = htmlString;
        onChangeCurrency();
    }

    const loadApp = (data) => {
        const currencyTable = createCurrencyTable(data);
        showApp();
        renderCurrencyList(currencyTable);
        bindEvents();
    }

    const fetchData = () => {
        fetch("https://api.nbp.pl/api/exchangerates/tables/C/?format=json")
            .then((response) => response.json())
            .then((data) => loadApp(data))
            .catch((error) => {
                showError();
                console.log(error);
            });
    }

    const init = () => {
        fetchData();
    }

    init();

}