'use-strict';

const request = indexedDB.open("Nombres", 1);         //abre o crea la base de datos (nombre, version)                         

request.onupgradeneeded = (e) => {                        
    console.log('se creo la DB correctamente');
    var db = request.result;                     
    db.createObjectStore("nombre", {                
        autoIncrement: true,                                   
    });
}

request.onsuccess = e => {
    leerObjetos();
}

request.onerror = e => {
    alert('ocurrio un error al abrir la db');
}

//CRUD

const addObjetos = objeto => {
    const IDBData = getIDBData('se creo correctamente', 'readwrite')
    IDBData.add(objeto);
}

const leerObjetos = () => {
    const IDBData = getIDBData('se leyo correctamente', 'readonly')
    const cursor = IDBData.openCursor();     
    document.querySelector('.nombres').innerHTML = '';
    const fragment = document.createDocumentFragment();                     
    cursor.onsuccess = () => {
        if(cursor.result){
            let elemento = nombresHTML(cursor.result.key, cursor.result.value);
            fragment.appendChild(elemento);
            //console.log(cursor.result.value);
            cursor.result.continue();
        }
        else document.querySelector('.nombres').appendChild(fragment);
    };
}

const modificarObjetos = (key, objeto) => {
    const IDBData = getIDBData('se modifico correctamente', 'readwrite')
    IDBData.put(objeto, key);
}

const removerObjetos = key => {
    const IDBData = getIDBData('se elimino correctamente', 'readwrite')
    IDBData.delete(key);
}

const getIDBData = (mensaje, modo) => {
    var db = request.result;   
    var transaction = db.transaction(["nombre"], modo);
    var objectStore = transaction.objectStore("nombre"); 
    /*transaction.oncomplete = () => {
        alert(mensaje);
    }*/
    return objectStore;
}

const nombresHTML = (id, name) => {
    const container = document.createElement('div');
    const h2 = document.createElement('h2');
    const option = document.createElement('div');
    const saveButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    saveButton.classList.add('save-boton');
    saveButton.style.display = 'none';
    deleteButton.classList.add('delete-boton');

    saveButton.textContent = 'Guardar';
    deleteButton.textContent = 'Borrar';
    h2.textContent = name.nombre;

    h2.setAttribute('contenteditable', 'true');        //editar contenido
    h2.setAttribute('spellcheck', 'false');            //quitar autocorrector

    option.appendChild(saveButton);
    option.appendChild(deleteButton);
    container.appendChild(h2);
    container.appendChild(option);

    h2.addEventListener('keyup', () => {
        saveButton.style.display = 'block';
    })

    saveButton.addEventListener('click', ()=> {
        modificarObjetos(id, {nombre: h2.textContent});
        saveButton.style.display = 'none';
    })

    deleteButton.addEventListener('click', () => {
        removerObjetos(id);
        leerObjetos();
    })

    return container;
}

document.getElementById('add-boton').addEventListener('click', () => {
    let nombre = document.getElementById('nombre').value;
    document.getElementById('nombre').value = '';
    if(nombre.length > 0){
        console.log(nombre);
        addObjetos({nombre});
        leerObjetos();
    }
})
