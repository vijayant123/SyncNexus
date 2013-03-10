<?php
ini_set(error_reporting(0));

include 'functions.php';

if ($hostKey = random(5)) {
    file_put_contents('./temp/' . $hostKey, '');
    if (file_exists('./temp/' . $hostKey))
        echo $hostKey;
    else
        echo - 1;
}
?>