const itemsList = document.getElementById('items-list');
const nameToFind = document.getElementById('name-to-find');
const newName = document.getElementById('change-name-to');
const oldName = document.getElementById('name-to-change');

let db; //hold the instance of the db

//create/open DB
const openDb = window.indexedDB.open('crud-example', 1); //name of the db and version

/**
 * Helper function
 */
function showStatus(message) {
    console.log(message);
}

openDb.onerror = (event) => {
    showStatus("Failed to open DB");
};

openDb.onsuccess = (event) => {
    showStatus("DB open successfully");
    db = openDb.result;
    readAll();
};

openDb.onupgradeneeded = (event) => {
    db = event.target.result;

    db.onerror = (event) => {
        showStatus("Failed to open DB");
    };

    let objectStore = db.createObjectStore('crud-example', { keyPath: 'id' }); //create table
    objectStore.createIndex('name', 'name', { unique: false }); // Define an index
};

/**
 * Add a new random item
 * 
 * Each item has and id and a name
 * {id:1, name:'item 1'}
 */
function addData() {
    let now = new Date();
    let timestamp = now.getTime();
    let newItem = { id: timestamp, name: "rnd_" + timestamp }; // random item with the current timestamp
    const transaction = db.transaction(['crud-example'], 'readwrite');
    transaction.oncomplete = () => {
        showStatus("Transaction complete");
        readAll();
    };
    transaction.onerror = () => {
        showStatus(transaction.error);
    };
    let objectStore = transaction.objectStore('crud-example');
    const objectStoreRequest = objectStore.add(newItem);
    objectStoreRequest.onsuccess = (event) => {
        showStatus("Item successfully added, id = " + timestamp)
    };
};

/**
 * Read all elements in crud-example DB and crud-example table
 */
function readAll() {
    let itemList = [];
    let objectStore = db.transaction('crud-example').objectStore('crud-example');
    objectStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        // if no more items
        if (!cursor) {
            showStatus("All items read");
            displayItems(itemList);
            return;
        }
        const { id, name } = cursor.value;
        let listItem = {
            id, name
        };
        itemList.push(listItem);
        cursor.continue();
    };
}

/**
 * Build the html lists items
 */
function displayItems(itemList) {
    let htmlList = "";
    itemList.forEach(element => {
        htmlList += "<li>ID: " + element.id + " | NAME: " + element.name + "<button class='rounded-none bg-red-500 px-2' onclick='deleteItem(" + element.id + ")'>Delete</button></li>";
    });
    itemsList.innerHTML = htmlList;
}

/**
 * Delete a item by id
 */
function deleteItem(itemId) {
    const transaction = db.transaction(['crud-example'], 'readwrite');
    transaction.oncomplete = () => {
        showStatus("Transaction complete");
        readAll();
    };
    let objectStore = transaction.objectStore('crud-example');
    const objectStoreRequest = objectStore.delete(itemId);
    objectStoreRequest.onsuccess = (event) => {
        showStatus("Item " + itemId + " deleted");
    };
}

/**
 * Find a item in the table
 */
function findItem() {
    let name = nameToFind.value; //input value
    const transaction = db.transaction(['crud-example'], 'readwrite');
    transaction.oncomplete = () => {
        showStatus("Transaction complete");
        readAll();
    };
    let objectStore = transaction.objectStore('crud-example');
    const idIndex = objectStore.index('name');
    const keyRng = IDBKeyRange.only(name); //only those that match
    idIndex.openCursor(keyRng).onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            const { id, name } = cursor.value;
            alert("Item found with id " + id);
        } else {
            alert("Item not found");
        }
        //cursor.continue();
    };
}

/**
 * Update the name of a item
 */
function updateItem() {
    const transaction = db.transaction(['crud-example'], 'readwrite');
    transaction.oncomplete = () => {
        showStatus("Transaction complete");
        readAll();
    };
    let objectStore = transaction.objectStore('crud-example');
    const idIndex = objectStore.index('name');
    const keyRng = IDBKeyRange.only(oldName.value); //the item to update
    idIndex.openCursor(keyRng).onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
            const item = cursor.value;
            item.name = newName.value; //set new value
            const updateRequest = cursor.update(item);
            updateRequest.onsuccess = (event) => {
                showStatus("Updated item");
            };
            cursor.continue();
        }
    };
}

/**
 * Delete entire DB
 */
function deleteDB() {

    var req = indexedDB.deleteDatabase('crud-example');
    req.onsuccess = (event) => {
        showStatus("Successfully delete DB");
    };
    req.onerror = (event) => {
        showStatus("Couldn't delete DB");
    };
    req.onblocked = (event) => {
        showStatus("Couldn't delete DB due to the operation being blocked, but DB deleted anyway");
    };
}