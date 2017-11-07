<?php

$path = '2017-10-6';//date("Y-m-d");
$files = [];

if ($handle = opendir($path)) {
	
	while (false !== ($entry = readdir($handle))) {
		if ($entry != "." && $entry != "..") {
		    array_push($files, $entry);
		}
	}
   	closedir($handle);
}

?>

<!doctype html>
<html>
<head>
    <title>HTTP Archive Viewer 2.0.17</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" href="css/harViewer.css" type="text/css">
</head>
<body class="harBody">
    <div id="content" version="2.0.17"></div>
    <script src="scripts/jquery.js"></script>
    <script data-main="scripts/harViewer" src="scripts/require.js"></script>
    
<!-- Google Analytics -->
<script>
// Enable Google Analytics (for publicly hosted instances) in ant.properties file
// by setting GOOGLE-ANALYTICS-PROFILE property to ID of your profile.
var googleAnalyticsProfile = "";
if (googleAnalyticsProfile && googleAnalyticsProfile.charAt(0) !== "@") {

    window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
    ga('create', googleAnalyticsProfile, 'auto');
    ga('send', 'pageview');

}
$("#content").bind("onViewerPreInit", function(event) {	

        // Get application object
	var viewer = event.target.repObject;
	// Make sure stats and timeline is visible
	// to the user by default
	var preview = viewer.getTab("Preview");
	preview.showStats(true);
	preview.showTimeline(true);
	 
	var now = new Date();
	var logDir = now.getFullYear() + "-"+ now.getMonth() + "-" + now.getDay();
		
	//viewer.loadHar(logDir + '/73.103.90.173.61147/tab-200.har');
		
    });
    
</script>
<script async src='https://www.google-analytics.com/analytics.js'></script>
<!-- End Google Analytics -->

</body>
</html>
