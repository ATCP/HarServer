<?php

$dir = date("Y-m-d");
$files = [];


// Open a known directory, and proceed to read its contents
if (is_dir($dir)) {
    if ($dh = opendir($dir)) {
        while (($file = readdir($dh)) !== false) {
	    if ($file != "." && $file != ".." /*&& is_dir($file)*/) {
		//echo "filename: $file" . "\n";
	        		
		if ($day = opendir($dir . '/' . $file)) {
		    while (($har = readdir($day)) !== false) {
			if ($har != "." && $har != ".." /*&& is_file($har)*/) {
			    array_push($files, $dir . "/" . $file . "/" . $har);  	
			}
		    }
		}
		
	    }
	}

	closedir($dh);

    }
}

//print_r($files);


?>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>HAR Viewer Test</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body class="harBody">
    <div id="content" version="@VERSION@"></div>
    <script src="scripts/jquery.js"></script>
    <script data-main="scripts/harViewer" src="scripts/require.js"></script>
    <script>
    $("#content").bind("onViewerInit", function(event) {	

        // Get application object
	var viewer = event.target.repObject;
	// Make sure stats and timeline is visible
	// to the user by default
	var preview = viewer.getTab("Preview");
	preview.showStats(true);
	preview.showTimeline(true);
	 
	var now = new Date();
	var logDir = now.getFullYear() + "-"+ now.getMonth() + "-" + now.getDay();

	var files = <?php echo json_encode($files);?>;
	console.dir(files);	
	
	for (var i = 0; i < files.length; i ++) {
	    viewer.loadHar(files[i]);
	    			
	}		 
		
    });
    </script>
    <link rel="stylesheet" href="css/harViewer.css" type="text/css"/>
</body>
</html>
