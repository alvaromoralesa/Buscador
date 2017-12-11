<?php
  require('./library.php'); //Incluir el archivo library.php. De no existir generar error grave
  $getData = readData(); //Leer la informacion del archivo json.
  getCities($getData) //Ejecutar la funcion getCities para obtener las ciudades
 ?>
