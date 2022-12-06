<?php
header("Content-Type: text/plain");
header('Content-Disposition: attachment; filename="Super Mario World Level.txt"');
readfile($_GET['fname']);
unlink($_GET['fname']);
?>
