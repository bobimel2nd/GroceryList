$(document).ready(function() {
	// Initialize Firebase
 	var config = {
	    apiKey: "AIzaSyBcSND5i9ma9MVrggXFh-8gK-lzj5OnBU4",
	    authDomain: "imelgrocerylist.firebaseapp.com",
	    databaseURL: "https://imelgrocerylist.firebaseio.com",
	    projectId: "imelgrocerylist",
	    storageBucket: "imelgrocerylist.appspot.com",
	    messagingSenderId: "1082088733976"
	};
	firebase.initializeApp(config);
	var database = firebase.database();

	// Initialize Groceries
	var buttonList = [];
	var groceryList = [];

	// initial button setup
	$(document).on("click", "#addNewItem", function(event) {
	  addGrocery($("#item").val().trim().capitalizeAll());
	});

	$(document).on("click", "#clearItems", function(event) {
	  delGrocery();
	});

	$(document).on("click", "#clearAll", function(event) {
		groceryList = [];
		database.ref().set({
		    Buttons: JSON.stringify(buttonList),
		    Groceries: JSON.stringify(groceryList)
		});
	});

	$(document).on("click", ".buttonItem", function(event) {
		addGrocery($(this).text().trim());
	});

	$(document).on("dblclick", ".buttonItem", function(event) {
		delButton($(this));
	});

	$(document).on("click", ".groceryItem", function(event) {
		$(this).toggleClass("crossOut");
	});

	$(document).on("dblclick", ".groceryItem", function(e) {
		addButton($(this).text().trim());
	 });

	// At the initial load, get a snapshot of the current data.
	database.ref().on("value", function(snapshot) {
		temp = snapshot.val();
		if (temp !== null) {
			buttonList = $.parseJSON(temp.Buttons);
			groceryList = $.parseJSON(temp.Groceries);
		}
		showAllButtons();
		showAllGroceries();
	}, function(errorObject) {
		alert("The read failed: " + errorObject.code);
	});

	function addButton(name) {
		if (name === "") return;
		if (jQuery.inArray(name, buttonList) !== -1) return;
		buttonList.push(name);
		buttonList.sort();
		saveLists();
	}

	function showAllButtons() {
		$("#allButtons").html("");
		for (var i=0; i<buttonList.length; i++) {
			showButton(buttonList[i]);
		}
	}

	function showButton(name) {
		var btn = $("<button>");
		btn.addClass("buttonItem")
		btn.text(name);
		$("#allButtons").append(btn);
		$("#allButtons").append(" ");
	}

	function delButton(button) {
		var name = button.text();
		for (var i=0; i<buttonList.length; i++) {
			if (buttonList[i] === name) {
				buttonList.splice(i,1);
				break;
			}
		}
		saveLists();
	}

	function addGrocery(name) {
		if (name === "") return;
		if (jQuery.inArray(name, groceryList) !== -1) return;
		groceryList.push(name);
		groceryList.sort();
		saveLists();
	}

	function showAllGroceries() {
		$("#allItems").html("");
		for (var i=0; i<groceryList.length; i++) {
			if (i>0) $("#allItems").append(", ");
			showGrocery(groceryList[i]);
		}
	}

	function showGrocery(name) {
		var d = $("<div>");
		d.addClass("groceryItem");
		d.text(name);
		$("#allItems").append(d);
		$("#item").val("");
	}

	function delGrocery() {
		var grocery = $(".groceryItem");
		for (var i=grocery.length-1; i>=0; i--) {
			if (grocery[i].classList.contains("crossOut")) {
				groceryList.splice(i,1);
			}
		}
		saveLists();
	}

	function saveLists() {
		database.ref().set({
		    Buttons: JSON.stringify(buttonList),
		    Groceries: JSON.stringify(groceryList)
		});
	}

	String.prototype.capitalizeAll = function() {
		var text = this.toLowerCase();
		array   = text.split(' '); // split on spaces
		capitalized = '';
		$.each(array, function( index, value ) {
			capitalized += value.charAt(0).toUpperCase() + value.slice(1);
			if( array.length != (index+1) )
			capitalized += ' '; // add a space if not end of array
		});
		return capitalized;
	}
	
})