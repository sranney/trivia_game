$(document).ready(function(){
	window.onload = function() {

	  //  Click events are done for us:
	  $("#setTimer").prop("disabled",false);
	  $("#startTimer").prop("disabled",false);
	  $("#pauseTimer").prop("disabled",true);
	  $("#stopTimer").prop("disabled",true);
	};

	var objArray=["question1","question2","question3","question4"];

	var timerStarted=false;
	audioElement=$("<audio>");
	audioElement.attr("src", "assets/sounds/times up.mp3");
	var time;

	var quizObj={
		question1:{
			question:"You have two fair dice. One is numbered 1 through 6. The other is numbered multiples of 3 - 3,6,9,12,15,18. On any roll of both dice, what is the probability of the total being greater than 15 but no more than 20?",
			answer1:"6/36",
			answer2:"10/36",
			answer3:"12/36",
			answer4:"20/36",
			picture:"assets/images/dice.jpg",
			timeRemaining:0,
			timeElapsed:0,
			solution:"The dice are numbered differently. One is numbered 1 through 6 and the other 3, 6, 9, 12, 15 and 18. In order to get above 15 but at most 20, you must get one of the following die roll combinations: {1,15}, {1,18},{2,15},{3,12},{3,15},{4,12},{4,15},{5,12},{5,15},{6,9},or {6,12}. Each of these combinations are mutually exclusive, so the total number of combinations which meet the criteria is 10.  The total number of possible dice rolls is 6 possible faces on the first die x 6 possible faces on the second die = 36 total combinations. So the probability of the criteria is 10 out of 36 or 10/36.",
			correct:false,
			correctAnswer:2
		},
		question2:{
			question:"How many different ways can you spell JUMPS from the letters and paths designated below? Note that the outer most Ps only have one S which can be chosen.",
			answer1:"10",
			answer2:"12",
			answer3:"14",
			answer4:"16",
			picture:"assets/images/jump.png",
			timeRemaining:0,
			timeElapsed:0,
			solution:"Each letter allows for two paths, except for the Ps on the outer most left and right sides.  Each of the outer most Ps allows for only one path.  Each of the outer most Ps are only accessible from one route from J through M, respectively.  Thus, these two outer most Ps represent only two possible paths of the total number of paths.  If those paths were available, if there was one more S on the right and one more S on the left, then for each letter there would be two potential paths. Thus there would be 2 * 2 * 2 * 2 potential paths, or 16 paths. As explained above, removing the two S's on the outer most left and right only removes two of the potential paths. Thus the actual number of paths possible in this game is 2^4 - 2 = 14 paths.",
			correct:false,
			correctAnswer:3
		},
		question3:{
			question:"You are on a gameshow on which a host presents you with three doors.  Behind one of these doors is a car, but behind the other two doors is a goat. From your perspective, each of the three doors is equally like to open to the car prize. The gameshow host asks you to choose a door which you believe will contain the car.  After you have made your choice, the host opens one of the other two doors.  Knowing which of the three doors contains the prize, the host opens one of the two doors that does not contain a prize. There are now two doors remaining out of the three. The host then offers you the choice: open the door you originally chose at the beginning of the game? Or open the other remaining door and claim what ever is behind that door, goat or car?  What is the probability that taking the latter option and switching doors will result in you winning the car?",
			answer1:"1/3",
			answer2:"1/2",
			answer3:"1/6",
			answer4:"2/3",
			picture:"assets/images/3doors.jpg",
			timeRemaining:0,
			timeElapsed:0,
			solution:"You have three doors to choose from. Behind one of these doors, there is a car. Behind the other two doors, there is a goat.  Without having a clue as to what any of the three doors contains, you are forced to choose randomly. Thus each door is equally likely to contain a car or a goat. With the distribution of 1 car to two goats, you have a 2/3 chance of choosing a door with a goat behind it, and 1/3 chance of choosing a door with a car behind it. After choosing a door, the host opens a door that does not contain a prize. Now you have the door you initially chose and a second door unopened.  You had a 1/3 chance of choosing the prize door on the initial round. If you in fact chose that door and switched doors before opening the final door, the probability of winning the prize would be 0. If you chose a goat door on the initial door, the probability of switching doors and ultimately winning a prize is 100%. Thus the probability of switching doors and winning a prize is 0%*1/3+100%*2/3 = 2/3.",
			correct:false,
			correctAnswer:4
		},
		question4:{
			question:"A standard deck consists of 52 cards - 13 different levels 1 through Ace and 4 different suits.  In poker, the royal flush hand is a hand which consists of 10, J, Q, K and Ace all of the same suit.  A one pair hand consists of 2 cards of the same level across 2 different suits in addition to 3 cards of different levels.  A one pair hand must consist of exactly one pair else it is specifically a one pair hand (it could be a two pair, three of a kind, no pair, etc.). How many times greater is the probability of drawing a pair than drawing a royal flush?",
			answer1:"102",
			answer2:"62300",
			answer3:"124325",
			answer4:"274560",
			picture:"assets/images/royal flush.jpg",
			timeRemaining:0,
			timeElapsed:0,
			solution:"There are 52 choose 5 hands possible in a 5 card hand of poker. There are only four hands in the entire deck which would be classified as a royal flush.  A much more interesting question is how many hands are there that would be classified as a one pair? We can break this down by considering the criteria for a one pair hand. First, we must have 1 of 13 different levels appear twice in our hand.  This one of 13 levels must be chosen for 2 out of the 4 suits.  The number of combinations of two cards which generate a pair is 13 choose 1 * 4 choose 2 = 13*(4*3/2)=78.  However, that is only part of the total number.  The other three cards must each be of different levels, otherwise the hand would be of higher value and not a one pair hand.  There are 12 choose 3 different ways of choosing the three other card levels. Each of these cards can be any one of the 4 suits. So there are 12 choose 3 * (4 choose 1)^3 different combinations of three other cards that we can draw that will satisfy the one pair hand rules. Then, for total we have 78*14080 = 1098240 different one hand pair combinations.  Thus getting a one pair hand is 1098240 / 4 = 274560 more likely than getting a royal flush.",
			correct:false,
			correctAnswer:4
		}
	};


	//we have two timing events that need to be connected
	//one of these events is to have the clock tick down each second
	//the second is to have the quiz questions turn after a certain amount of time has elapsed
	//we want a different clock for each question so that we can track time remaining for each question separately
	////////each question starts out with an equal amount of time
	////////we want to be able to skip a question and, if time remains for that question, be able to come back and work on it for the remaining period of time
	////////clock should count down starting at the time remaining for any question
	////////time remaining is first set by either the default 2 min (which is 10 / 5) or by the time given by the user
	//we want the ability to pause the time and restart it at the currently paused time
	////////the question should appear for the remainder of time showing if paused and should not change until time runs out
	////////we can do this by changing the time that is added to a new Date
	////////so our timer always starts by adding some time to a date and then every second updating the time and showing the new time
	////////Pause doesn't need to do anything but clear interval - the current time increment for the current question has been decremented to remaining time
	////////so we need to have as a focus the correct question - that way we can decrement the remaining time
	////////when any question has its time remaining run out, the question number is added to timeRunout array
	//////////////then when skipping or going to next question, it will go to the next question that is not on the array
	//////////////if all questions are in the timeRunout array then the quiz ends


	//first step, get clock working with the confines of the question timers
	//first, set question timers

	console.log(Object.keys(quizObj));

	resetTimers = function(){
		if ($("input[valueid=days]").val().length===0&&$("input[valueid=hours]").val().length===0&&$("input[valueid=min]").val().length===0&&$("input[valueid=sec]").val().length===0){
			time=120*Object.keys(quizObj).length;
		} else {
			var secondsfromDays = 60*60*24*$("input[valueid=days]").val();
			var secondsfromHours = 60*60*$("input[valueid=hours]").val();
			var secondsfromMinutes = 60*$("input[valueid=min]").val();
			var seconds = $("input[valueid=sec]").val();
			time = secondsfromDays + secondsfromHours + secondsfromMinutes + seconds;
		}

		for (var i=1; i<=Object.keys(quizObj).length;i++){
			quizObj["question"+i].timeRemaining=time/Object.keys(quizObj).length;
		}

	}

	var Question=1;
	var timerInterval;
	var timeRunout=[];
	nextQ = function(qID){

		var skipSet=false;
		if(qID===1){
			for (var i=2;i<=Object.keys(quizObj).length;i++){
				if (timeRunout.indexOf(i)===-1){
					qID=i;
					break;
				}
			}
		} else if(qID===2){
			for (var i=3;i<=Object.keys(quizObj).length;i++){
				if (timeRunout.indexOf(i)===-1){
					qID=i;
					skipSet = true;
					break;
				}
			}
			if(!skipSet){
				if (timeRunout.indexOf(1)===-1){
					qID=1;
				}	
			}
		} else if(qID===3){
			if (timeRunout.indexOf(4)===-1){
				qID=4;
				skipSet = true;			
			}
			if(!skipSet){
				for (var i=1;i<=2;i++){
					if (timeRunout.indexOf(i)===-1){
						qID=i;
						break;
					}
				}
			}
		} else 	if(qID===4){
			for (var i=1;i<=3;i++){
				if (timeRunout.indexOf(i)===-1){
					qID=i;
					break;
				}
			}
		}


		Question=qID;
		setAnswers();
		clearInterval(timerInterval);
		if(timeRunout.length<Object.keys(quizObj).length){
			$("#answers").css("visibility","hidden");
			$("#Quizzes").addClass("roll");
			setTimeout(function(){ 
				$("#Quizzes").removeClass("roll");
				$("#answers").css("visibility","visible");
			},700)
			$("#Quizzes").html("<p><strong>Question #" + Question + "</strong>: " + quizObj["question"+Question].question + "</p><br><img src='" + quizObj["question"+Question].picture + "'>");
			startTimer("#clock",qID);
		} else {
		$("#Quizzes").html("<div class='text-center' id='endofQuizBtnRow'><h1>QUIZ COMPLETE!</h1><button id='reviewStats' class='btn btn-default' onclick='reviewStats()'>Review Stats</button><button id='reviewQuestions' class='btn btn-default' onclick='reviewQuestions()'>Review Questions</button><button id='restartQuiz' class='btn btn-default' onclick='restartQuiz()'>Restart Quiz</button></div>");
			$("#clock span").addClass("swell");
			$("#answers").css("visibility","hidden");
			$("#quizButtons>button").css("display","none");
			$("#pauseTimer").prop("disabled",true);
			$("#stopTimer").prop("disabled",true);
			$("#setTimer_popUp").prop("disabled",false);
			$("#startTimer").prop("disabled",false);
			audioElement.get(0).play();
			timerStarted=false;
			timeRunout=[];
		}
		$(".modal-body").html(makeModal_solution());
		return qID;
	}

	startTimer = function(id,qID){

		timerInterval=setInterval(function(){

			if(quizObj["question"+qID].timeRemaining>-1){	
				var days = ("0"+Math.floor(quizObj["question"+qID].timeRemaining/(60*60*24))).slice(-2);
				var hours = ("0"+Math.floor((quizObj["question"+qID].timeRemaining/(60*60)) % 24)).slice(-2);
				var minutes = ("0"+Math.floor(quizObj["question"+qID].timeRemaining/60) % 60).slice(-2);
				var seconds = ("0"+quizObj["question"+qID].timeRemaining % 60).slice(-2);
				quizObj["question"+qID].timeRemaining--;
				quizObj["question"+qID].timeElapsed++;
				$("#clock").html("<span id='days'>" + days + "</span>"
							+ "<span id='hours'>" + hours + "</span>"
							+ "<span id='minutes'>" + minutes + "</span>"
							+ "<span id='seconds'>" + seconds + "</span>");

				$("span#seconds").addClass("turn");
				setTimeout(function(){
					$("span#seconds").removeClass("turn");
				},700);

				if(seconds==59){
					$("span#minutes").addClass("turn");
					setTimeout(function(){
						$("span#minutes").removeClass("turn");
					},700);
				}

				if(minutes==59 && seconds==59){
					$("span#hours").addClass("turn");
					setTimeout(function(){
						$("span#hours").removeClass("turn");
					},700);
				}

				if(hours==23 && minutes==59 && 	seconds==59){
					$("span#days").addClass("turn");
					setTimeout(function(){
						$("span#days").removeClass("turn");
					},700);
				}

			} else {
				Question=qID;
				timeRunout.push(qID);
				checkAnswer();
				nextQ(qID);
				$("#pauseTimer").prop("disabled",false);
				$("#stopTimer").prop("disabled",false);
			}

		},1000);

	}


	//get new questions to start at right time
	$("#nextQuestion").on("click",function(){

		Question=nextQ(Question);

	})

	setAnswers = function(){
		$("#answers").empty();
		answersblockContent="<label class='radio-inline'><input type='radio' name='optradio' value='1'>"+quizObj["question"+Question]["answer1"]+"</label>"
		    				+"<label class='radio-inline'><input type='radio' name='optradio' value='2'>"+quizObj["question"+Question]["answer2"]+"</label>"
		    				+"<label class='radio-inline'><input type='radio' name='optradio' value='3'>"+quizObj["question"+Question]["answer3"]+"</label>"
		    				+"<label class='radio-inline'><input type='radio' name='optradio' value='4'>"+quizObj["question"+Question]["answer4"]+"</label>"
							+"<br><button class='btn btn-default' name='submit' type='submit' onclick='submitAnswer()' disabled='true'>Submit Answer</button>";
		$("#answers").html(answersblockContent);
	}

	reviewStats = function(){
		$("#endofQuizBtnRow").empty();
		$("#endofQuizBtnRow").html("<button id='reviewStats' class='btn btn-default' onclick='reviewStats()'>Review Stats</button><button id='reviewQuestions' class='btn btn-default' onclick='reviewQuestions()'>Review Questions</button><button id='restartQuiz' class='btn btn-default' onclick='restartQuiz()'>Restart Quiz</button>");		
		var days=[],hours=[],minutes=[],seconds=[];

		for (var i=0;i<Object.keys(quizObj).length;i++){
			days[i] = Math.floor(quizObj["question"+(i+1)].timeElapsed/(60*60*24));
			hours[i] = Math.floor(quizObj["question"+(i+1)].timeElapsed/(60*60)) % 24;
			minutes[i] = Math.floor(quizObj["question"+(i+1)].timeElapsed/60) % 60;
			seconds[i] = quizObj["question"+(i+1)].timeElapsed % 60;
		}

		var correct_q1 = (quizObj["question1"].correct ? "YES :)": "NO :(");
		var correct_q2 = (quizObj["question2"].correct ? "YES :)": "NO :(");
		var correct_q3 = (quizObj["question3"].correct ? "YES :)": "NO :(");
		var correct_q4 = (quizObj["question4"].correct ? "YES :)": "NO :(");

		innerhtml="<table class='table-striped table-bordered'><tr>"+
						"<th>Question</th>"+
						"<th>Did you get it right?</th>"+
						"<th>Correct Answer</th>"+
						"<th>Time Elapsed</th></tr>"+
						"<tr>"+
						"<td>Question #1</td>"+
						"<td>" + correct_q1 + "</td>"+
						"<td>Answer #" + quizObj["question1"].correctAnswer + ": " + quizObj["question1"]["answer"+quizObj["question1"].correctAnswer] + "</td>"+
						"<td>"+days[0]+" days " + hours[0] + " hours " + minutes[0] + " minutes " + seconds[0] + " seconds</td></tr>"+
						"<tr>"+
						"<td>Question #2</td>"+
						"<td>" + correct_q2 + "</td>"+
						"<td>Answer #" + quizObj["question2"].correctAnswer + ": " + quizObj["question2"]["answer"+quizObj["question2"].correctAnswer] + "</td>"+
						"<td>"+days[1]+" days " + hours[1] + " hours " + minutes[1] + " minutes " + seconds[1] + " seconds</td></tr>"+
						"<tr>"+
						"<td>Question #3</td>"+
						"<td>" + correct_q3 + "</td>"+
						"<td>Answer #" + quizObj["question3"].correctAnswer + ": " + quizObj["question3"]["answer"+quizObj["question3"].correctAnswer] + "</td>"+						
						"<td>"+days[2]+" days " + hours[2] + " hours " + minutes[2] + " minutes " + seconds[2] + " seconds</td></tr>"+
						"<tr>"+
						"<td>Question #4</td>"+
						"<td>" + correct_q4 + "</td>"+
						"<td>Answer #" + quizObj["question4"].correctAnswer + ": " + quizObj["question4"]["answer"+quizObj["question4"].correctAnswer] + "</td>"+
						"<td>"+days[3]+" days " + hours[3] + " hours " + minutes[3] + " minutes " + seconds[3] + " seconds</td></tr>";
		$("#endofQuizBtnRow").html(innerhtml);
	}
	
	
	reviewQuestions = function(){
		$("#endofQuizBtnRow").empty();
		$("#endofQuizBtnRow").html("<button id='reviewStats' class='btn btn-default' onclick='reviewStats()'>Review Stats</button><button id='reviewQuestions' class='btn btn-default' onclick='reviewQuestions()'>Review Questions</button><button id='restartQuiz' class='btn btn-default' onclick='restartQuiz()'>Restart Quiz</button>");
		$("#endofQuizBtnRow").append("<p>Question #1:" + (quizObj["question1"].correct ? " <em>You got this one right!</em>":" Incorrect") + "</p><p>Question: " + quizObj["question1"].question + "</p><p>Solution:" + quizObj["question1"].solution + "</p><br><p>Question #2:" + (quizObj["question2"].correct ? " <em>You got this one right!</em>":" Incorrect") + "</p><p>Question: " + quizObj["question2"].question + "</p><p>Solution:" + quizObj["question2"].solution + "</p><br><p>Question #3:" + (quizObj["question3"].correct ? " <em>You got this one right!</em>":" Incorrect") + "</p><p>Question: " + quizObj["question3"].question + "</p><p>Solution:" + quizObj["question3"].solution + "</p><br><p>Question #4:" + (quizObj["question4"].correct ? " <em>You got this one right!</em>":" Incorrect") + "</p><p>Question: " + quizObj["question4"].question + "</p><p>Solution:" + quizObj["question4"].solution + "</p>");
	}
	
	
	restartQuiz = function(){
		resetTimers();
		Question=1;
		startTimer("#clock",Question);
		$("#quizButtons>button").css("display","inline");
		$("#Quizzes").html("");
		$("#Quizzes").addClass("roll");
		setTimeout(function(){ $("#Quizzes").removeClass("roll");},700)
		$("#Quizzes").html("<p><strong>Question #" + Question + "</strong>: " + quizObj["question"+Question].question + "</p><br><img src='" + quizObj["question"+Question].picture + "'>");
		timerStarted=true;
		$("#units span").css("display","inline");
		$("#answers").css("visibility","visible");
		$("#answers>.radio-inline>input").css("appearance","radio");
		$("#setTimer_popUp").prop("disabled",true);
		$("#stopTimer").prop("disabled",false);
		$("#pauseTimer").prop("disabled",false);
		setAnswers();
	}


	$("#startTimer").on("click",function(){
		if(!timerStarted){
			resetTimers();
			Question = 1;
			startTimer("#clock",Question);
			$("#quizButtons>button").css("display","inline");
			$("#Quizzes").html("");
			$("#Quizzes").addClass("roll");
			setTimeout(function(){ 
				$("#Quizzes").removeClass("roll");
				$("#answers").css("visibility","visible");
			},700)
			$("#Quizzes").html("<p><strong>Question #" + Question + "</strong>: " + quizObj["question"+Question].question + "</p><br><img src='" + quizObj["question"+Question].picture + "'>");
			timerStarted=true;
			$("#units span").css("display","inline");
		} else if(quizObj["question1"].timeRemaining!==0&&quizObj["question2"].timeRemaining!==0&&quizObj["question3"].timeRemaining!==0&&quizObj["question4"].timeRemaining!==0){
			startTimer("#clock",Question);
		}
		$("#setTimer_popUp").prop("disabled",true);
		$("#startTimer").prop("disabled",true);
		$("#pauseTimer").prop("disabled",false);
		$("#stopTimer").prop("disabled",false);
		$(".modal-body").html(makeModal_solution());
		$("#answers").css("visibility","visible");
		$("#answers>.radio-inline>input").css("appearance","radio");
		setAnswers();
	})

	$("#pauseTimer").on("click",function(){
		$("#startTimer").prop("disabled",false);
		$("#pauseTimer").prop("disabled",true);
		clearInterval(timerInterval);
	})

	$("#stopTimer").on("click",function(){
		$("#startTimer").prop("disabled",false);
		$("#setTimer_popUp").prop("disabled",false);
		$("#stopTimer").prop("disabled",true);
		$("#pauseTimer").prop("disabled",true);
		$("#quizButtons>button").css("display","none");
		clearInterval(timerInterval);
		timerStarted=false;
		Question=1;
		timeRunout=[];
		$("#clock").html("<span id='days'>- -</span>"
				+ "<span id='hours'>- -</span>"
				+ "<span id='minutes'>- -</span>"
				+ "<span id='seconds'>- -</span>");
		$("#Quizzes").html("<div class='text-center' id='endofQuizBtnRow'><button id='reviewStats' class='btn btn-default' onclick='reviewStats()'>Review Stats</button><button id='reviewQuestions' class='btn btn-default' onclick='reviewQuestions()'>Review Questions</button><button id='restartQuiz' class='btn btn-default' onclick='restartQuiz()' disabled='true'>Restart Quiz</button></div>");
		$("input[valueid=days]").val("");
		$("input[valueid=hours]").val("");
		$("input[valueid=min]").val("");
		$("input[valueid=sec]").val("");
		$("#answers").css("visibility","hidden");
	})


	$("#setTimer_popUp").on("click",function(){
		$("#clock").html("");
		$("#units").html("");
		$("#setTimer_popUp").prop("disabled",true);
		$("#startTimer").prop("disabled",true);
		$("#stopTimer").prop("disabled",true);
		$("#pauseTimer").prop("disabled",true);	
		$(".row.form-inline").css("display","block");
	})

	$("#setTimer").on("click",function(){
		$("#setTimer_popUp").prop("disabled",false);
		$("#startTimer").prop("disabled",false);
		$("#stopTimer").prop("disabled",true);
		$("#pauseTimer").prop("disabled",true);	
		$(".row.form-inline").css("display","none");
	})


	$("#pauseAndShowSolution").on("click",function(){
		$(".note").attr("id","solution");
		clearInterval(timerInterval);
		$('#myModal').modal({backdrop: 'static', keyboard: false});  
		$("#myModal").modal("show");
		$(".note").html("Back to Question");
	})

	$(".note").on("click",function(){
		startTimer("#clock",Question);
		$(".modal-body").html(makeModal_solution());
		$("#pauseTimer").prop("disabled",false);	
	})

	$("#reviewQuestions_game").on("click",function(){
		$(".note").attr("id","review");
		clearInterval(timerInterval);
		$('#myModal').modal({backdrop: 'static', keyboard: false});  
		$("#myModal").modal("show");
		$(".note").html("Back to Question");
		$(".modal-body").html(makeModal_review());
	})

	makeModal_solution=function(){
		innerhtml="<strong>Solution:</strong><br>" + quizObj["question"+Question].solution;
		return innerhtml;
	}

	makeModal_review = function(){
		var days=[],hours=[],minutes=[],seconds=[];

		for (var i=0;i<Object.keys(quizObj).length;i++){
			days[i] = Math.floor(quizObj["question"+(i+1)].timeRemaining/(60*60*24));
			hours[i] = Math.floor(quizObj["question"+(i+1)].timeRemaining/(60*60)) % 24;
			minutes[i] = Math.floor(quizObj["question"+(i+1)].timeRemaining/60) % 60;
			seconds[i] = quizObj["question"+(i+1)].timeRemaining % 60;
		}
		var q1, q2, q3, q4;

		q1= Question==1 ? "<td><strong>Question #1</strong></td>" : "<td>Question #1</td>";
		q2= Question==2 ? "<td><strong>Question #2</strong></td>" : "<td>Question #2</td>";
		q3= Question==3 ? "<td><strong>Question #3</strong></td>" : "<td>Question #3</td>";
		q4= Question==4 ? "<td><strong>Question #4</strong></td>" : "<td>Question #4</td>";

		innerhtml="<table class='table-striped table-bordered'><tr>"+
						"<th>Question</th>"+
						"<th>Remaining Time</th></tr>"+
						"<tr>"+
						q1+
						"<td>"+days[0]+" days " + hours[0] + " hours " + minutes[0] + " minutes " + seconds[0] + " seconds</td></tr>"+
						"<tr>"+
						q2+
						"<td>"+days[1]+" days " + hours[1] + " hours " + minutes[1] + " minutes " + seconds[1] + " seconds</td></tr>"+
						"<tr>"+
						q3+
						"<td>"+days[2]+" days " + hours[2] + " hours " + minutes[2] + " minutes " + seconds[2] + " seconds</td></tr>"+
						q4+
						"<td>"+days[3]+" days " + hours[3] + " hours " + minutes[3] + " minutes " + seconds[3] + " seconds</td></tr>";
		return innerhtml;
	}


	checkAnswer = function(){
		if($('input[name=optradio]:checked', '#answers').val()==null||$('input[name=optradio]:checked', '#answers').val()!=quizObj["question"+Question].correctAnswer){
			quizObj["question"+Question].correct = false;
		} else {
			quizObj["question"+Question].correct = true;
		}
		console.log(quizObj["question"+Question].correct);
	}

	submitAnswer = function(){
		clearInterval(timerInterval);
		quizObj["question"+Question].timeRemaining=0;
		timeRunout.push(Question);		
		checkAnswer();
		nextQ(Question);
	}

	$(document).on("click","input:radio",function () {$("#answers>button").prop("disabled", false)});

})