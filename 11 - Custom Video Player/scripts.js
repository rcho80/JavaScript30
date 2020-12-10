// get elements //
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]'); // anything that has a data-skip element
const ranges = player.querySelectorAll('.player__slider');
const full = player.querySelector('.material-icons');


// build out functions
function togglePlay() {
//paused is property that lives on video.. playing is not a valid property. only paused
	if(video.paused) {
		video.play();  // if video viewer is paused then play...  
	} else {
		video.pause(); //otherwise pause the video when togglePlay() is called
	}
}

function updateButton() {
	const icon = this.paused ? '►' : '❚ ❚'; 
	toggle.textContent = icon; 
}

//having data-skip allows the ability to apply to anything (element, photo...etc)
function skip(){
	//skip is an object of this(video)
	// need to wrap in parsefloat as its a string 
	// below will move video back and forward by the amounts in skip
	video.currentTime += parseFloat(this.dataset.skip); 
}

//volume and video place bar changes with clicks..
function handleRangeUpdate() {
// need to update the properties under video (name and value)
	video[this.name] = this.value;
};

//update progress bar 
/*need to use 100% of bar as measure and then calculate the current % 
of video using property - flexbasis*/
// currentTime and duration and properties of video
function handleProgress() {
	const percent = (video.currentTime / video.duration) * 100;
	progressBar.style.flexBasis = `${percent}%`;
};

//scrub or move the progress bar with clicks by using width numbers
/* offsetX is property within variable(e) and offsetwidth is on progress
 will give the total width number*/
function scrub(e) {
	const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
	video.currentTime = scrubTime;
};


function bigUps() {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (full.webkitRequestFullscreen) { /* Safari */
    video.webkitRequestFullscreen();
  } else if (full.msRequestFullscreen) { /* IE11 */
    video.msRequestFullscreen();
  }
};

// hook up the event listeners
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
full.addEventListener('click', bigUps);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

//need to create a flag variable and set to false... and then is true when mouse click only
// use let for variable as will pass through changes below
let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

