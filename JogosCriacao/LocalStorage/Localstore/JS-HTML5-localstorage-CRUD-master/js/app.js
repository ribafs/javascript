/**
 * Initiate the app at the beginning
 */
(function mounted() {
    getTableData();
    $("#d_o_b").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: '1975:2000',
    });
    $("#edit_d_o_b").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: '1975:2000',
    })
})();

/**
 * Generating unique ID for new Input
*/
function guid() {
    return parseInt(Date.now() + Math.random());
}

/**
 * Create and Store New Member
 */
function saveMemberInfo() {
    var keys = ['first_name', 'last_name', 'email', 'd_o_b', 'designation'];
    var obj = {};

    keys.forEach(function (item, index) {
        var result = document.getElementById(item).value;
        if (result) {
            obj[item] = result;
        }
    })

    var members = getMembers();

    if (!members.length) {
        $('.show-table-info').addClass('hide');
    }

    if (Object.keys(obj).length) {
        var members = getMembers();
        obj.id = guid();
        members.push(obj);
        var data = JSON.stringify(members);
        localStorage.setItem("members", data);
        clearFields();
        obj.d_o_b = calculateAge(obj.d_o_b);
        insertIntoTableView(obj, getTotalRowOfTable());
        $('#addnewModal').modal('hide')
    }
}

/**
 * Clear Create New Member Form Data0
 */
function clearFields() {
    $('#input_form')[0].reset();
}

/** 
 * Get All Members already stored into the local storage
*/
function getMembers() {
    var memberRecord = localStorage.getItem("members");
    var members = [];
    if (!memberRecord) {
        return members;
    } else {
        members = JSON.parse(memberRecord);
        return members;
    }
}

/**
 * Format Age of All Members
 */
function getFormattedMembers() {
    var members = getMembers();

    members.forEach(function (item, index) {
        item.d_o_b = calculateAge(item.d_o_b);
    });

    return members;

}


/**
 * Calculate Age in current date from birthdate 
 * 
 * @param {string} date 
 */
function calculateAge(date) {
    var today = new Date();
    var birthDate = new Date(date);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}


/**
 * Populating Table with stored data
 */
function getTableData() {
    $("#member_table").find("tr:not(:first)").remove();

    var searchKeyword = $('#member_search').val();
    var members = getFormattedMembers();

    var filteredMembers = members.filter(function (item, index) {
        return item.first_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.last_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.designation.toLowerCase().includes(searchKeyword.toLowerCase())
    });

    if (!filteredMembers.length) {
        $('.show-table-info').removeClass('hide');
    } else {
        $('.show-table-info').addClass('hide');
    }

    filteredMembers.forEach(function (item, index) {
        insertIntoTableView(item, index + 1);
    })
}

/**
 * Inserting data into the table of the view
 * 
 * @param {object} item 
 * @param {int} tableIndex 
 */
function insertIntoTableView(item, tableIndex) {
    var table = document.getElementById('member_table');
    var row = table.insertRow();
    var idCell = row.insertCell(0);
    var firstNameCell = row.insertCell(1);
    var lastNameCell = row.insertCell(2);
    var emailCell = row.insertCell(3);
    var dateOfBirthCell = row.insertCell(4);
    var designationCell = row.insertCell(5);
    var actionCell = row.insertCell(6);
    
    idCell.innerHTML = tableIndex;
    firstNameCell.innerHTML = item.first_name;
    lastNameCell.innerHTML = item.last_name;
    emailCell.innerHTML = item.email;
    dateOfBirthCell.innerHTML = item.d_o_b;
    designationCell.innerHTML = '<a class="tag">'+item.designation+'</a>'
    var guid = item.id;

    actionCell.innerHTML = '<button class="btn btn-sm btn-default" onclick="showMemberData(' + guid + ')">View</button> ' +
        '<button class="btn btn-sm btn-primary" onclick="showEditModal(' + guid + ')">Edit</button> ' +
        '<button class="btn btn-sm btn-danger" onclick="showDeleteModal(' + guid + ')">Delete</button>';
}


/**
 * Get Total Row of Table
 */
function getTotalRowOfTable() {
    var table = document.getElementById('member_table');
    return table.rows.length;
}

/**
 * Show Single Member Data into the modal
 * 
 * @param {string} id 
 */
function showMemberData(id) {
    var allMembers = getMembers();
    var member = allMembers.find(function (item) {
        return item.id == id;
    })

    $('#show_first_name').val(member.first_name);
    $('#show_last_name').val(member.last_name);
    $('#show_email').val(member.email);
    $('#show_d_o_b').val(member.d_o_b);
    $('#show_designation').val(member.designation);

    $('#showModal').modal();

}


/**
 * Show Edit Modal of a single member
 * 
 * @param {string} id 
 */
function showEditModal(id) {
    var allMembers = getMembers();
    var member = allMembers.find(function (item) {
        return item.id == id;
    })

    $('#edit_first_name').val(member.first_name);
    $('#edit_last_name').val(member.last_name);
    $('#edit_email').val(member.email);
    $('#edit_d_o_b').val(member.d_o_b);
    $('#edit_designation').val(member.designation);
    $('#member_id').val(id);

    $('#editModal').modal();
}


/**
 * Store Updated Member Data into the storage
*/
function updateMemberData() {

    var allMembers = getMembers();
    var memberId = $('#member_id').val();

    var member = allMembers.find(function (item) {
        return item.id == memberId;
    })

    member.first_name = $('#edit_first_name').val();
    member.last_name = $('#edit_last_name').val();
    member.email = $('#edit_email').val();
    member.d_o_b = $('#edit_d_o_b').val();
    member.designation = $('#edit_designation').val();

    var data = JSON.stringify(allMembers);
    localStorage.setItem('members', data);

    $("#member_table").find("tr:not(:first)").remove();
    getTableData();
    $('#editModal').modal('hide')
}

/**
 * Show Delete Confirmation Dialog Modal
 * 
 * @param {int} id 
 */
function showDeleteModal(id) {
    $('#deleted-member-id').val(id);
    $('#deleteDialog').modal();
}

/**
 * Delete single member
*/
function deleteMemberData() {
    var id = $('#deleted-member-id').val();
    var allMembers = getMembers();

    var storageUsers = JSON.parse(localStorage.getItem('members'));

    var newData = [];

    newData = storageUsers.filter(function (item, index) {
        return item.id != id;
    });

    var data = JSON.stringify(newData);

    localStorage.setItem('members', data);
    $("#member_table").find("tr:not(:first)").remove();
    $('#deleteDialog').modal('hide');
    getTableData();

}

/**
 * Sorting table data through type, e.g: first_name, email, last_name etc.
 * 
 * @param {string} type 
 */
function sortBy(type)
{
    $("#member_table").find("tr:not(:first)").remove();

    var totalClickOfType = parseInt(localStorage.getItem(type));
    if(!totalClickOfType) {
        totalClickOfType = 1;
        localStorage.setItem(type, totalClickOfType);
    } else {
        if(totalClickOfType == 1) {
            totalClickOfType = 2;
        } else {
            totalClickOfType = 1;
        }
        localStorage.setItem(type, totalClickOfType);
    }

    var searchKeyword = $('#member_search').val();
    var members = getFormattedMembers();

    var sortedMembers = members.sort(function (a, b) {
        return (totalClickOfType == 2) ? a[type] > b[type] : a[type] < b[type];
    });

    sortedMembers.forEach(function (item, index) {
        insertIntoTableView(item, index + 1);
    })
}