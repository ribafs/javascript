var selectedRow = null;
function validateMyForm()
{
    event.preventDefault();
    
    var formData={}; 
    formData['name'] = document.getElementById("name").value;
    formData['age'] = document.getElementById("age").value;
    if(selectedRow == null)
        insertData(formData); 
    else
        onupdate(formData);
        reset();
}


function insertData(formData)
{
    var tableData=document.getElementById('mytable').getElementsByTagName('tbody')[0];
    let newRow=tableData.insertRow(tableData.length);
    var cell1 = newRow.insertCell(0);
    cell1.innerHTML = formData.name;
    var cell2 = newRow.insertCell(1);
    cell2.innerHTML = formData.age;
    var cell3 = newRow.insertCell(2);
    cell3.innerHTML=`<a href="#" class="btn btn-sm btn-info" onClick="onedit(this)">Edit</a>`;
    var cell4 = newRow.insertCell(3);
    cell4.innerHTML=`<a href="#" class="btn btn-sm btn-danger" onClick="ondelete(this)">Delete</a>`;

}
function reset()
{
    document.getElementById("name").value="";
    document.getElementById("age").value="";
    selectedRow = null;
}
function onedit(td)
{
    selectedRow = td.parentElement.parentElement;
    document.getElementById("name").value = selectedRow.cells[0].innerHTML;
    document.getElementById("age").value = selectedRow.cells[1].innerHTML;
}
function onupdate(formData)
{
    selectedRow.cells[0].innerHTML = formData.name;
    selectedRow.cells[1].innerHTML = formData.age;
}
function ondelete(td)
{
    var row = td.parentElement.parentElement;
    document.getElementById('mytable').deleteRow(row.rowIndex);
    reset();
}
