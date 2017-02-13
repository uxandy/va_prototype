(function () {

	$(init);

	$(parseVA);

	// http://lenovo-tech-support.mybluemix.net/rest/conversation/api/v1/workspaces/c6ff8ad5-2df9-4be2-bcd9-6d9fb1ad6529/message
	// var apiURL = "https://watson-api-explorer.mybluemix.net/conversation/api/v1/workspaces/0a0c06c1-8e31-4655-9067-58fcac5134fc/message?version=2016-09-20";
	// lenovo-tech-support.mybluemix.net/conversation/api/v1/workspaces/{workspace_id}/message
	// var apiURL = "https://lenovo-tech-support.mybluemix.net/rest/conversation/api/v1/workspaces/c6ff8ad5-2df9-4be2-bcd9-6d9fb1ad6529/message";
	var apiURL = "https://lenovo-tech-support.mybluemix.net/conversation/api/v1/workspaces/{workspace_id}/message";
	var dataInit = {};
	var dataInit = {};
	var contextVA = {};
	var resultVA = null;
	var uInput = null;
	var servTrigger = {};
	var serialNumber = {};

	var triggerValue = null;
	var serialValue = null;

	function init() {

		// For now, capture on the click of a button, need to add ENTER key listener.
		$("#search").click(function() {
			// Grab what's in the text input box and store it as the value of text in an object
			var userInput = {text: $("#term").val()};
			var chatInput = {text: $("#chatbox").val()};
			// Pass it on to the PostVA method to get a response
			// postVA(userInput);
			postVA(chatInput);
		});

		// Need to find a way to merge both functions
		$("#chatbox").keypress(function(e) {
		    if(e.which == 13) {
				// Grab what's in the text input box and store it as the value of text in an object
				var chatText = $("#chatbox").val();
				// var userInput = {text: $("#term").val()};
				var chatInput = {text: $("#chatbox").val()};
				// Append input text to chat box.
				$(".chat").append('<div class="bubble me">' + chatText + '</div>');
				// Pass it on to the PostVA method to get a response
				postVA(chatInput);
				$('.chat').scrollTop($('.chat')[0].scrollHeight);
				// Clear the text field.
				$("#chatbox").val("");
		    }
		});

		var chatInput = {text: "hey"};
		postVA(chatInput);

	}

	// name=“SerialNumber” 

	function postVA(x) {

		var watsonInput = {};

		console.log("Input given was: " + x);
		watsonInput["input"] = x;
		watsonInput["context"] = contextVA;

		console.log("Created following object array from input:");
		console.log(watsonInput);

		$.ajax({
		  type: "POST",
		  url: apiURL,
		  data: JSON.stringify(watsonInput),
		  success: function(result) {
		  	console.log("Received the following object back:");
		  	console.log(result);

		  	// Set the context based on what was received
		  	contextVA = result.context;
		  	// Fetch the output text from the returned array and pass it on to resultVA
		  	// resultVA = result.output.text[0];

		  	for (i = 0; i < result.output.text.length; i++) {
		  		// console.log('Length of text array is:' + result.output.text.length);
		  		// console.log(JSON.stringify(result.output.text[i]));
		  		resultVA = result.output.text[i];
		  		$(".chat").append('<div class="bubble you">' + resultVA + '</div>');
		  	}

		  	// Stringify the text and append it to element HTML
		  	// $("#poster").html(JSON.stringify(resultVA));

		  	// $(".chat").append('<div class="bubble you">' + resultVA + '</div>');
		  	$(parseVA);
		  	$('.chat').scrollTop($('.chat')[0].scrollHeight);

		  },
		  dataType: "json",
		  contentType: "application/json"
		});

	}

	function postArgVA(sn, st){
		var watsonInput = {};

		watsonInput["input"] = {text: "a"};
		watsonInput["context"] = contextVA;

		console.log('Serial and Trigger: ' + serialValue + ' and ' + triggerValue);

		watsonInput.context["ServiceTrigger"] = triggerValue;
		watsonInput.context["SerialNumber"] = serialValue;

		console.log('Passing Serial and Trigger context:');
		console.log(watsonInput);

		$.ajax({
		  type: "POST",
		  url: apiURL,
		  data: JSON.stringify(watsonInput),
		  success: function(result) {
		  	console.log("Received the following object back:");
		  	console.log(result);

		  	// Set the context based on what was received
		  	contextVA = result.context;

		  	for (i = 0; i < result.output.text.length; i++) {
		  		resultVA = result.output.text[i];
		  		$(".chat").append('<div class="bubble you">' + resultVA + '</div>');
		  	}

		  	// Stringify the text and append it to element HTML
		  	// $("#poster").html(JSON.stringify(resultVA));

		  	// $(".chat").append('<div class="bubble you">' + resultVA + '</div>');
		  	$(parseVA);
		  	$('.chat').scrollTop($('.chat')[0].scrollHeight);

		  },
		  dataType: "json",
		  contentType: "application/json"
		});

	}

	function parseVA() {

		// Parse input boxes
		$("va\\:textbox").each(function(){
		        $(this).replaceWith('<div class="input-field"><input id="' + $(this).attr("name") + '"placeholder="' + $(this).attr("prompt") + '"' + 'maxlength=' + $(this).attr("maxlength") + '></div>');
		        triggerValue = $(this).attr("servicetrigger");
		        servTrigger = {ServiceTrigger: $(this).attr("servicetrigger")};
		        console.log('Service trigger captured:' + JSON.stringify(servTrigger));
		    }
		);

		// Parse simple input anchors
		$("va\\:input").each(function(){
		        $(this).replaceWith('<a href="#" class="commande">' + $(this).html() + '</a>');
		    }
		);

		// Parse simple link 
		$("va\\:link").each(function(){
		        $(this).replaceWith('<a href="' + $(this).attr("href") + '" target="_blank">' + $(this).html() + '</a>');
		    }
		);

		$(".w4mvsImg").each(function(){
				var src = $('.w4mvsImg').attr('src');
				$(this).removeClass('w4mvsImg');
				$(this).replaceWith('<div class="thumb1" style="background-image: url(' + src + ')"><a href="' + src + '" target="_blank"></a></div>');
		    }
		);

		$(".bubble ul").each(function() {
			if (!$(this).hasClass('control-box')){
				$(this).addClass('control-box');
				$('.control-box').wrap('<div class="input-controls"></div>');
			}
		});


		$('.commande').click(function() {
			var v = $(this).html();
			var vo = {text: v};
			$(".chat").append('<div class="bubble me">' + v + '</div>');
			$('.chat').scrollTop($('.chat')[0].scrollHeight);
			$(postVA(vo));
		});

		$("#SerialNumber").keypress(function(e) {
		    if(e.which == 13) {
				// Grab what's in the text input box and store it as the value of text in an object
				var snValue = $("#SerialNumber").val();
				serialValue = snValue;
				// var userInput = {text: $("#term").val()};
				var snData = {SerialNumber: snValue};

				postArgVA(snData, servTrigger);

		    }
		});

	}

}) ();



$( document ).ajaxStart(function() {
  $(".chat").append('<div class="bubble you loading">' + '<span>.</span><span>.</span><span>.</span>' + '</div>');
  $('.chat').scrollTop($('.chat')[0].scrollHeight);
}).ajaxStop(function() {
  $(".loading").remove();
});


// [ TO DO FOR DEV ]
// --------------------------------------------------------------------------------
//| TIME STAMP AT THE TOP NEEDS TO RESOLVE LOCAL TIME.
//| [DONE] WRITE INPUT TEXT PARSER/SEND INPUT VALUE OVER TO WASTSON TO BE RESOLVED.
//| [DONE] TAKE A SENT YES/NO LINK ON CLICK AND APPEND THE USER AREA WITH THE VALUE, THEN SEND THAT VALUE OVER TO WATSON.
//| IS WARRANTY SEPARATE FROM SOE OR WILL SOE CONTAIN A WARRANTY CHECK CALL?
//| [DONE] WHEN PICTURE IS CLICKED, OPEN PICTURE IN NEW WINDOW
//| FEEDBACK WHEN CHAT ENDS.
//| IDLE TIME STAMP? NO TIMEOUT FOR WATSON?
//| FONT UPSCALE/DOWNSCALE CONTROL ON COG
//| ADD ARTIFICIAL SEPARATOR FOR LONG MESSAGES OR MULTI-TIERED MESSAGES
//| SPOONMAN... SAVE ME.
// --------------------------------------------------------------------------------

// [ ITEMS TO CONSIDER ]
// --------------------------------------------------------------------------------
//| CHUNKING LARGE MESSAGES (BUBBLE-BREAK)
//| STEPS
//| BUBBLE ANIMATION
//| AJAX LOADING INDICATOR AT THE TOP VS. IN CHAT BODY
// --------------------------------------------------------------------------------




