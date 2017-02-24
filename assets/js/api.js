(function () {

	$(init);

	$(parseVA);

	var apiURL = "https://lenovo-vap.mybluemix.net/conversation/api/v1/workspaces/8f48f0ef-38c2-4fea-b435-99356a9fd25c/message";
	var contextVA = {};
	var resultVA = null;
	var servTrigger = {};
	var triggerValue = null;
	var serialValue = null;
	var ticketValue = null;

	function init() {


		d = new Date();
		d.toLocaleTimeString();

		$(".timestamp").html("Today, " + d.toLocaleTimeString());

		$("#chatbox").focus();

		// For now, capture on the click of a button, need to add ENTER key listener.
		$(".send").click(function() {
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

	function postVA(x) {

		var watsonInput = {};

		console.log("Input given was: " + x);
		watsonInput["input"] = x;
		watsonInput["context"] = contextVA;

		console.log("Created following object array from input:");
		console.log(watsonInput);

		$('.expired').remove();

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

		  	for (i = 0; i < result.output.text.length; i++) {
		  		// Loop through the entire text array and output.
		  		resultVA = result.output.text[i];

		  		if (!resultVA) {
		  			// DO NOTHING
		  		} else {
		  			$(".chat").append('<div class="bubble you">' + resultVA + '</div>');
		  		}
		  	}

		  	$(parseVA);
		  	$('.chat').scrollTop($('.chat')[0].scrollHeight);

		  },
		  dataType: "json",
		  contentType: "application/json"
		});

	}

	function postArgVA(inValue, stValue){
		var watsonInput = {};

		watsonInput["input"] = {text: ""};
		watsonInput["context"] = contextVA;

		console.log('Serial, Trigger and Ticket: ' + serialValue + ' and ' + triggerValue + ' and ' + ticketValue);

		watsonInput.context["ServiceTrigger"] = triggerValue;
		watsonInput.context["SerialNumber"] = serialValue;
		watsonInput.context["TicketNumber"] = ticketValue;

		console.log('Passing Serial and Trigger context:');
		console.log(watsonInput);

		$('.expired').remove();

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

		  		if (!resultVA) {
		  			// DO NOTHING
		  		} else {
		  			$(".chat").append('<div class="bubble you">' + resultVA + '</div>');
		  		}
		  	}

		  	$(parseVA);
		  	$('.chat').scrollTop($('.chat')[0].scrollHeight);

		  },
		  dataType: "json",
		  contentType: "application/json"
		});

	}

	function clickAndDisable(link) {
	    link.onclick = function(event) {

	        event.preventDefault();
	    }
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
		        $(this).replaceWith('<a href="#" class="comm-hook">' + $(this).html() + '</a>');
		        if ($(this).attr("type")== "survey") {
		        	$(".comm-hook").addClass('survey-commande');
		        	$(this).removeClass('comm-hook');
		        } else {
		        	$('.comm-hook').parent('li').addClass('commande');
		        	$(this).removeClass('comm-hook');
		        	console.log('appending commande here ' + $(this).html());
		        }

		        
		    }
		);

		// Parse simple link 
		$("va\\:link").each(function(){
		        $(this).replaceWith('<a href="' + $(this).attr("href") + '" target="_blank">' + $(this).html() + '</a>');
		    }
		);

		$("va\\:button").each(function(){
		        $(this).replaceWith('<a href="javascript:void(0);" class="submit-button">' + $(this).html() + '</a>');
		    }
		);

		$(".w4mvsImg").each(function(){
				var src = $('.w4mvsImg').attr('src');
				$(this).removeClass('w4mvsImg');
				$(this).replaceWith('<div class="thumb1" style="background-image: url(' + src + ')"><a href="' + src + '" target="_blank"></a></div>');
		    }
		);

		$(".bubble ul").each(function() {
			if ($(this).hasClass('control-box') || $(this).hasClass('multi-field')){
				// DO NOTHING
				// $('.control-box').wrap('<div class="input-controls"></div>');
				console.log('found a multi-field class.');
			} else {
				$(this).addClass('control-box');
			}
		});

		$("ul.multi-field").each(function(){
		        
		    }
		);

		// $('.control-box').on('click', '.commande', function(e){
		// 	var x = $("a", this).text();
		// 	console.log('Command is :' + x);
		// 	var vo = {text: x};
		// 	$(".chat").append('<div class="bubble me">' + x + '</div>');
		// 	$('.chat').scrollTop($('.chat')[0].scrollHeight);
		// 	$('.commande').addClass('expired');
		// 	e.preventDefault();

		// 	$(postVA(vo));
		// });

		$('.commande').click(function(event) {
			var x = $("a", this).text();
			console.log('Command is :' + x);
			var vo = {text: x};
			$(".chat").append('<div class="bubble me">' + x + '</div>');
			$('.chat').scrollTop($('.chat')[0].scrollHeight);
			$('li.commande').addClass('expired');
			$('.expired').removeClass('commande');
			$(this).unbind('click');
			event.preventDefault();
			$(postVA(vo));
		});



		$('.survey-commande').click(function() {
			// var v = $(this).html();
			var x = $(this).text();
			console.log('Survey command is :' + x);
			var vo = {text: x};
			$(".chat").append('<div class="bubble me">' + x + '</div>');
			$('.chat').scrollTop($('.chat')[0].scrollHeight);
			$(postVA(vo));
		});

		$('.submit-button').click(function() {
			var snValue = $("#SerialNumber").val();
			serialValue = snValue;
			var tcValue = $("#TicketNumber").val();
			ticketValue = tcValue;
			$(this).addClass('expired');

			postArgVA("","");
		});

		$("#SerialNumber").keypress(function(e) {
		    if(e.which == 13 && !$(this).hasClass('triggered')) {
				// Grab what's in the text input box and store it as the value of text in an object
				var snValue = $("#SerialNumber").val();
				$(this).addClass('triggered');
				$(this).removeAttr('id');
				$('li.commande').addClass('expired');
				serialValue = snValue;
				// var userInput = {text: $("#term").val()};
				var snData = {SerialNumber: snValue};

				postArgVA(snValue, triggerValue);

		    }
		});

		$("#TicketNumber").keypress(function(e) {
		    if(e.which == 13 && !$(this).hasClass('triggered')) {
				// Grab what's in the text input box and store it as the value of text in an object
				var tcValue = $("#TicketNumber").val();
				$(this).addClass('triggered');
				$(this).removeAttr('id');
				$('li.commande').addClass('expired');
				ticketValue = tcValue;
				// var snData = {SerialNumber: tcValue};

				console.log('Captured ticket number: ' + tcValue);

				postArgVA(tcValue, triggerValue);

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

// http://lenovo-tech-support.mybluemix.net/rest/conversation/api/v1/workspaces/c6ff8ad5-2df9-4be2-bcd9-6d9fb1ad6529/message
// var apiURL = "https://watson-api-explorer.mybluemix.net/conversation/api/v1/workspaces/0a0c06c1-8e31-4655-9067-58fcac5134fc/message?version=2016-09-20";
// lenovo-tech-support.mybluemix.net/conversation/api/v1/workspaces/{workspace_id}/message
// var apiURL = "https://lenovo-tech-support.mybluemix.net/rest/conversation/api/v1/workspaces/c6ff8ad5-2df9-4be2-bcd9-6d9fb1ad6529/message";
// var apiURL = "https://lenovo-tech-support.mybluemix.net/conversation/api/v1/workspaces/{workspace_id}/message";



