const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
	navigator.mediaDevices.getUserMedia({ video: true, audio: false })
		.then(localMediaStream => {
		console.log(localMediaStream);
		//in order for a video to work, it needs to be converted to some type of URL//
		video.srcObject = localMediaStream; 
		video.play();
		})
		//in case not have access to someones webcam
		.catch(err => {
			console.error(`Oh No`, err);
		});
};

//take a frame and paint on to the screen
function paintToCanvas() {
	const width = video.videoWidth;
	const height = video.videoHeight;
	canvas.width = width;
	canvas.height = height;
	
	//take an image every interval and place into canvas
	//use return on setInterval to be able to clear it anytime if needed (clear.setInterval)
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    // mess with them
    // pixels = redEffect(pixels);

    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.8;

    pixels = greenScreen(pixels);
    // put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
	//play the sound
	snap.currentTime = 0;
	snap.play();

	//take the data out of the canvas
	const data = canvas.toDataURL('image/jpeg');
	console.log(data);
	const link = document.createElement('a');
	link.href = data;
	link.setAttribute('download', 'lindo');
	link.innerHTML = `<img src="${data}" alt="Lindo homem" />`;
	strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;

}

getVideo();

// how to play video automatically on page loads
//once video plays, it will trigger an event 'canplay' that will run paintToCanvas
video.addEventListener('canplay', paintToCanvas);