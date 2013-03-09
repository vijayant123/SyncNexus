<?php
ini_set(error_reporting(0));

include 'functions.php';

if ($hostCode = random(5)) {
    file_put_contents($tempPath . $hostCode, '');
    if (file_exists($tempPath . $hostCode))
        echo $hostCode;
    else
        echo - 1;
}
?>