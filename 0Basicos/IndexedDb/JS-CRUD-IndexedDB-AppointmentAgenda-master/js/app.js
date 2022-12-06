let DB;

//Selectores de la Interfaz
const form = document.querySelector('form'),
      nombreMascota = document.querySelector('#mascota'),
      nombreCliente = document.querySelector('#cliente'),
      telefono = document.querySelector('#telefono'),
      fecha = document.querySelector('#fecha'),
      hora = document.querySelector('#hora'),
      sintomas = document.querySelector('#sintomas'),
      citas = document.querySelector('#citas'),
      headingAdministra = document.querySelector('#administra');


//Esperar por le DOM Ready
document.addEventListener('DOMContentLoaded',() => {
    //Crear la base de datos
    //Los parámetros son el nombre de la base de datos y el 
    //número es la versión(siempre ha de ser un número entero)
    let crearDB = window.indexedDB.open('citas', 1); 

    //Si hay un error enviarlo a la consola
    crearDB.onerror = function() {
        //console.log ('Hubo un error');
    }
    //Si todo está bien muestra en consola, y asignar la base de datos
    crearDB.onsuccess = function() {
        //console.log ('Todo listo');

        //Asignar a la base de Datos
        DB = crearDB.result;
        //console.log(DB);
        mostrarCitas();//Llamar la función
    }

    //Este método solo se corre una vez, y es ideal para crear el Schema.
    crearDB.onupgradeneeded = function(e) {
        //console.log ('Solo una vez');
        //El evento(e) es la misma base de datos
        let db = e.target.result;

        //Definir el ObjectStore, el cual toma 2 parámetros(el nombre de 
        //la base datosy las opciones)
        //keyPath es el índice de la base de datos
        let objectStore = db.createObjectStore('citas', {keyPath: 'key', autoIncrement: true});

        //Crear los índices y campos de la base de datos con 'createIndex', que tiene
        // 3 parámetros(nombre,keyPath y opciones)
        objectStore.createIndex('mascota','mascota',{unique: false});
        objectStore.createIndex('cliente','cliente',{unique: false});
        objectStore.createIndex('telefono','telefono',{unique: false});
        objectStore.createIndex('fecha','fecha',{unique: false});
        objectStore.createIndex('hora','hora',{unique: false});
        objectStore.createIndex('sintomas','sintomas',{unique: false});
    }

    //Leer e insertar los datos del formulario cuando se envía
    form.addEventListener('submit',agregarDatos);

    function agregarDatos(e) {
        e.preventDefault();

        //crear un objeto para insertar los registros
        const nuevaCita = {
            mascota : nombreMascota.value,
            cliente : nombreCliente.value,
            telefono : telefono.value,
            fecha : fecha.value,
            hora : hora.value,
            sintomas : sintomas.value
        }
        //console.log(nuevaCita)

        //Insertar la información en IndexedDB mediante transacciones
        let transaction = DB.transaction(['citas'],'readwrite');
        let objectStore = transaction.objectStore('citas');
        //console.log(objectStore);
        let peticion = objectStore.add(nuevaCita);
        //console.log(peticion);

        peticion.onsuccess = () => {
            form.reset();
        }

        transaction.oncomplete = () => {
            //console.log('Cita agregada');
            //Llamamos de nuevo la función para mostrar más citas
            mostrarCitas();
        }

        transaction.onerror = () => {
            //console.log('Hubo un error');
        }
    }

    function mostrarCitas() {
        //Limpiar las citas anteriores
        while(citas.firstChild) {
            citas.removeChild(citas.firstChild);
        }

        //Creamos un objectStore
        let objectStore = DB.transaction('citas').objectStore('citas');

        //Esto retorna una petición
        objectStore.openCursor().onsuccess = function(e) {
            //Cursor se va a ubicar en el registro indicado par acceder a los datos
            let cursor = e.target.result;
            //console.log(cursor);
            if(cursor) {
                let citaHTML = document.createElement('li');
                citaHTML.setAttribute('data-cita-id', cursor.value.key);
                citaHTML.classList.add('list-group-item');

                citaHTML.innerHTML = `
                    <p class="font-weight-bold">Mascota:<span class="font-weight-normal">${cursor.value.mascota}
                    </span></p>
                    <p class="font-weight-bold">Cliente:<span class="font-weight-normal">${cursor.value.cliente}
                    </span></p>
                    <p class="font-weight-bold">Teléfono:<span class="font-weight-normal">${cursor.value.telefono}
                    </span></p>
                    <p class="font-weight-bold">Fecha:<span class="font-weight-normal">${cursor.value.fecha}
                    </span></p>
                    <p class="font-weight-bold">Hora:<span class="font-weight-normal">${cursor.value.hora}
                    </span></p>
                    <p class="font-weight-bold">Síntomas:<span class="font-weight-normal">${cursor.value.sintomas}
                    </span></p>
                `;

                //Botón de borrar
                const botonBorrar = document.createElement('button');
                botonBorrar.classList.add('borrar','btn','btn-danger');
                botonBorrar.innerHTML = '<span aria-hidden="true"> x </span> Borrar';
                //Hacemos referencia a la función. Es otro modo de hacerlo. Sino podríamos crear el botón 
                //dentro del <li> de citaHTML y hacer Delegation.
                botonBorrar.onclick = borrarCita;
                citaHTML.appendChild(botonBorrar);

                //append en el padre
                citas.appendChild(citaHTML);

                //consular los próximos registros
                cursor.continue();

            } else {
                if(!citas.firstChild) {
                    //cuando no hay registros
                    headingAdministra.textContent = 'Agrega citas para comenzar';
                    let listado = document.createElement('p');
                    listado.classList.add('text-center');
                    listado.textContent = 'No hay registro';
                    citas.appendChild(listado);
                } else  {
                    headingAdministra.textContent = 'Administra tus citas';
                }
                
            }
        }

        function borrarCita(e) {
            //Buscamos que al presionar el botón nos muestre el 'id' para poder usarlo 
            //para eliminar los registros.
            //console.log(e.target.parentElement.getAttribute('data-cita-id'));//traversing
            let citaID = Number(e.target.parentElement.getAttribute('data-cita-id'));

            //Borrar la información en IndexedDB mediante transacciones
            let transaction = DB.transaction(['citas'],'readwrite');
            let objectStore = transaction.objectStore('citas');
            //console.log(objectStore);
            let peticion = objectStore.delete(citaID);
            //console.log(peticion);

            //Borrar el <li> de los registros insertados en el DOM.
            // Para eliminar en el DOM, debemos de ir a un padre más arriba de 
            // lo que queremos eliminar.
            transaction.oncomplete = () => {
                e.target.parentElement.parentElement.removeChild(e.target.parentElement);

                console.log(`Se eliminó la cita  con el ID: ${citaID}`);

                if(!citas.firstChild) {
                    //cuando no hay registros
                    headingAdministra.textContent = 'Agrega citas para comenzar';
                    let listado = document.createElement('p');
                    listado.classList.add('text-center');
                    listado.textContent = 'No hay registro';
                    citas.appendChild(listado);
                } else  {
                    headingAdministra.textContent = 'Administra tus citas';
                }
            }
        }
    }
})