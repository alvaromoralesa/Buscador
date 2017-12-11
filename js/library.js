$(function(){
  getCities(); //Obtener los valores de las ciudades e incluirlos en el campo select #selectCiudad
  getTipo(); //Obtener los valores de las ciudades e incluirlos en el campo select #selectTipo
  hideLoader();
})

function hideLoader(){
  $(".loader").fadeOut("slow");
}

$('#mostrarTodos').on('click', function(){
  $('.progress').show() //Mostrar la barra de progreso mientras se genera la búsqyeda
  buscarItem(false); //Pasar a la funcion buscarItem el parametro false para indicar que no se utilizará filtro
})

$('#formulario').on('submit', function(event){
  event.preventDefault(); //Prevenir que se ejecute la acción por defecto al hacer submit del formulario
  $('.progress').show() //Mostrar la barra de progreso mientras se genera la búsqyeda
  buscarItem(true); //Pasar a la funcion buscarItem el parametro false para indicar que se utilizará filtro
})

/*Lenar los input select con los valores correspondientes*/
function getCities(){ //Agregar las ciudades al input selectCiudad
  $.ajax({
    url:'./cities.php', //Realizar consulta al archivo cities.php
    type: 'GET', //Utilizar el metodo GET para obtener la infomación
    data:{}, //no enviar parámetros para la consulta
    success:function(cityList){   //Acciones a realizar si la ejecución es exitosa
      cityList = validateJson(cityList, 'Ciudad')
      $.each(cityList, function( index, value ) { //Recorrer el array y agregar los valores al input select
        $('#selectCiudad').append('<option value="'+value+'">'+value+'</option>')  //Aagregar los valores al input select
      });
    }
  }).done(function(){
    $('select').material_select();///Una vez completada la funcion anterior enderizar el campo select
  })
}

function getTipo(){ //Agregar el tipo de item al input selectTipo
  $.ajax({
    url:'./tipo.php', //Realizar consulta al archivo tipo.php
    type: 'GET', //Utilizar el metodo GET para obtener la infomación
    data:{}, //no enviar parámetros para la consulta
    success:function(tipoList){ //Acciones a realizar si la ejecución es exitosa
      tipoList = validateJson(tipoList, 'Tipo')
      $.each(tipoList, function( index, value ) { //Recorrer el array
        $('#selectTipo').append('<option value="'+value+'">'+value+'</option>')  //Aagregar los valores al input select
      });
    },
  }).done(function(){
    $('select').material_select(); //Una vez completada la funcion anterior Renderizar el campo select
  })
}

function validateJson(validateJson, lista){
  try { //Validar la informacion como formato json
    var validateJson = JSON.parse(validateJson) //Analizar la cadena de texto como JSON
    return validateJson
  } catch (e) {
    getError('','SyntaxError '+lista); //Mostrar mensaje de error si existe error obteniendo la información
    //$('#error p').after("<p>"+getError('','SyntaxError '+lista)+"</p><br>")
    }
}

function buscarItem(filter){
  if($('.colContenido > .item') != 0){ //Verificar que no se haya realiado una consulta previamente
    $('.colContenido > .item').detach() //De haber items en la lista, eliminarlos con la función detach para evitar perder las propiedades de los objetos
  }
  var filtro = getFiltros(filter)
  $.ajax({
    url:'./buscador.php', //Realizar consulta al archivo buscador.php
    type: 'GET', //Utilizar el metodo GET para obtener la infomación
    data:{filtro}, //Enviar la información de los filtros.
    success:function(items, textStatus, errorThrown ){ //Acciones a realizar si la ejecución es exitosa
      /*Validar que no existan errores en la información enviada al servidor
      y esta sea convertida correctamente en formato JSON*/
      try {
        item = JSON.parse(items); //Analizar la cadena de texto como JSON
      } catch (e) {
        getError(500,'SyntaxError'); //Mostrar mensaje de error si existe error obteniendo la información
      }

      $.each(item, function(index, item){ //Recorrer el objeto y agregarlos al con clase .colContenido
        $('.colContenido').append( //Anexar los items que correspondan al filtro consultado
          '<div class="col s12 item">'+
            '<div class="card itemMostrado">'+
              '<img src="./img/home.jpg">'+
                '<div class="card-stacked">'+
                  '<div class="card-content">'+
                    '<p><b>Direccion: </b>'+item.Direccion+'</p>'+ //Obtener el valor de la propiedad Direccion del objeto
                    '<p><b>Ciudad: </b>'+item.Ciudad+'</p>'+ //Obtener el valor de la propiedad Ciudad del objeto
                    '<p><b>Teléfono: </b>'+item.Telefono+'</p>'+ //Obtener el valor de la propiedad Teléfono del objeto
                    '<p><b>Código postal: </b>'+item.Codigo_Postal+'</p>'+ //Obtener el valor de la propiedad Código Postal del objeto
                    '<p><b>Tipo: </b>'+item.Tipo+'</p>'+ //Obtener el valor Tipo del  objeto
                    '<p><b>Precio: </b><span class="precioTexto">'+item.Precio+'</span></p>'+ //Obtener el valor de la propiedad Precio del objeto
                  '</div>'+
                  '<div class="card-action">'+
                    '<a href="#">Ver más</a>'+
                  '</div>'+
                '</div>'+
            '</div>'+
          '</div>'
        )
      })
    },
  }).done(function(){ //Acciones a realizar si la información fue procesada correcatmente
    var totalItems = $('.colContenido > .item').length //Contar cuantos items devuelve la consulta
    $('.tituloContenido.card > h5').text("Resultados de la búsqueda: "+ totalItems + " items" ) //Mostrar la cantidad de items devueltos por la consulta
    $('.progress').hide() //Ocultar la barra de progreso de busqueda
  }).fail(function( jqXHR, textStatus, errorThrown ){ //Acciones a realizar si existen errores en el envío de la información
      getError(jqXHR, textStatus) //Mostrar mensaje de error al usuario
  })
}

function getFiltros(filter){
  var rango = $('#rangoPrecio').val(), //Obtener los valores maximos y minimos del input
  rango = rango.split(";") //separar los valores en un array

  if (filter == false){ //Verificar si no se aplicaran filtros Asignar valores vacios
    var getCiudad = '',
        getTipo = '',
        getPrecio = ''
  }else{
    var getPrecio = rango, //Asignar el valor del rango de precios
        getCiudad = $('#selectCiudad option:selected').val(), //Asignar el valor de la ciudad seleccionada
        getTipo = $('#selectTipo option:selected').val() //Asignar el valor del tipo seleccionado
  }

    var filtro = { //Crear el objeto filtro con los calores respectivos
      Precio:getPrecio,
      Ciudad: getCiudad,
      Tipo: getTipo
    }

  return filtro; //Devolver el objeto filtro
}

function getError(jqXHR, textStatus){ //Función encargada de verificar los errores generados en la consulta
  var error = ""

  if (jqXHR.status === 0) {
    error =  ('No hay coneccion con el servidor: Verifique su red.');

  } else if (jqXHR.status == 404) {
    error =  ('Página solicitada no encontrada.');

  } else if (jqXHR.status == 500) {
    error =  ('Error Interno del servidor.');

  } else if (textStatus === 'parsererror') {
    error =  ('Error de análisis de formato JSON.');

  } else if (textStatus === 'SyntaxError') {
    error =  ('SyntaxError: JSON.parse: unexpected character at line 2 column 1 of the JSON data');

  } else if (textStatus === 'SyntaxError Tipo') {
    error =  ('Error obteniendo la información de la <b>Listas  de Selección Tipo</b>.<br><small> SyntaxError: JSON.parse: unexpected character at line 2 column 1 of the JSON data</small><br>');

  } else if (textStatus === 'SyntaxError Ciudad') {
    error =  ('Error obteniendo la información de la <b>Listas  de Selección Ciudad</b>.<br><small> SyntaxError: JSON.parse: unexpected character at line 2 column 1 of the JSON data</small><br>');

  } else if (textStatus === 'timeout') {
    error =  ('Tiempo de respuesta agotado.');

  } else if (textStatus === 'abort') {
    error =  ('Solicitud AJAX abortada.');

  } else {
    error =  ('Error Inesperado: ' + jqXHR.responseText);
  }

  $('#error p').html(error) //Modidicar el contenido de la descripción de modal error
  $('#error h2').text("Error:" + jqXHR.status) //Modificar el contenido del Titulo del modal error
  $('#error').openModal() //Abrir el modal Error
  $('.progress').hide() //Ocultar la barra de progreso de busqueda
}
