<?php

/**
 * @author vijayant
 * @copyright 2013
 * @uses responds to clients with clientKey
 */


$clientKey = $_REQUEST['clientKey'];
$timestamp = $_REQUEST['timestamp'];

if (isset($clientKey, $timestamp)) {
    if (file_exists('./temp/' . $clientKey)) {
        $file = file_get_contents('./temp/' . $clientKey);
        $a = explode(':', $file);
        if ($timestamp < $a[0]) {
            echo $file;
        } else {
            echo - 1;
        }
    } else {
        echo - 1;
    }
} else {
    echo - 1;
}


?>