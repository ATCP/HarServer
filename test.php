<?php
$dir = "2017-10-6";
$files = [];


// Open a known directory, and proceed to read its contents
if (is_dir($dir)) {
    if ($dh = opendir($dir)) {
        while (($file = readdir($dh)) !== false) {
	    if ($file != "." && $file != ".." /*&& is_dir($file)*/) {
		echo "filename: $file" . "\n";
	        		
		if ($day = opendir($dir . '/' . $file)) {
		    while (($har = readdir($day)) !== false) {
			if ($har != "." && $har != ".." /*&& is_file($har)*/) {
			    array_push($files, $har);  	
			}
		    }
		}
		
	    }
	}

	closedir($dh);

    }
}

print_r($files);

?>
