<?php

/**
 * @author vijayant
 * @copyright 2013
 * @uses checks clients key authenticity
 */

$key = $_REQUEST['key'];

if (isset($key) && strlen($key) == 5) {
    if (file_exists('./temp/' . $key)){
        echo 1;} else {
            echo "Client Key is WRONG";
        }
} else
    echo "Invalid Client Key";



?>