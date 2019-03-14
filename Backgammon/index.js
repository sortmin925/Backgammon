/*
* @Author: 王文宇
* @Date:   2019-03-14 21:38:35
* @Last Modified by:   王文宇
* @Last Modified time: 2019-03-14 23:06:00
*/
let chess = document.getElementById("chess");
let end = document.getElementById("Winner");
let resetButton = document.getElementById("reset");
let context = chess.getContext("2d");
let nowState = true;
let isExist = [];
let endState = false;

let img = new Image();
img.src = "index.jpg";
img.onload = function() {
	context.drawImage(img, 0, 0, 500, 500);
	drawLine();
	init();
}
function drawLine() {
	context.strokeStyle = "#000";
	for (let i = 0; i <= 15; i++) {
		context.beginPath();
		context.moveTo(25, 25 + i * 30);
		context.lineTo(475, 25 + i * 30);
		context.stroke();
		context.beginPath();
		context.moveTo(25 + i * 30, 25);
		context.lineTo(25 + i * 30, 475);
		context.stroke();
	}	
}
function reset() {
	context.clearRect(0, 0, 500, 500);
	context.drawImage(img, 0, 0, 500, 500);
	drawLine();
	isExist = [];
	nowState = true;
	endState = false;
	init();
}
function onestep(x, y, state) {
	context.beginPath();
	context.arc(25 + x * 30, 25 + y * 30, 14, 0, 2 * Math.PI);
	context.closePath();
	let now = context.createRadialGradient(25 + x * 30, 25 + y * 30, 9, 25 + x * 30, 25 + y * 30, 3);
	if (state) {
		now.addColorStop(0, "#0a0a0a");
		now.addColorStop(1, "#636766");
		isExist[x][y] = 'Black';
	} else {
		now.addColorStop(0, "#D3D3D3");
		now.addColorStop(1, "#F9F9F9");
		isExist[x][y] = 'White';
	}
	context.fillStyle = now;
	context.fill();
	//context.stroke();
}

resetButton.addEventListener("click", function() {
	reset();
})
chess.addEventListener("click", function(event) {
	if (endState) return;
	let x = event.offsetX;
	let y = event.offsetY;
	x = Math.floor(x / 30);
	y = Math.floor(y / 30);
	if (check(x, y)) return ;
	onestep(x, y, nowState);
	nowState = !nowState;
	let nowWinner = checkWinner(x, y);
	if (nowWinner) {
		Winner.innerHTML = "The Winner is " + nowWinner;
		endState = true;
	} else {
		Winner.innerHTML = "The next player is " + (nowState ? 'Black' : 'White');
	}
})

function init() {
	for (let i = 0; i < 16; i++) {
		isExist.push(Array(16).fill(null));
	}
}

function check(x, y) {
	return isExist[x][y] ? true : false;
}

function checkWinner(x, y) {
	let checkX = [
		[-4, -3, -2, -1, 0],
		[-3, -2, -1, 0, 1],
		[-2, -1, 0, 1, 2],
		[-1, 0, 1, 2, 3],
		[0, 1, 2, 3, 4],
	]
	let checkY = [
		[-4, -3, -2, -1, 0],
		[-3, -2, -1, 0, 1],
		[-2, -1, 0, 1, 2],
		[-1, 0, 1, 2, 3],
		[0, 1, 2, 3, 4],
	]
	for (let i = 0; i < checkX.length; i++) {
		let num = 0;
		for (let j = 0; j < 5; j++) {
			let nowX = x + checkX[i][j];
			let nowY = y;
			if (checkCorrect(nowX, nowY)) break;
			else if(isExist[x][y] === isExist[nowX][nowY]) num++;
		}
		if (num === 5) return isExist[x][y];
	}
	for (let i = 0; i < checkY.length; i++) {
		let num = 0;
		for (let j = 0; j < 5; j++) {
			let nowX = x;
			let nowY = y + checkY[i][j];
			if (checkCorrect(nowX, nowY)) break;
			else if(isExist[x][y] === isExist[nowX][nowY]) num++;
		}
		if (num === 5) return isExist[x][y];
	}
	for (let i = 0; i < checkY.length; i++) {
		let num = 0;
		for (let j = 0; j < 5; j++) {
			let nowX = x + checkX[i][j];
			let nowY = y + checkY[i][j];
			if (checkCorrect(nowX, nowY)) break;
			else if(isExist[x][y] === isExist[nowX][nowY]) num++;
		}
		if (num === 5) return isExist[x][y];
	}
	for (let i = 0; i < checkY.length; i++) {
		let num = 0;
		for (let j = 0; j < 5; j++) {
			let nowX = x - checkX[i][j];
			let nowY = y + checkY[i][j];
			if (checkCorrect(nowX, nowY)) break;
			else if(isExist[x][y] === isExist[nowX][nowY]) num++;
		}
		if (num === 5) return isExist[x][y];
	}
	return null;

}

function checkCorrect(x, y) {
	if (x < 0 || y < 0 || x >= 16 || y >= 16) return true;
	else return false;
}