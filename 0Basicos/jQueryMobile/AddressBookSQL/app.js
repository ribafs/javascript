$(function () {
// define the application
var AddressBook = {};
//variable to hold the websql database.
var dbAddressBook;
var pgtransition = 'slide';
(function (app) {
// variable definitions go here
var ContactLi = '<li ><a data-id="Z2"><h2>Z1</h2><p>DESCRIPTION</p></a></li>';
var ContactHdr = '<li data-role="list-divider">Your Contacts</li>';
var noContact = '<li id="noContact">You have no contacts</li>';
var pgContactListScroller = new IScroll('#pgContactList', {mouseWheel:true, scrollbars:true, bounce:true, zoom:false});
app.init = function () {
FastClick.attach(document.body);
addToHomescreen();
var addToHomeConfig = {returningVisitor: true, expire: 720, autostart: false};
//open the websql database
dbAddressBook = SqlOpenDb("AddressBook");
//create the necessary tables for the application
//create a websql table for SQL-Contact
app.ContactSqlCreateTable = function () {
var tblStructure = {};
tblStructure.FullName = DB_TEXT;
tblStructure.Company = DB_TEXT;
tblStructure.JobTitle = DB_TEXT;
tblStructure.EmailAddress = DB_TEXT;
tblStructure.BusinessPhone = DB_TEXT;
tblStructure.BusinessFax = DB_TEXT;
tblStructure.MobilePhone = DB_TEXT;
tblStructure.HomePhone = DB_TEXT;
tblStructure.StreetAddress1 = DB_TEXT;
tblStructure.StreetAddress2 = DB_TEXT;
tblStructure.City = DB_TEXT;
tblStructure.State = DB_TEXT;
tblStructure.Province = DB_TEXT;
tblStructure.PostalCode = DB_TEXT;
SqlCreateTable(dbAddressBook, "Contact", tblStructure, "FullName", "");
};
app.ContactSqlCreateTable();
app.ContactBindings();
$('#msgboxyes').on('click', function (e) {
e.preventDefault();
e.stopImmediatePropagation();
var yesmethod = $('#msgboxyes').data('method');
var yesid = $('#msgboxyes').data('id');
app[yesmethod](yesid);
});
$('#msgboxno').on('click', function (e) {
e.preventDefault();
e.stopImmediatePropagation();
var nomethod = $('#msgboxno').data('method');
var noid = $('#msgboxno').data('id');
var toPage = $('#msgboxno').data('topage');
// show the page to display after a record is deleted
$.mobile.changePage('#' + toPage, {transition: pgtransition});
app[nomethod](noid);
});
$('#alertboxok').on('click', function (e) {
e.preventDefault();
e.stopImmediatePropagation();
var toPage = $('#alertboxok').data('topage');
// show the page to display after ok is clicked
$.mobile.changePage('#' + toPage, {transition: pgtransition});
});
$(document).on('click', '#sbItems a', function (e) {
e.preventDefault();
e.stopImmediatePropagation();
var href = $(this).attr('href');
$.mobile.changePage(href, {transition: pgtransition});
});
};
// define events to be fired during app execution.
app.ContactBindings = function () {
// code to run before showing the page that lists the records.
//run before the page is shown
$(document).on('pagebeforechange', function (e, data) {
//get page to go to
var toPage = data.toPage[0].id;
switch (toPage) {
case 'pgContact':
$('#pgRptContactBack').data('from', 'pgContact');
// restart the storage check
app.checkForContactStorage();
break;
case 'pgReports':
$('#pgRptContactBack').data('from', 'pgReports');
break;
case 'pgRptContact':
app.ContactRpt();
break;
case 'pgEditContact':
$('#pgRptContactBack').data('from', 'pgEditContact');
//clear the edit page contents
pgEditContactClear();
//load related select menus before the page shows
var FullName = $('#pgEditContact').data('id');
//read record from SQL and update screen.
app.editContact(FullName);
break;
case 'pgAddContact':
$('#pgRptContactBack').data('from', 'pgAddContact');
pgAddContactClear();
//load related select menus before the page shows
break;
}
});
//run after the page has been displayed
$(document).on('pagecontainershow', function (e, ui) {
var pageId = $(':mobile-pagecontainer').pagecontainer('getActivePage').attr('id');
switch (pageId) {
case 'pgContactMindCity':
app.ContactMindMapCity();
break;
case 'pgEditContact':
//show the first nav item.
$('#pgEditContactDetailsBtn').trigger('click');
break;
case 'pgAddContact':
//show the first nav item.
$('#pgAddContactDetailsBtn').trigger('click');
break;
default:
}
});
//***** Add Page *****
// code to run when back button is clicked on the add record page.
// Back click event from Add Page
$('#pgAddContactBack').on('click', function (e) {
e.preventDefault();
e.stopImmediatePropagation();
//which page are we coming from, if from sign in go back to it
var pgFrom = $('#pgAddContact').data('from');
switch (pgFrom) {
case "pgSignIn":
$.mobile.changePage('#pgSignIn', {transition: pgtransition});
break;
default:
// go back to the records listing screen
$.mobile.changePage('#pgContact', {transition: pgtransition});
}
});
// code to run when the Save button is clicked on Add page.
// Save click event on Add page
$('#pgAddContactSave').on('click', function (e) {
e.preventDefault();
e.stopImmediatePropagation();
// save the Contact
var ContactRec;
//get form contents into an object
ContactRec = pgAddContactGetRec();
//save object to SQL
app.addContact(ContactRec);
});
// code to run when a get location button is clicked on the Add page.
//***** Add Page - End *****
// export button click on records mindmap page
$('#ContactMindExportCity').on('click', function (e) {
e.preventDefault();
e.stopImmediatePropagation();
d3.selectAll('svg').attr('version', '1.1');
d3.selectAll('svg').attr('xmlns', 'http://www.w3.org/2000/svg');
var html = d3.select('svg').node().parentNode.innerHTML;
var imgsrc = 'data:image/svg+xml;base64,' + btoa(html);
var img = '<img src=' + imgsrc + '>';
//create a canvas to store the image
var canvas = document.createElement('canvas');
canvas.width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
canvas.height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
var context = canvas.getContext('2d');
var image = new Image;
image.src = imgsrc;
image.onload = function() {
context.drawImage(image, 0, 0);
var canvasdata = canvas.toDataURL('image/png');
var pngimg = '<img src=' + canvasdata + '>';
var a = document.createElement('a');
a.download = 'City.png';
a.href = canvasdata;
a.click();
};
});
//***** Listing Page *****
// code to run when a listview item is clicked.
//listview item click eventt.
$(document).on('click', '#pgContactList a', function (e) {
e.preventDefault();
e.stopImmediatePropagation();
//get href of selected listview item and cleanse it
var href = $(this).data('id');
href = href.split(' ').join('-');
//save id of record to edit;
$('#pgEditContact').data('id', href);
//change page to edit page.
$.mobile.changePage('#pgEditContact', {transition: pgtransition});
});
// code to run when back button of record listing is clicked.
// bind the back button of the records listing
$('#pgContactBack').on('click', function (e) {
e.preventDefault();
e.stopImmediatePropagation();
// move to the defined previous page with the defined transition
$.mobile.changePage('#pgMenu', {transition: pgtransition});
});
// code to run when New button on records listing is clicked.
// New button click on records listing page
$('#pgContactNew').on('click', function (e) {
e.preventDefault();
e.stopImmediatePropagation();
//we are accessing a new record from records listing
$('#pgAddContact').data('from', 'pgContact');
// show the active and user type elements
$('#pgAddContactheader h1').text('Address Book > Add Contact');
$('#pgAddContactMenu').show();
// move to the add page screen
$.mobile.changePage('#pgAddContact', {transition: pgtransition});
});
//***** Listing Page - End *****
//***** Edit Page *****
// code to run when the back button of the Edit Page is clicked.
// Back click event on Edit page
$('#pgEditContactBack').on('click', function (e) {
e.preventDefault();
e.stopImmediatePropagation();
// go back to the listing screen
$.mobile.changePage('#pgContact', {transition: pgtransition});
});
// code to run when the Update button is clicked in the Edit Page.
// Update click event on Edit Page
$('#pgEditContactUpdate').on('click', function (e) {
e.preventDefault();
e.stopImmediatePropagation();
// save the Contact
var ContactRecNew;
//get contents of Edit page controls
ContactRecNew = pgEditContactGetRec();
//save updated records to SQL
app.updateContact(ContactRecNew);
});
// code to run when the Delete button is clicked in the Edit Page.
// delete button on Edit Page
$('#pgEditContactDelete').on('click', function (e) {
e.preventDefault();
e.stopImmediatePropagation();
//read the record key from form control
var FullName = $('#pgEditContactFullName').val().trim();
//show a confirm message box
$('#msgboxheader h1').text('Confirm Delete');
$('#msgboxtitle').text(FullName.split('-').join(' '));
$('#msgboxprompt').text('Are you sure that you want to delete this contact? This action cannot be undone.');
$('#msgboxyes').data('method', 'deleteContact');
$('#msgboxno').data('method', 'editContact');
$('#msgboxyes').data('id', FullName.split(' ').join('-'));
$('#msgboxno').data('id', FullName.split(' ').join('-'));
$('#msgboxyes').data('topage', 'pgEditContact');
$('#msgboxno').data('topage', 'pgEditContact');
$.mobile.changePage('#msgbox', {transition: 'pop'});
});
//***** Edit Page - End *****
//***** Report Page *****
//back button on Report page
// Back click event on Report page
$('#pgRptContactBack').on('click', function (e) {
e.preventDefault();
e.stopImmediatePropagation();
var pgFrom = $('#pgRptContactBack').data('from');
switch (pgFrom) {
case "pgAddContact":
$.mobile.changePage('#pgContact', {transition: pgtransition});
break;
case "pgEditContact":
$.mobile.changePage('#pgContact', {transition: pgtransition});
break;
case "pgContact":
$.mobile.changePage('#pgContact', {transition: pgtransition});
break;
default:
// go back to the listing screen
$.mobile.changePage('#pgReports', {transition: pgtransition});
}
});
//add new record from report page
// New button click on records report page
$('#pgRptContactNew').on('click', function (e) {
e.preventDefault();
e.stopImmediatePropagation();
//we are accessing a new record from records report
$('#pgAddContact').data('from', 'pgRptContact');
// show the active and user type elements
$('#pgAddContactheader h1').text('Address Book > Add Contact');
// move to the add page screen
$.mobile.changePage('#pgAddContact', {transition: pgtransition});
});//***** Report Page - End *****
//Our events are now fully defined.
};
// this defines methods/procedures accessed by our events.
// get existing records from SQL
//display records in table during runtime.
app.ContactRpt = function () {
//clear the table and leave the header
$('#RptContact tbody tr').remove();
//get records from SQL.
//when returned, parse then as json object
var ContactObj = {};
$.when(SqlGetRecords(dbAddressBook, "Contact", "FullName")).done(function (dta) {
// return json object of all records
ContactObj = ResultSetToJSON(dta, "FullName");
// are there existing Contact records?
if (!$.isEmptyObject(ContactObj)) {
// yes there are. pass them off to be displayed
// create an empty string to contain all rows of the table
var newrows = '';
// make sure your iterators are properly scoped
var n;
// loop over records and create a new row for each
// and append the newrows with each table row.
for (n in ContactObj) {
//get the record details
var ContactRec = ContactObj[n];
//clean primary keys
n = n.split('-').join(' ');
//create each row
var eachrow = '<tr>';
eachrow += '<td class="ui-body-c">' + n + '</td>';
eachrow += '<td class="ui-body-c">' + ContactRec.Company + '</td>';
eachrow += '<td class="ui-body-c">' + ContactRec.JobTitle + '</td>';
eachrow += '<td class="ui-body-c">' + ContactRec.EmailAddress + '</td>';
eachrow += '<td class="ui-body-c">' + ContactRec.BusinessPhone + '</td>';
eachrow += '<td class="ui-body-c">' + ContactRec.BusinessFax + '</td>';
eachrow += '<td class="ui-body-c">' + ContactRec.MobilePhone + '</td>';
eachrow += '<td class="ui-body-c">' + ContactRec.StreetAddress1 + '</td>';
eachrow += '<td class="ui-body-c">' + ContactRec.StreetAddress2 + '</td>';
eachrow += '<td class="ui-body-c">' + ContactRec.City + '</td>';
eachrow += '<td class="ui-body-c">' + ContactRec.PostalCode + '</td>';
eachrow += '</tr>';
//append each row to the newrows variable;
newrows += eachrow;
}
// update the table
$('#RptContact').append(newrows);
// refresh the table with new details
$('#RptContact').table('refresh');
};
}).fail(function (err) {
});
};
//display records in table during runtime.
app.ContactMindMapCity = function () {
//create an array for flat records table with parent and child name
var data = [], rec, n;
//get records from SQL.
//when returned, parse then as json object
var ContactObj = {};
$.when(SqlGetRecords(dbAddressBook, "Contact", "FullName")).done(function (dta) {
// return json object of all records
ContactObj = ResultSetToJSON(dta, "FullName");
// are there existing Contact records?
if (!$.isEmptyObject(ContactObj)) {
// yes there are. pass them off to be displayed
var parents = new Map();
var kids = new Map();
for (n in ContactObj) {
//get the record parent and child relationship
var ContactRec = ContactObj[n];
var parentn = ContactRec.City;
var childn = ContactRec.FullName;
if (parentn == 'null') { parentn = '#City' };
if (parentn == 'undefined') { parentn = '#City' };
//clean the contents
childn = childn.split('-').join(' ');
parentn = parentn.split('-').join(' ');
// the child relationship used parent name and child name
rec = {};
rec.name = childn;
rec.parent = parentn;
data.push(rec);
//build up on all parents, we want to ensure that all parents are covered
parents.set(parentn,parentn);
//build up all kids, we want to ensure that nothing gets missed
//we will compare parents to kids to establish linkages
kids.set(childn, parentn);
};
//now we compare parents to kids, any parent not on kids
//will be added to the collection to ensure all bases are covered
for (var key of parents.keys()) {
if (kids.has(key)) {
//this parent is also a kid, then everything is fine
} else {
//this parent is not a kid, add to data collection
if (key != '#City') {
rec = {};
rec.name = key;
rec.parent = '#City';
data.push(rec);
}
}
}
//add the parent node, make it # for sorting purposes
rec = {};
rec.name = '#City';
rec.parent = null;
data.push(rec);
//create a name based map for the nodes
var dataMap = data.reduce(function(map, node) {
map[node.name] = node;
return map;
}, {});
//iteratively add each child to its parent
var treeData = [];
data.forEach(function(node) {
// add to parent
var parent = dataMap[node.parent];
if (parent) {
// create child array if it doesn't exist
(parent.children || (parent.children = []))
// add node to child array
.push(node);
} else {
// parent is null or missing
treeData.push(node);
}
});
//draw the d3 tree
DrawTree(treeData, '#ContactMindCity');
};
}).fail(function (err) {
});
};
// save the defined Add page object to SQL
// add a new record to SQL storage.
app.addContact = function (ContactRec) {
// define a record object to store the current details
var FullName = ContactRec.FullName;
// cleanse the record key of spaces.
FullName = FullName.split(' ').join('-');
ContactRec.FullName = FullName;
// store the json object in the database
$.when(SqlInsertRecord(dbAddressBook, "Contact", ContactRec)).done(function () {
//show a toast message that the record has been saved
toastr.success('Contact record successfully saved.', 'Address Book');
//find which page are we coming from, if from sign in go back to it
var pgFrom = $('#pgAddContact').data('from');
switch (pgFrom) {
case "pgSignIn":
$.mobile.changePage('#pgSignIn', {transition: pgtransition});
break;
default:
// clear the edit page form fields
pgAddContactClear();
//stay in the same page to add more records
}
}).fail(function (err) {
//show a toast message that the record has not been saved
toastr.success('Contact record NOT successfully saved.', 'Address Book');
});
};
// save the defined Edit page object to SQL
//update an existing record and save to SQL
app.updateContact = function (ContactRec) {
// lookup specific Contact
var FullName = ContactRec.FullName;
//cleanse the key of spaces
FullName = FullName.split(' ').join('-');
//define the record to update
var ContactUpdate = {};
ContactUpdate.FullName = FullName;
$.when(SqlUpdateRecordWhere(dbAddressBook, "Contact", ContactRec, ContactUpdate)).done(function () {
//record has been saved
toastr.success('Contact record updated.', 'Address Book');
// clear the edit page form fields
pgEditContactClear();
// show the records listing page.
$.mobile.changePage('#pgContact', {transition: pgtransition});
}).fail(function (err) {
toastr.error('Contact record not updated, please try again.', 'Address Book');
return;
});
};
// delete record from SQL
//delete a record from SQL using record key
app.deleteContact = function (FullName) {
FullName = FullName.split(' ').join('-');
//define the record to delete
var ContactDelete = {};
ContactDelete.FullName = FullName;
$.when(SqlDeleteRecordWhere(dbAddressBook, "Contact", ContactDelete)).done(function () {
//record has been deleted
toastr.success('Contact record deleted.', 'Address Book');
// show the page to display after a record is deleted, this case listing page
$.mobile.changePage('#pgContact', {transition: pgtransition});
}).fail(function (err) {
toastr.error('Contact record not deleted, please try again.', 'Address Book');
return;
});
};
// display existing records in listview of Records listing.
//***** List Page *****
//display records in listview during runtime.
app.displayContact = function (ContactObj) {
// create an empty string to contain html
var html = '';
// make sure your iterators are properly scoped
var n;
// loop over records and create a new list item for each
//append the html to store the listitems.
for (n in ContactObj) {
//get the record details
var ContactRec = ContactObj[n];
// clean the primary key
var pkey = ContactRec.FullName;
pkey = pkey.split('-').join(' ');
ContactRec.FullName = pkey;
//define a new line from what we have defined
var nItem = ContactLi;
nItem = nItem.replace(/Z2/g,n);
//update the title to display, this might be multi fields
var nTitle = '';
//assign cleaned title
nTitle = n.split('-').join(' ');
//replace the title;
nItem = nItem.replace(/Z1/g,nTitle);
//there is a description, update the list item
var nDescription = '';
nDescription += ContactRec.Company;
nDescription += ', ';
nDescription += ContactRec.JobTitle;
nDescription += ', ';
nDescription += ContactRec.EmailAddress;
//replace the description;
nItem = nItem.replace(/DESCRIPTION/g,nDescription);
html += nItem;
}
//update the listview with the newly defined html structure.
$('#pgContactList').html(ContactHdr + html).listview('refresh');
};
// check SQL for Records. This initializes SQL if there are no records
//display records if they exist or tell user no records exist.
app.checkForContactStorage = function () {
//get records from SQL.
//when returned, parse then as json object
var ContactObj = {};
$.when(SqlGetRecords(dbAddressBook, "Contact", "FullName")).done(function (dta) {
// return json object of all records
ContactObj = ResultSetToJSON(dta, "FullName");
// are there existing Contact records?
if (!$.isEmptyObject(ContactObj)) {
// yes there are. pass them off to be displayed
app.displayContact(ContactObj);
} else {
// nope, just show the placeholder
$('#pgContactList').html(ContactHdr + noContact).listview('refresh');
}
}).fail(function (err) {
//just show the placeholder
$('#pgContactList').html(ContactHdr + noContact).listview('refresh');
});
};
// ***** Edit Page *****
// clear the contents of the Edit Page controls
//clear the form controls for data entry
function pgEditContactClear() {
$('#pgEditContactFullName').val('');
$('#pgEditContactCompany').val('');
$('#pgEditContactJobTitle').val('');
$('#pgEditContactEmailAddress').val('');
$('#pgEditContactBusinessPhone').val('');
$('#pgEditContactBusinessFax').val('');
$('#pgEditContactMobilePhone').val('');
$('#pgEditContactHomePhone').val('');
$('#pgEditContactStreetAddress1').val('');
$('#pgEditContactStreetAddress2').val('');
$('#pgEditContactCity').val('');
$('#pgEditContactState').val('');
$('#pgEditContactProvince').val('');
$('#pgEditContactPostalCode').val('');
}
// get the contents of the edit screen controls and store them in an object.
//get the record to be saved and put it in a record array
//read contents of each form input
function pgEditContactGetRec() {
//define the new record
var ContactRec
ContactRec = {};
ContactRec.FullName = $('#pgEditContactFullName').val().trim();
ContactRec.Company = $('#pgEditContactCompany').val().trim();
ContactRec.JobTitle = $('#pgEditContactJobTitle').val().trim();
ContactRec.EmailAddress = $('#pgEditContactEmailAddress').val().trim();
ContactRec.BusinessPhone = $('#pgEditContactBusinessPhone').val().trim();
ContactRec.BusinessFax = $('#pgEditContactBusinessFax').val().trim();
ContactRec.MobilePhone = $('#pgEditContactMobilePhone').val().trim();
ContactRec.HomePhone = $('#pgEditContactHomePhone').val().trim();
ContactRec.StreetAddress1 = $('#pgEditContactStreetAddress1').val().trim();
ContactRec.StreetAddress2 = $('#pgEditContactStreetAddress2').val().trim();
ContactRec.City = $('#pgEditContactCity').val().trim();
ContactRec.State = $('#pgEditContactState').val().trim();
ContactRec.Province = $('#pgEditContactProvince').val().trim();
ContactRec.PostalCode = $('#pgEditContactPostalCode').val().trim();
return ContactRec;
}
// display content of selected record on Edit Page
//read record from SQL and display it on edit page.
app.editContact = function (FullName) {
FullName = FullName.split(' ').join('-');
//define the record to seek
var ContactSeek = {};
var ContactRec = {};
ContactSeek.FullName = FullName;
//search for the record from SQL
$.when(SqlGetRecordWhere(dbAddressBook, "Contact", ContactSeek)).done(function (dta) {
//record has been returned
ContactRec = ResultSetToJSON(dta, "FullName");
ContactRec = ContactRec[FullName];
//this record does not exist anymore, tell user
if (ContactRec == undefined) {
$('#alertboxheader h1').text('Contact Error');
$('#alertboxtitle').text(FullName.split('-').join(' '));
$('#alertboxprompt').text('This record does no longer exist, it might have been deleted!');
$('#alertboxok').data('topage', 'pgEditContact');
$('#alertboxok').data('id', FullName.split(' ').join('-'));
$.mobile.changePage('#alertbox', {transition: 'pop'});
return;
};
//make the record key read only
$('#pgEditContactFullName').attr('readonly', 'readonly');
//ensure the record key control cannot be clearable
$('#pgEditContactFullName').attr('data-clear-btn', 'false');
//update each control in the Edit page
//clean the primary key
var pkey = ContactRec.FullName;
pkey = pkey.split('-').join(' ');
ContactRec.FullName = pkey;
$('#pgEditContactFullName').val(ContactRec.FullName);
$('#pgEditContactCompany').val(ContactRec.Company);
$('#pgEditContactJobTitle').val(ContactRec.JobTitle);
$('#pgEditContactEmailAddress').val(ContactRec.EmailAddress);
$('#pgEditContactBusinessPhone').val(ContactRec.BusinessPhone);
$('#pgEditContactBusinessFax').val(ContactRec.BusinessFax);
$('#pgEditContactMobilePhone').val(ContactRec.MobilePhone);
$('#pgEditContactHomePhone').val(ContactRec.HomePhone);
$('#pgEditContactStreetAddress1').val(ContactRec.StreetAddress1);
$('#pgEditContactStreetAddress2').val(ContactRec.StreetAddress2);
$('#pgEditContactCity').val(ContactRec.City);
$('#pgEditContactState').val(ContactRec.State);
$('#pgEditContactProvince').val(ContactRec.Province);
$('#pgEditContactPostalCode').val(ContactRec.PostalCode);
}).fail(function (err) {
$('#alertboxheader h1').text('Contact Error');
$('#alertboxtitle').text(FullName.split('-').join(' '));
$('#alertboxprompt').text('An error was encountered trying to read this record, please try again!');
$('#alertboxok').data('topage', 'pgEditContact');
$('#alertboxok').data('id', FullName.split(' ').join('-'));
$.mobile.changePage('#alertbox', {transition: 'pop'});
return;
});
};
// ***** Add Page *****
// get the contents of the add screen controls and store them in an object.
//get the record to be saved and put it in a record array
//read contents of each form input
function pgAddContactGetRec() {
//define the new record
var ContactRec
ContactRec = {};
ContactRec.FullName = $('#pgAddContactFullName').val().trim();
ContactRec.Company = $('#pgAddContactCompany').val().trim();
ContactRec.JobTitle = $('#pgAddContactJobTitle').val().trim();
ContactRec.EmailAddress = $('#pgAddContactEmailAddress').val().trim();
ContactRec.BusinessPhone = $('#pgAddContactBusinessPhone').val().trim();
ContactRec.BusinessFax = $('#pgAddContactBusinessFax').val().trim();
ContactRec.MobilePhone = $('#pgAddContactMobilePhone').val().trim();
ContactRec.HomePhone = $('#pgAddContactHomePhone').val().trim();
ContactRec.StreetAddress1 = $('#pgAddContactStreetAddress1').val().trim();
ContactRec.StreetAddress2 = $('#pgAddContactStreetAddress2').val().trim();
ContactRec.City = $('#pgAddContactCity').val().trim();
ContactRec.State = $('#pgAddContactState').val().trim();
ContactRec.Province = $('#pgAddContactProvince').val().trim();
ContactRec.PostalCode = $('#pgAddContactPostalCode').val().trim();
return ContactRec;
}
// clear the contents of the Add page controls
//clear the form controls for data entry
function pgAddContactClear() {
$('#pgAddContactFullName').val('');
$('#pgAddContactCompany').val('');
$('#pgAddContactJobTitle').val('');
$('#pgAddContactEmailAddress').val('');
$('#pgAddContactBusinessPhone').val('');
$('#pgAddContactBusinessFax').val('');
$('#pgAddContactMobilePhone').val('');
$('#pgAddContactHomePhone').val('');
$('#pgAddContactStreetAddress1').val('');
$('#pgAddContactStreetAddress2').val('');
$('#pgAddContactCity').val('');
$('#pgAddContactState').val('');
$('#pgAddContactProvince').val('');
$('#pgAddContactPostalCode').val('');
}

app.init();
})(AddressBook);
});
