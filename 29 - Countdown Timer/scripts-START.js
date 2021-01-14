let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
// IMPORTANT - to stop timer from counting down to zero everytime when not needed = clear any existing timers
	clearInterval(countdown)

	const now = Date.now();  // returns number of milliseconds elapsed since Jan 1, 1970 (i.e time going up by milliseconds)
	const then = now + seconds * 1000; // 1000 milisecond = 1 second
	displayTimeLeft(seconds); //runs countdown immediately in beginning first once
	displayEndTime(then);

	countdown = setInterval(() => {
		const secondsLeft = Math.round((then - Date.now()) / 1000);
		//check if should stop it
		if(secondsLeft < 0) {
			clearInterval(countdown); // stops countdown at 0 and not into minus
			return;
		}
		// display time left 
		displayTimeLeft(secondsLeft);
	}, 1000);
}

function displayTimeLeft(seconds) {
	const minutes = Math.floor(seconds / 60); //will round out decimals to lowest number 
	const remainderMinutes = minutes % 60;
	const remainderSeconds = seconds % 60; // IMPORTANT - e.g 599 / 60 = 9.98333, then remove whole numbers (9) and will show .98333 * 60 = 59 sec
	const hours = Math.floor(minutes / 60);
	// ternary fn below = if the remainderseconds is < 10, then want to return 0 or nothing, and then give remaining seconds left
	const display = `${hours}:${remainderMinutes < 10 ? '0' : ''}${remainderMinutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
	document.title = display; //update title of document to the time countdowning 
	timerDisplay.textContent = display;
}

//when take break at 2:30 and want to show come back by 2:35...
//timestamp = 'then' time created above
function displayEndTime(timestamp) {
	const end = new Date(timestamp);
	const hour = end.getHours();
	//if hour is showing more than 12 then change to reflect
	const adjustedHour = hour > 12 ? hour - 12 : hour;
	const minutes = end.getMinutes();
	//minutes needs to show 10:03 minutes and not 10:3 minutes
	endTime.textContent = `Be Back At ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function startTimer() {
	const seconds = parseInt(this.dataset.time) //dataset gives object details in console 
	console.log(seconds)
	timer(seconds); //can call with timer 
}


buttons.forEach(button => button.addEventListener('click', startTimer));
// below can select form directly by inputting names (i.e. form name=customForm)
//this is when number is inputted into the form box of page 
document.customForm.addEventListener('submit', function(e) {
	e.preventDefault();
	const mins = this.minutes.value;
	console.log(mins);
	timer(mins * 60);
	this.reset(); //clear out value after entered 
})