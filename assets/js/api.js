(function () {

	$(init);

	var apiURL = "https://watson-api-explorer.mybluemix.net/conversation/api/v1/workspaces/0a0c06c1-8e31-4655-9067-58fcac5134fc/message?version=2016-09-20";
	var dataInit = {};
	var contextVA = {};
	var resultVA = null;

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
		$(document).keypress(function(e) {
		    if(e.which == 13) {
				// Grab what's in the text input box and store it as the value of text in an object
				var chatText = $("#chatbox").val();
				// var userInput = {text: $("#term").val()};
				var chatInput = {text: $("#chatbox").val()};
				// Pass it on to the PostVA method to get a response
				postVA(chatInput);
				// Append input text to chat box.
				$(".chat").append('<div class="bubble me">' + chatText + '</div>');
				$('.chat').scrollTop($('.chat')[0].scrollHeight);
				// Clear the text field.
				$("#chatbox").val("");
		    }
		});

	}

	function postVA(x) {

		var watsonInput = {};

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
		  	resultVA = result.output.text[1];

		  	// Stringify the text and append it to element HTML
		  	// $("#poster").html(JSON.stringify(resultVA));

		  	$(".chat").append('<div class="bubble you">' + resultVA + '</div>');
		  	$('.chat').scrollTop($('.chat')[0].scrollHeight);

		  },
		  dataType: "json",
		  contentType: "application/json"
		});


	}

}) ();