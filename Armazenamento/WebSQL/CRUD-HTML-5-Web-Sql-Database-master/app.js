function Persona(id,nombre, apellidoPaterno,fecha,sexo){
	this.id = id;
	this.nombre = nombre;
	this.apellidoPaterno = apellidoPaterno;
	this.fecha = fecha;
	this.sexo = sexo;
}

$(document).ready(function(){
	var base = openDatabase('mybd','1.0','Base de datos',2 * 1024 * 1024);
	var sql = "CREATE TABLE IF NOT EXISTS persona(id integer primary key ";
		sql += "autoincrement,nombre,apellidoPaterno,fecha,sexo)";
	base.transaction(function(t){
		t.executeSql(sql);
	});

	mostrar(base);
	
	$("#guardar").click(function(){
		guardar(objeto(),base);
		mostrar(base);
		limpiar();
	});

	$("#actualizar").click(function(){
		actualizar(objeto(),base);
		limpiar();
		mostrar(base);
		
	});

	$("#cancelar").click(function(){
		limpiar();
		$("#guardar").css("display","block");
		$("#actualizar").css("display","none");
		$("#cancelar").css("display","none");
	});
	
});


function objeto(){
	var persona = new Persona(

		parseInt($("#id").val()),
		$("#nombre").val(),
		$("#apellido-paterno").val(),
		$("#fecha").val(),
		$("#sexo").val()
		);
	return persona;
}


function guardar(persona,base){
	if(persona.nombre != '' && persona.apellidoPaterno != '' && persona.fecha != ''){
		base.transaction(function(t){
			var sql = "INSERT INTO persona (nombre,apellidoPaterno,fecha,sexo)";
				sql += "VALUES (?,?,?,?)";
			t.executeSql(sql,
				[persona.nombre,persona.apellidoPaterno,persona.fecha,persona.sexo]
			);
		});
	}else{
		alert("Algunos campos son necesarios");
	}
}
function eliminar(id, base){
	base.transaction(function(t){
			t.executeSql("DELETE FROM persona WHERE id =" +id);
		});
}

function actualizar(persona,base){
	base.transaction(function(t){
		var sql = "UPDATE persona SET nombre = ?,apellidoPaterno = ?,";
			sql +="fecha = ?,sexo = ? WHERE id = ?";
			t.executeSql(sql,
				[persona.nombre,persona.apellidoPaterno,persona.fecha,persona.sexo,persona.id]
			);
		});
}

function mostrarId(id, base){
	base.transaction(function(t){
		t.executeSql("SELECT * FROM persona WHERE id="+id,[],function(t,resultado){
			$("#id").val(resultado.rows.item(0).id);
			$("#nombre").val(resultado.rows.item(0).nombre);
			$("#apellido-paterno").val(resultado.rows.item(0).apellidoPaterno);
			$("#fecha").val(resultado.rows.item(0).fecha);
			$("#sexo").empty();
			if(resultado.rows.item(0).sexo == 'Hombre'){
				$("#sexo").append($('<option></option>').attr('value', 'Hombre').text("Hombre"));
		    	$("#sexo").append($('<option></option>').attr('value', 'Mujer').text("Mujer"));
			}else{
		    	$("#sexo").append($('<option></option>').attr('value', 'Mujer').text("Mujer"));
		    	$("#sexo").append($('<option></option>').attr('value', 'Hombre').text("Hombre"));
			}
		    
		});
	});
}

function mostrar(base){
	base.transaction(function(t){
		t.executeSql("SELECT * FROM persona",[],function(t,resultado){
			var cabecera = "<tr>"+
					"<th>Id</th>"+
					"<th>Nombre</th>"+
					"<th>Apellido Paterno</th>"+
					"<th>Fecha Nacimiento</th>"+
					"<th>Sexo</th>"+
					"<th>Modificar</th>"+
					"<th>Eliminar</th>"+
				"</tr>";
			var cuerpo = "";
			for(var i = 0; i < resultado.rows.length; i++){
					cuerpo += "<tr>";
					cuerpo += "<td>" + resultado.rows.item(i).id + "</td>";
					cuerpo += "<td>" + resultado.rows.item(i).nombre + "</td>";
					cuerpo += "<td>" + resultado.rows.item(i).apellidoPaterno + "</td>";
					cuerpo += "<td>" + resultado.rows.item(i).fecha + "</td>";
					cuerpo += "<td>" + resultado.rows.item(i).sexo + "</td>";
					cuerpo += "<td><spam class='modificar' data-modificar='"+resultado.rows.item(i).id +"'>O</spam></td>";
					cuerpo += "<td><spam  class='eliminar' data-eliminar='"+resultado.rows.item(i).id +"'>X</spam></td>";
					cuerpo += "</tr>";
			}
			$("#personas").html(cabecera + cuerpo);
			$('.eliminar').click(function(){
				var confirmar = confirm("¿Desea eliminar?");
				if(confirmar == 1){
					eliminar($(this).attr('data-eliminar'),base);
					mostrar(base);
				}
			});

			$('.modificar').click(function(){
				
				mostrarId($(this).attr('data-modificar'),base);
				$("#guardar").css("display","none");
				$("#actualizar").css("display","block");
				$("#cancelar").css("display","block");
			});

		}); 
	});
}

function limpiar(){
	$("#id").val(''),
	$("#nombre").val(''),
	$("#apellido-paterno").val(''),
	$("#fecha").val(''),
	llenar_sexo();
}

function llenar_sexo(){
	$("#sexo").empty();
    $("#sexo").append($('<option></option>').attr('value', 'Hombre').text("Hombre"));
    $("#sexo").append($('<option></option>').attr('value', 'Mujer').text("Mujer"));
}