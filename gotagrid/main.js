// Variables
const body = document.body;
const buttonContainer = document.querySelector('.button-container');
const highscoreContainer = document.querySelector('.high-score-container');
const highscoreOutput = document.querySelector('.high-score-output');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const grid = document.getElementById('gota-grid');
const timer = document.querySelector('.timer');
const timerOutput = document.getElementById('timer-output');
let isAppActive = false;

// Timeouts
let interval;
let timeOuts = [];
// Timer
let isTimerRunning = false;
let time;
let elapsedTime = 0; // 1 = 100ms
let lastElapsedTime = 0; // 1 = 100ms
// Highscore
let highscore = localStorage.getItem('highscore') || '0:00:00:00';
let bestElapsedTime = localStorage.getItem('best-time') || 0;
highscoreOutput.textContent = highscore;

/* Song used in this website:
Hotel Transylvania 3 - Macarena Song
https://www.youtube.com/watch?v=b1846UYK_j4 */
const music = new Audio('audio/gota.mp3');

// Evenlisteners
startBtn.addEventListener('click', appStart); /* starts app */
stopBtn.addEventListener('click', appStop); /* stops timer and initializes app */
window.addEventListener('keyup', appStop); /* stops timer and initializes app */

// Gota running Loop
function startDance() {
	interval = setInterval(animateGotas, 50000); // 50s
}
function stopDance() {
	clearInterval(interval);
}

// Start App
function appStart() {
	isAppActive = true;
	toggleMusic();
	populateGrid(1, 1);
	animateGotas();
	startTimer();
	toggleUI();
	startDance();
}

// Kill App
function appStop(e) {
	let userInput = e.keyCode;
	let escClick = e.target.id === 'stop-btn';
	if (userInput === 27 || escClick) {
		isAppActive = false;
		toggleMusic();
		stopTimer();
		saveHighscore();
		toggleUI();
		animateGotas();
		stopDance();
	}
}

function toggleMusic() {
	if (isAppActive) {
		music.loop = true; // loop music
		music.play();
	} else {
		music.pause();
		music.currentTime = 0;
	}
}

function toggleUI() {
	if (isAppActive) {
		buttonContainer.classList.toggle('hide', true);
		highscoreContainer.classList.toggle('hide', true);
		highscoreOutput.textContent = localStorage.getItem('highscore') || '0:00:00:00';
		body.style.backgroundImage = 'none';
		body.style.backgroundColor = '#fbfbfb';
	} else {
		initialState();
	}
}

const saveHighscore = () => {
	if (lastElapsedTime > bestElapsedTime) {
		bestElapsedTime = lastElapsedTime;
		localStorage.setItem('highscore', time);
		localStorage.setItem('best-time', lastElapsedTime);
	}
};

// spawn gotas
function spawnGotas(amount) {
	for (let i = 0; i < amount; i++) {
		let newGota = document.createElement('div');
		newGota.classList.add('box');
		/* Dancing gota GIF by:
		https://indikacartoon.blogspot.com/2015/07/mahinda-and-ranil-animated-gif.html */
		newGota.innerHTML = `<img src="images/gotagif.gif" alt="">`;
		grid.append(newGota);
	}
}

function despawnGotas(amount) {
	for (let i = 0; i < amount; i++) {
		grid.children[0].remove();
	}
}

// App initial state
function initialState() {
	grid.innerHTML = '';
	timer.classList.toggle('show', false);
	body.style.backgroundImage = 'radial-gradient(#fff, #aaa)';
	buttonContainer.classList.toggle('hide', false);
	highscoreContainer.classList.toggle('hide', false);
	highscoreOutput.textContent = localStorage.getItem('highscore') || '0:00:00:00';
}

// Gota running logic
function animateGotas() {
	let delay = 5000;

	if (isAppActive) {
		timeOuts[0] = setTimeout(() => populateGrid(2, 1), delay); // 2 ranils & mahindas
		timeOuts[1] = setTimeout(() => populateGrid(2, 2), delay * 2); // 4 ranils & mahindas
		timeOuts[2] = setTimeout(() => populateGrid(4, 4), delay * 3); // 8 ranils & mahindas
		timeOuts[3] = setTimeout(() => populateGrid(8, 8), delay * 4); // 16 ranils & mahindas
		timeOuts[4] = setTimeout(() => populateGrid(8, 16), delay * 5); // 32 ranils & mahindas
		timeOuts[5] = setTimeout(() => dePopulateGrid(8, 16), delay * 6); // 16 ranils & mahindas
		timeOuts[6] = setTimeout(() => dePopulateGrid(4, 8), delay * 7); // 8 ranils & mahindas
		timeOuts[7] = setTimeout(() => dePopulateGrid(2, 4), delay * 8); // 4 ranils & mahindas
		timeOuts[8] = setTimeout(() => dePopulateGrid(2, 2), delay * 9); // 2 ranils & mahindas
		timeOuts[9] = setTimeout(() => dePopulateGrid(1, 1), delay * 10); // 1 ranil & mahinda
	} else {
		timeOuts.forEach((timeOut) => {
			clearTimeout(timeOut);
		});
	}
}
// End gota running logic

function populateGrid(columns, gotas) {
	if (window.innerWidth <= 768) {
		if (columns > 2) {
			columns = columns / 2;
		} // small screens
	}
	grid.style.cssText = `grid-template-columns: repeat(${columns}, 1fr);`;
	spawnGotas(gotas);
}

function dePopulateGrid(columns, gotas) {
	if (window.innerWidth <= 768) {
		if (columns > 2) {
			columns = columns / 2;
		} // small screens
	}
	grid.style.cssText = `grid-template-columns: repeat(${columns}, 1fr);`;
	despawnGotas(gotas);
}

function startTimer() {
	timer.classList.toggle('show', true);
	window.scrollTo({
		top: window.innerHeight,
		left: 0,
		behavior: 'smooth'
	});
	if (isTimerRunning == false) {
		isTimerRunning = true;
		increment();
	}
}

function stopTimer() {
	lastElapsedTime = elapsedTime;
	isTimerRunning = false;
	elapsedTime = -1;
	timerOutput.innerHTML = '0:00:00:00';
}

function increment() {
	if (isTimerRunning == true) {
		setTimeout(() => {
			elapsedTime++;
			let hours = Math.floor(elapsedTime / 10 / 60 / 60);
			let mins = Math.floor(elapsedTime / 10 / 60);
			let secs = Math.floor((elapsedTime / 10) % 60); // returns remainder when divided (always shows a number below 60)
			let tenths = elapsedTime % 10; // returns remainder when divided (always shows a number below 10)
			if (mins < 10) {
				mins = `0${mins}`;
			}
			if (secs < 10) {
				secs = `0${secs}`;
			}
			time = `${hours}:${mins}:${secs}:${tenths}0`;
			timerOutput.innerHTML = time;
			increment();
		}, 100);
	}
}
