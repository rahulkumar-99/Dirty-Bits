$(document).ready(function(){

	$('#user-input').click(function () {
		$(".input-container").slideToggle();
	});

	var language = {}

	language['C'] = '#include <stdio.h>\n\nint main(void) \n{\n	printf("Hello World!\\n");\n	return 0;\n}\n';
	language['C++'] = '#include <iostream>\nusing namespace std;\n\nint main()\n{\n     cout << "Hello World!" << endl;\n     return 0;\n}\n';
	language['C#'] = 'using System;\nusing System.Numerics;\nclass Test {\n	static void Main(string[] args)	{\n	   /*\n		* \n		Read input from stdin and provide input before running\n		var line1 = System.Console.ReadLine().Trim();\n		var N = Int32.Parse(line1);\n		for (var i = 0; i < N; i++) {\n		System.Console.WriteLine("hello world");\n		}\n		*/\n\n		System.Console.WriteLine("Hello World!\\n");\n	}\n}\n';
	language['Go'] = 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello World")\n}\n';
	language['Haskell'] = 'module Main\n where\n\nmain=putStrLn "Hello World!\\n"';
	language['Java'] = 'class TestClass {\n    public static void main(String args[] ) throws Exception {\n        System.out.println("Hello World!");\n    }\n}\n';
	language['JavaScript'] = "importPackage(java.io);\nimportPackage(java.lang);\n\nprint ('Hello World!\\n');\n";
	language['Common Lisp'] = '(display "Hello World!")\n';
	language['Pascal'] = "program Hello;\nbegin\n    writeln ('Hello World!')\nend.\n";
	language['PHP'] = '<?php\n\necho "Hello World!";\n\n?>\n';
	language['Python2'] = "print 'Hello World!'\n";
	language['Python3'] = "print('Hello World!')\n";
	language['Ruby'] = "print 'Hello World!'\n";
	language['Rust'] ='fn main() {\n    println!("Hello World!");\n}\n';
	language['Plain Text'] = 'Paste the output here\n';

	//------From Ace Documentation on inserting the editor------//
	ace.require("ace/ext/language_tools");
	var editor = ace.edit("editor");
	var ongoing = false;
	var selectedLang = "Python3";
	editor.setTheme("ace/theme/dawn");
	editor.session.setMode("ace/mode/c_cpp");
	editor.getSession().setTabSize(5);
	var source_code = editor.getValue();
	editor.setFontSize(14);
	editor.setValue(language[selectedLang],-1);
	var StatusBar = ace.require("ace/ext/statusbar").StatusBar;
	var statusBar = new StatusBar(editor, document.getElementById("editor-statusbar"));
	editor.getSession().on('change', function(e) {
		updateContent();
		if(source_code == ""){
			$("#runcode").prop('disabled', true);
			$('#runcode').prop('title', "Editor is Empty! Please write some code.");
		}
		else{
			$("#runcode").prop('disabled', false);
			$('#runcode').prop('title', "Compile and Run");
		}
	});
	editor.session.getSelection().clearSelection();

	//To Download the code in the editor
	// function download(content,lang){
	// 	var e = {
	// 		"C":"c","CPP":"c++","C#":"cs",
	// 		"Go":"go","Haskell":"haskell","Java":"jar","JavaScript":"js",
	// 		"Common Lisp":"lisp","PHP":"php",
	// 		"Python2": "py","Python3" : "py","RUBY":"ruby","RUST":"rust",
	// 		"Plain Text":"txt"
	// 	};
	// 	var element = document.createElement('a');
	// 	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
	// 	element.setAttribute('download', "file." + e[lang]);
	// 	element.style.display = 'none';
	// 	document.body.appendChild(element);
	// 	element.click();
	// 	document.body.removeChild(element);
	// }

	// $("#download").click(function(){
	// 	updateContent();
	// 	download(source_code, $("#lang").val());

	// });

	//To get the current contents in the editor
	function updateContent(){
		source_code = editor.getValue();
	}

	//To run the code and get all the status
	function runCode(){
		if(ongoing==true)
			return;
		ongoing = true;
		updateContent();
		$(".outputbox").hide();
		$("#runcode").prop('disabled', true);

		var token = $(":input[name='csrfmiddlewaretoken']").val();
		var input_given = $("#custom-input").val();
		var run_data = {
				source: source_code,
				lang: selectedLang,
				csrfmiddlewaretoken:token
		};
		if( $("#user-input").prop('checked') == true ){
			run_data.input = input_given;
		}

		console.log(run_data);

		// AJAX request to Django for running code

		$.ajax({
			url: "http://127.0.0.1:8000/run/",
			type: "POST",
			data: run_data,
			dataType: "json",
			timeout: 1000000,
			success: function(response){
				ongoing = false;
				$("html, body").delay(150).animate({
						scrollTop: $('#showres').offset().top
				}, 1000);
				$(".outputbox").show();
				$("#runcode").prop('disabled', false);

				var cstat = response.cstat;
				var rstat = response.cstat;
				var time_used = response.time;
				var memory_used = response.memory;
				var code_output = response.output;
				var code_error = response.error;
				console.log(response)
				if(cstat == "Accepted"){

					$(".compilestat").children(".value").html("Compiled");
					$(".runstat").children(".value").html(rstat);
					$(".time").children(".value").html(time_used);
					$(".memory").children(".value").html(memory_used);

					if(rstat == "Accepted"){
						$(".outputerror").hide();
						$(".io-show").show();
						$(".outputo").html(code_output).css("color", "#000");;
						if($("#user-input").prop('checked') == true)
							$(".outputi").html(input_given).css("color", "#000");
						else
							$(".outputi").html("Standard input is empty").css("color", "#a6a6a6");
					}
					else{
						$(".io-show").show();
						$(".outputo").html("Standard output is empty").css("color", "#a6a6a6");
						if($("#user-input").prop('checked') == true)
							$(".outputi").html(input_given).css("color", "#000");
						else
							$(".outputi").html("Standard input is empty").css("color", "#a6a6a6");
						$(".outputerror").show();
 
						if(rstat == "Compilation Error"){
							$(".errorkey").html("Compilation Error");
							$(".errormessage").html("Compilation Error");
						}
						else if (rstat == "Time Limit Exceeded"){
							$(".errorkey").html("Timeout Error");
							$(".errormessage").html("Time limit exceeded.");
						}
						else{
							$(".errorkey").html("Runtime Error");
							$(".errormessage").html(rstat);
						}
					}
				}
				else{
					$(".io-show").show();
					$(".outputo").html("Standard output is empty").css("color", "#a6a6a6");
					if($("#user-input").prop('checked') == true)
						$(".outputi").html(input_given).css("color", "#000");
					else
						$(".outputi").html("Standard input is empty").css("color", "#a6a6a6");
					$(".time").children(".value").html("0.0");
					$(".memory").children(".value").html("0");
					$(".compilestat").children(".value").html("N/A");
					$(".runstat").children(".value").html("CE");

					$(".outputerror").show();
					$(".errorkey").html("Compile Error");
					$(".errormessage").html(cstat + '\n' + code_error);

				}
			},

			error: function(error){

				ongoing = false;
				$("html, body").delay(150).animate({
						scrollTop: $('#showres').offset().top
				}, 1000);

				$("#runcode").prop('disabled', false);
				$(".outputbox").show();
				$(".io-show").show();
				$(".outputo").html("Standard output is empty").css("color", "#a6a6a6");
				if($("#user-input").prop('checked') == true)
					$(".outputi").html(input_given).css("color", "#000");
				else
					$(".outputi").html("Standard input is empty").css("color", "#a6a6a6");
				$(".outputio").show();
				$(".time").children(".value").html("0.0");
				$(".memory").children(".value").html("0");
				$(".compilestat").children(".value").html("N/A");
				$(".runstat").children(".value").html("N/A");

				$(".errorkey").html("Server error");
				$(".errormessage").html("Bad Request(403). Please try again!");


			}
		});
	}

	$("#runcode").click(function(){
		runCode();
	});

	//When Changing the language
	$("#lang").change(function(){
		selectedLang = $("#lang").val();
		editor.setValue(language[selectedLang],-1);
		if(selectedLang == "C" || selectedLang == "CPP"){
			editor.getSession().setMode("ace/mode/c_cpp");
		}
		else{
			editor.getSession().setMode("ace/mode/" + selectedLang.toLowerCase());
		}
		editor.session.getSelection().clearSelection();
	});

	//When changing the theme
	$("#theme").change(function(){
		themeSelected = $("#theme").val();
		if(themeSelected == "Light"){
			editor.setTheme("ace/theme/dawn");
		}
		else if(themeSelected == "Monokai"){
			editor.setTheme("ace/theme/monokai");
		}
		else if(themeSelected == "Solarised Light"){
			editor.setTheme("ace/theme/solarized_light");
		}
		else if(themeSelected == "Twilight"){
			editor.setTheme("ace/theme/twilight");
		}
	});

});