import productdb, {
	bulkcreate, getData, createEle
} from './Module.js'

let db = productdb("Productdb",{
	products: `++id,name,seller,price`
});

let svgedit = `
	<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
		<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
		<path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
	</svg>
`;

let svgdelete = `
	<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
	  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
	  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
	</svg>
`;


// input tags

const userid = document.getElementById('userid');
const proname = document.getElementById('proname');
const seller = document.getElementById('seller');
const price = document.getElementById('price');

//buttons
const btncreate = document.getElementById('btn-create');
const btnread = document.getElementById('btn-read');
const btnupdate = document.getElementById('btn-update');
const btndelete = document.getElementById('btn-delete');

// notfound
const notfound = document.getElementById('notfound');

// insert value using create button
btncreate.onclick = (event) => {
	let flag = bulkcreate(db.products, {
		name: proname.value,
		seller: seller.value,
		price: price.value
	})
	
	proname.value = seller.value = price.value = "";
	getData(db.products, (data)=>{
		userid.value = data.id + 1 || 1;
	});
	
	table(event); 
	
	let insertmsg = document.querySelector(".insertmsg");
	
	getMsg(flag, insertmsg);	
}


// create event on btn read button
btnread.onclick = table;

// update event
btnupdate.onclick = () => {
	const id = parseInt(userid.value || 0);
	if(id)
	{
		db.products.update(id, {
			name: proname.value,
			seller: seller.value,
			price: price.value
		}).then((updated) => { 
			//let get = updated ? `data updated` : `Couldn't update data`;
			let get = updated ? true : false;
			let updatemsg = document.querySelector('.updatemsg');
			getMsg(get, updatemsg);
			proname.value = seller.value = price.value = "";
		})
	}
	table();
};

// delete records
btndelete.onclick = (event) => {
	db.delete();
	db = productdb("Productdb",{
	products: `++id,name,seller,price`
	});
	db.open();
	table(event);
	textID(userid);
	
	let deletemsg = document.querySelector(".deletemsg");
	getMsg(true, deletemsg);
}

// window onload event
window.onload = () => {
	textID(userid);
	table();
}

function textID(textboxid){
	getData(db.products, data => {
		textboxid.value = data.id + 1 || 1;
	});
}

function table(event){
	const tbody = document.getElementById("tbody");
	
	while(tbody.hasChildNodes()){
		tbody.removeChild(tbody.firstChild);
	}
	
	getData(db.products, (data) => {
		if(data){
			createEle('tr',tbody,tr => {
				for (const value in data){
					createEle('td',tr, td => {
						td.textContent = data.price === data[value] ? `$${data[value]}` : data[value];
					})
				}
				tr.insertCell(-1);
				tr.childNodes[4].innerHTML = svgedit;
				tr.childNodes[4].classList.add('btnedit');
				tr.childNodes[4].setAttribute('data-id',data.id);
				tr.childNodes[4].onclick = editbtn;
				tr.insertCell(-1);
				tr.childNodes[5].innerHTML = svgdelete;
				tr.childNodes[5].classList.add('btndelete');
				tr.childNodes[5].setAttribute('data-id',data.id);
				tr.childNodes[5].onclick = deletebtn;
			})
			if(event.target.innerText.toLocaleLowerCase() == 'create'){
				document.querySelector('#notfound').remove();
			}
		} else {
			notfound.textContent = "No records found in the database...!"; 
		}
	})
}

function editbtn(event){
	let id = event.target.tagName.toLowerCase() != "td" ? parseInt(event.target.parentElement.dataset.id) : parseInt(event.target.dataset.id);
	db.products.get(id, data => {
		userid.value = data.id || 0;
		proname.value = data.name || "";
		seller.value = data.seller || "";
		price.value = data.price || "";
	});
}

function deletebtn(event){
	let id = event.target.tagName.toLowerCase() != "td" ? parseInt(event.target.parentElement.dataset.id) : parseInt(event.target.dataset.id);
	db.products.delete(id);
	table();
}

function getMsg(flag, element) {
	if(flag){
		element.className += " movedown";
		
		setTimeout(() => {
			element.classList.forEach(classname => {
				classname == "movedown" ? undefined : element.classList.remove("movedown");
			})
		}, 4000);
	}
}
