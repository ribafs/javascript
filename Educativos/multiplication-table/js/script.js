const numberList = document.getElementById('numbers')
numberList.addEventListener('change', handleSelectedNumber)

const results = document.querySelector('#results')

function handleSelectedNumber(e) {
  selectedNumber = e.target.value

  function multTable() {
    results.innerHTML = ''
    for (let theIndex = 1; theIndex < 11; theIndex++) {
        let multi = theIndex * selectedNumber
        tableHTML = document.createElement('table')
        tableHTML.innerHTML = `
          <tr>
            <td>${theIndex}</td>
            <td class="selected-number">${selectedNumber}</td>
            <td class="result">${multi}</td>
          </tr>
        `
        results.appendChild(tableHTML)

        if(selectedNumber === 'default') {
          results.innerHTML = '<h4>Ops! You have to choose a number! =/</h4>'
      }
    }
  }

  multTable().reset()
}


