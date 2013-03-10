<?php

/**
 * @author vijayant
 * @copyright 2013
 * @uses accepts broadcast signals from hosts and puts the data in hosts' file
 */

$hostKey = $_REQUEST['hostKey'];
$timestamp = $_REQUEST['timestamp'];
$vlcPos = $_REQUEST['vlcPos'];
$vlcState = $_REQUEST['vlcState'];

if (isset($hostKey, $timestamp, $vlcPos, $vlcState)) {
    if (file_exists('./temp/' . $hostKey) && $timestamp > time()) {
        file_put_contents('./temp/' . $hostKey, $timestamp . ':' . $vlcPos . ':' . $vlcState);
        echo 1;
    } else {
        echo - 1;
    }
} else {
    echo - 1;
}


?>