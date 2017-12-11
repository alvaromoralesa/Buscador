<?php
/*Leer el archivo que contiene la informacion*/
function readData(){
  $data_file = fopen('./data-1.json', 'r'); //Abrir el archivo json
  $data = fread($data_file, filesize('./data-1.json')); //Leer el contenido del archivo y obtener su tamaño
  $data = json_decode($data, true); //Convertir el contenido en formato JSON
  fclose($data_file); //Cerrar el archivo para no consumir innecesariamente recursos del servidor
  return ($data);
};

/*Inicializar los input select*/
function getCities($getData){ //Opciones de ciudad
  $getCities = Array(); //Crear una matriz para evitar repetir ciudades
  foreach ($getData as $cities => $city) { //Recorrer la información
    if(in_array($city['Ciudad'], $getCities)){ //Verificar si el valor existe en el array
      //Continuar
    }else{
      array_push($getCities, $city['Ciudad']); //Agregar la ciudad a la matriz
    }
  }
  echo json_encode($getCities); //Devolver la matriz con los valores de las ciudades en formato JSON
}

function getTipo($getData){ //Opciones de Tipo
  $getTipo = Array(); //Crear una matriz donde se guardarán los valores de los tipos.
  foreach ($getData as $tipos => $tipo) { //Recorrer la información
    if(in_array($tipo['Tipo'], $getTipo)){ //Verificar si el valor existe en el array
      //Ciudad ya agregada. Continuar
    }else{
      array_push($getTipo, $tipo['Tipo']); //Agregar la ciudad a la matriz
    }
  }
  echo json_encode($getTipo); //Devolver la matriz con los valores de los tipos en formato JSON
}

/*Filtrar la información*/
function filterData($filtroCiudad, $filtroTipo, $filtroPrecio,$data){
  $itemList = Array(); //Crear una matriz donde se guardarán los valores de los tipos.
  if($filtroCiudad == "" and $filtroTipo=="" and $filtroPrecio==""){ //Si se presiona el boton mostrar todos
    foreach ($data as $index => $item) {
      array_push($itemList, $item); //Agregar los valores obtenidos al vector items
    }
  }else{ //Si se presiona el boton buscar. NOTA: El campo precio siempre tendra un valor.

    $menor = $filtroPrecio[0]; //Obtener el valor menor del rango de precios
    $mayor = $filtroPrecio[1]; //Obtener el valor mayor del rango de precios

      if($filtroCiudad == "" and $filtroTipo == ""){ //Verificar que los filtros ciudad y tipo estén vacios
        foreach ($data as $items => $item) {
            $precio = precioNumero($item['Precio']);
        if ( $precio >= $menor and $precio <= $mayor){ //Comparar si el precio se encuentra dentro de los valores del filtro
            array_push($itemList,$item ); //Devolver el objeto cuyo precio se encuentra dentro del rango establecido.
          }
        }
      }

      if($filtroCiudad != "" and $filtroTipo == ""){ //Comparar si el precio se encuentra dentro de los valores del filtro
          foreach ($data as $index => $item) {
            $precio = precioNumero($item['Precio']);
            if ($filtroCiudad == $item['Ciudad'] and $precio > $menor and $precio < $mayor){ //Comparar si el precio se encuentra dentro de los valores del filtro
              array_push($itemList,$item ); //Devolver el objeto cuyo precio se encuentra dentro del rango establecido.
            }
        }
      }

      if($filtroCiudad == "" and $filtroTipo != ""){ //Comparar si el precio se encuentra dentro de los valores del filtro
          foreach ($data as $index => $item) {
            $precio = precioNumero($item['Precio']);
            if ($filtroTipo == $item['Tipo'] and $precio > $menor and $precio < $mayor){ //Comparar si el precio se encuentra dentro de los valores del filtro
              array_push($itemList,$item ); //Devolver el objeto cuyo precio se encuentra dentro del rango establecido.
            }
        }
      }

      if($filtroCiudad != "" and $filtroTipo != ""){ //Comparar si el precio se encuentra dentro de los valores del filtro
          foreach ($data as $index => $item) {
            $precio = precioNumero($item['Precio']);
            if ($filtroTipo == $item['Tipo'] and $filtroCiudad == $item['Ciudad'] and $precio > $menor and $precio < $mayor){ //Comparar si el precio se encuentra dentro de los valores del filtro
              array_push($itemList,$item ); //Devolver el objeto cuyo precio se encuentra dentro del rango establecido.
            }
        }
      }


  }
  echo json_encode($itemList); //Devolver el arreglo en formato JSON
};

function precioNumero($itemPrecio){ //Convertir la cadena de caracteres en numero
  $precio = str_replace('$','',$itemPrecio); //Eliminar el símbolo Dolar
  $precio = str_replace(',','',$precio); //Eliminar la coma (separador de miles)
  return $precio; //Devolver el falor de tipo Numero
}
?>
