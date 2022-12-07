// variables for database table maintenance
var DB_REAL = "REAL";
var DB_INTEGER = "INTEGER";
var DB_BLOB = "BLOB";
var DB_TEXT = "TEXT";
var DB_FLOAT = "FLOAT";
var DB_NUMERIC = "NUMERIC";

function Split(str, del) {
	// split a string into an array
    if (!del || del === null || del === "") {
        del = " ";
	}
    if (del !== "") {
        return str.split(del);
	}
}

function Left(str, n) {
	// return a left part of a string
    var s = str + '';
    var iLen = s.length;
    if (n <= 0) {
        return "";
		} else if (n >= iLen) {
        return str;
		} else {
        return s.substr(0, n);
	}
}

function Len(str) {
	// return the length of a string
    if (typeof (str) === 'object') {
        return str.length;
	}
    str += '';
    return str.length;
}

function SqlOpenDb(shortName, version, displayName, maxSize) {
	// code to open the database and returns a variable, one can open different
	// databases, database size is 1MB, increase dbsize to <= 5
    var db, dbsize = 1;
    try {
        if (!window.openDatabase) {
            return 0;
	    } else {
        if (typeof (shortName) === 'undefined') {
            return 0;
		}
        if (typeof (version) === 'undefined') version = "";
        if (typeof (displayName) === 'undefined') displayName = shortName;
        if (typeof (maxSize) === 'undefined') maxSize = dbsize * (1024 * 1024);
        db = openDatabase(shortName, version, displayName, maxSize);
		}
	} catch (e) {
        return 0;
	}
    return db;
}

function SqlExecute(db, sqlList) {
	// code to execute array commands to the database
	// db is the variable holding the database reference
	// sqlList is an array of commands to execute
    db.transaction(function (transaction) {
		// loop through each sql command with success and error result
        for (var i = 0; i < sqlList.length; i++) {
            // create a new scope that holds sql for the error message, if needed
            (function (tx, sql) {
                if (typeof (sql) === 'string') sql = [sql];
                if (typeof (sql[1]) === 'string') sql[1] = [sql[1]];
                var args = (typeof (sql[1]) === 'object') ? sql.splice(1, 1)[0] : [];
                var sql_return = sql[1] || function () {};
                var sql_error = sql[2] || function () {};
				tx.executeSql(sql[0], args, sql_return, sql_error);
			}(transaction, sqlList[i]));
		}
	});
}

function SqlCreateTable(db, TableName, FieldsAndTypes, PrimaryKey, AutoIncrement) {
	// code to create a table in the websql database
	// fieldsandtypes is a json object
	// autoincrement is the field name to autoincrement
    var sb = "(";
    for (item in FieldsAndTypes) {
        sb += "[" + item + "] " + FieldsAndTypes[item];
        if (item == PrimaryKey) {
            sb += " NOT NULL PRIMARY KEY";
		}
        if (item == AutoIncrement) {
            sb += " AUTOINCREMENT";
		}
        sb += ", ";
	}
    sb = Left(sb, (Len(sb) - 2));
    sb += ")";
    sb = "CREATE TABLE IF NOT EXISTS [" + TableName + "] " + sb + ";";
    return Execute(db, sb);
}

function SqlInsertRecord(db, tblName, tblRecord) {
	// code to insert a record into the database
	// fields are passed as parameters
    var qry, flds = "", vals = "", avals = [];
	for (var key in tblRecord) {
		flds += "[" + key + "],";
		vals += "?,";
		avals.push(tblRecord[key]);
	}
	flds = Left(flds, Len(flds) - 1);
    vals = Left(vals, Len(vals) - 1);
    qry = "INSERT INTO [" + tblName + "] (" + flds + ") VALUES (" + vals + ");";
    return Execute(db, qry, avals);
}

function SqlCreateIndexes(db, TableName, Indexes) {
	// code to create table index in the database
    var sb, idef, sqlCreateIdx = [], idxname, spidx, idxtot, idxcnt, idx;
    spidx = Split(Indexes, ",");
    idxtot = spidx.length - 1;
    //define indexes to be created
    for (idxcnt = 0; idxcnt <= idxtot; idxcnt++) {
        idx = spidx(idxcnt);
        idxname = TableName + "_" + idx;
        idef = "CREATE INDEX IF NOT EXISTS [" + idxname + "] ON [" + TableName + "] ([" + idx + "]);";
        sqlCreateIdx[idxcnt] = idef;
	}
    SqlExecute(db, sqlCreateIdx);
}

function SqlUpdateRecordWhere(db, tblName, tblRecord, tblWhere) {
	// code to update a record on a database
	// tblRecord and tblWhere should be objects
    var qry = "", vals = "", wvals = "", avals = [];
    for (item in tblRecord) {
        vals += "[" + item + "] = ?,";
		avals.push(tblRecord[item]);
	}
    for (item in tblWhere) {
        wvals += "[" + item + "] = ? AND ";
		avals.push(tblWhere[item]);
	}
    vals = Left(vals, Len(vals) - 1);
    wvals = Left(wvals, Len(wvals) - 5);
    qry = "UPDATE [" + tblName + "] SET " + vals + " WHERE " + wvals + ";";
    return Execute(db, qry, avals);
}

function SqlGetRecordWhere(db, tblName, tblWhere) {
	// code to get a record from database using a where clause
	// tblWhere should be objects
    var qry = "", vals = "", avals = [];
    for (item in tblWhere) {
        vals += "[" + item + "] = ? AND ";
		avals.push(tblWhere[item]);
	}
    vals = Left(vals, Len(vals) - 5);
    qry = "SELECT * FROM [" + tblName + "] WHERE " + vals + ";";
    return Execute(db, qry, avals);
}

function SqlUpdateRecords(db, tblName, tblRecord) {
	// update all records of the table
	// using parameter values
    var vals = "", avals = [];
    for (item in tblRecord) {
        vals = vals + "[" + item + "] = ?,";
		avals.push(tblRecord[item]);
	}
    vals = Left(vals, Len(vals) - 1);
    var qry = "UPDATE [" + tblName + "] SET " + vals + ";";
    return Execute(db, qry, avals);
}

function Execute(db, qry, args){
	// execute a query against the database using defer
	if (typeof (args) === 'undefined') args = [];
    return $.Deferred(function (d) {
        db.transaction(function (tx) {
            tx.executeSql(qry, args, successWrapper(d), failureWrapper(d));
            });
        });
};

function SqlGetRecords(db, TableName, PrimaryKey) {
	// return all records from a table ordered by primary key
    var qry = "SELECT * FROM [" + TableName + "] ORDER BY [" + PrimaryKey +"]";
    return Execute(db, qry);
};

function SqlGetDistinctField(db, TableName, FldName) {
	// return distinct records from a table
    var qry = "SELECT DISTINCT [" + FldName + "] FROM [" + TableName + "] ORDER BY [" + FldName +"]";
    return Execute(db, qry);
};

function successWrapper(d) {
	// when sql query succeeds
    return (function (tx, data) {
        d.resolve(data)
    })
};

function failureWrapper(d) {
	// when sql query fails
    return (function (tx, error) {
    d.reject(error)
    })
};

function ResultSetToJSON(results, PrimaryKey) {
    // process data returned by successWrapper;
	// return it as a json object using primary key as key
    var Records = {};
    var len = results.rows.length - 1, priKey, i, row;
    // loop through each row
    for (i = 0; i <= len; i++) {
		// get the row
        row = results.rows.item(i);
		// get the primary key
        priKey = row[PrimaryKey];
		// cleanse the primary key
		priKey = priKey.split(' ').join('-');
		// set row to object using primary key
        Records[priKey] = row;
    }
    return Records;
}

function SqlDeleteRecordWhere(db, tblName, tblWhere) {
    // delete a record from a table using a where clause
	// pass the where fields as parameters
    var qry, wvals = "", avals = [];
    for (item in tblWhere) {
        wvals += "[" + item + "] = ? AND ";
		avals.push(tblWhere[item]);
	}
	// remove last ' AND '
    wvals = Left(wvals, Len(wvals) - 5);
    qry = "DELETE FROM [" + tblName + "] WHERE " + wvals + ";";
    return Execute(db, qry, avals);
};