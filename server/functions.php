<?php

/**
 * @author vijayant
 * @copyright 2013
 * @uses Functions t be used in the site
 */

$tempPath = './temp/';

function random($length) {
	$random = "";
	srand((double)microtime() * 1000000);
	$char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	$char_list .= "123456789";
	// Add the special characters to $char_list if needed

	for ($i = 0; $i < $length; $i++) {
		$random .= substr($char_list, (rand() % (strlen($char_list))), 1);
	}
	return $random;
}
?>