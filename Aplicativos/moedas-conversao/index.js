const startConverter = () => {
    const selectors = document.querySelectorAll('.currencySelector')
    const toName = document.querySelector('#toName')
    const fromName = document.querySelector('#fromName')
    const toCurrency = document.querySelector('#toCurrency')    
    const fromCurrency = document.querySelector('#fromCurrency')
    const fromValue = document.querySelector('#fromValue')  
    const toValue = document.querySelector('#toValue')
    const errorMessage = document.querySelector('#errorMessage')
    const swapButton = document.querySelector('#swapButton')

    const setCurrencies = () =>{
        fromName.innerText = fromCurrency.options[fromCurrency.selectedIndex].dataset.name
        toName.innerText = toCurrency.options[toCurrency.selectedIndex].dataset.name
    }

    const convert = (value) => {
        errorMessage.style.display = 'none'
        fetch(`https://free.currconv.com/api/v7/convert?apiKey=d4cf3228112bfb5a29f5&q=${fromCurrency.value}_${toCurrency.value}&compact=y`)
        .then((response)=>response.json())
        .then((rate)=> {toValue.value = (value * rate[`${fromCurrency.value}_${toCurrency.value}`].val).toFixed(2)})    
        .catch((e)=>console.log(e))
    }

    const handleChange = () => {
        !isNaN(fromValue.value) ? convert(fromValue.value) : errorMessage.style.display = 'block'
    }

    const updateAll = () => {
        setCurrencies()
        handleChange()
    }

    const swapCurrencies = () => {
        const temp = fromCurrency.value
        fromCurrency.value =toCurrency.value
        toCurrency.value = temp;
        updateAll()
    }


    toCurrency.onchange = updateAll
    fromCurrency.onchange = updateAll
    fromValue.oninput = handleChange
    swapButton.onclick = swapCurrencies

    fetch('https://free.currconv.com/api/v7/currencies?apiKey=d4cf3228112bfb5a29f5')
    .then((response)=>response.json())
    .then(({results})=> {
        const frag = document.createDocumentFragment()
        const ordered = {}
        Object.keys(results).sort().forEach(function(key) {
            ordered[key] = results[key];
        });
        for (const cur in ordered) {
            if (results.hasOwnProperty(cur)) {
                const option = document.createElement('option')
                option.setAttribute('value', results[cur].id)
                option.dataset.name = results[cur].currencyName
                option.innerText = results[cur].id
                frag.append(option)
            }}
            return [frag, frag.cloneNode(true)]
        }
    )
    .then((frags)=>{
        selectors.forEach((selector,key)=>{
            selector.appendChild(frags[key])
        })
        setCurrencies()
    })
    .catch((e)=>console.log(Error(e)))
}

window.addEventListener('load',startConverter)