<html><head><title>ribafs.net - Tutoriais</title></head>
<body bgcolor='#FFFACD'>
<h2 align=center><a href="http://ribafs.net">http://ribafs.net - <?php echo date('d/m/Y H:i:s'); ?></a></h2>

<?php
$dn = opendir (dirname(__FILE__));
$exclude = array("index.php", ".", "..");

// adiciona os arquivos ao array $arquivos
while($fn = readdir($dn)) {
	if ($fn == $exclude[0] || $fn == $exclude[1] || $fn == $exclude[2]) continue;
	$arquivos[] = $fn;
}
// ordena o vetor
sort($arquivos);
// exibe os arquivos

foreach ($arquivos as $arquivo)

if (is_dir($arquivo)){
	$dir .= "<img src='/imagens/diretorio.png'>&nbsp;<a href='$arquivo'>$arquivo</a><br>";
}else{
	$tamanho = filesize($arquivo);
	$m = 'bytes';
	if ($tamanho>1024) {
		$tamanho=round($tamanho/1024,2);
		$m = 'KB';
	} elseif($tamanho > 1024*1024){
		$tamanho = round(($tamanho/1024)/1024,2);
		$m = 'MB';
	}
	$arq .= "<img src='/imagens/arquivo.png'>&nbsp;<a href='$arquivo'>$arquivo</a> - $tamanho $m<br>";
}
echo $dir . $arq;

closedir($dn);
?>
