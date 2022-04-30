$(document).ready(()=>{
	console.log("test.js ready");
	var container = document.getElementById("container");
	var img = document.createElement("img");
	$(img).attr("src","../img/dp/ameliawatson_dp.png");
	$(container).append(img);
});