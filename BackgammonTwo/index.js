/*
* @Author: 王文宇
* @Date:   2019-03-14 21:38:35
* @Last Modified by:   王文宇
* @Last Modified time: 2019-03-15 02:31:32
*/
let chess = document.getElementById("chess");
let end = document.getElementById("Winner");
let resetButton = document.getElementById("reset");
const cell = 30;
const maxlength = 50 + cell * 15;
let context = chess.getContext("2d");
let nowState = true;
let isExist = [];
let endState = false;
let lastx = [];
let lasty = [];
let img = new Image();
let wins = [];
let count = 0;
let mywins = [];
let computerwins = [];
img.src = "index.jpg";
img.onload = function() {
	context.drawImage(img, 0, 0, maxlength, maxlength);
	drawLine();
	init();
}

function drawLine() {
	context.strokeStyle = "#000";
	for (let i = 0; i <= 15; i++) {
		context.beginPath();
		context.moveTo(25, 25 + i * cell);
		context.lineTo(maxlength - 25, 25 + i * cell);
		context.stroke();
		context.beginPath();
		context.moveTo(25 + i * cell, 25);
		context.lineTo(25 + i * cell, maxlength - 25);
		context.stroke();
	}	
}
function reset() {
	context.clearRect(0, 0, maxlength, maxlength);
	context.drawImage(img, 0, 0, maxlength, maxlength);
	drawLine();
	isExist = [];
	nowState = true;
	endState = false;
	init();
}
function onestep(x, y, state) {
	lastx.push(x);
	lasty.push(y);
	context.beginPath();
	context.arc(25 + x * cell, 25 + y * cell, 14, 0, 2 * Math.PI);
	context.closePath();
	let now = context.createRadialGradient(25 + x * cell, 25 + y * cell, 9, 25 + x * cell, 25 + y * cell, 3);
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
backButton.addEventListener("click", function() {
	back();
	back();
})
resetButton.addEventListener("click", function() {
	reset();
})
chess.addEventListener("click", function(event) {
	if (endState) return;
	let x = event.offsetX;
	let y = event.offsetY;
	x = Math.floor(x / cell);
	y = Math.floor(y / cell);
	if (check(x, y)) return ;
	onestep(x, y, true);
	for (let k = 0; k < count; k++) {
		if(wins[x][y][k]) {
			mywins[k]++;
		}
	}
	let nowWinner = checkWinner(x, y);
	if (nowWinner) {
		Winner.innerHTML = "The Winner is " + nowWinner;
		endState = true;
	} else {
		Winner.innerHTML = "The next player is computer";
	}
	setTimeout(AI, 200);
})
function AI() {
	if (endState) return;
	let myScore = [];
    let computerScore = [];
    let max = 0;
    let u = 0, v = 0;
    for(let i = 0; i < 15; i++){
        myScore[i] = [];
        computerScore[i] = [];
        for(let j = 0; j < 15; j++){
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
    for(let i = 0; i < 15; i++){
        for(let j = 0; j < 15; j++){
            if(isExist[i][j] === null){
                for(let k = 0; k < count; k++){
                    if(wins[i][j][k]){
                        if(mywins[k] == 1){
                            myScore[i][j] += 50;
                        }else if(mywins[k] == 2){
                            myScore[i][j] += 500;
                        }else if(mywins[k] == 3){
                            myScore[i][j] += 1000;
                            
                        }else if(mywins[k] == 4){
                            myScore[i][j] += 20000;
                        }
                        
                        if(computerwins[k] == 1){
                            computerScore[i][j] += 49;
                        }else if(computerwins[k] == 2){
                            computerScore[i][j] += 420;
                        }else if(computerwins[k] == 3){
                            computerScore[i][j] += 900;
                        }else if(computerwins[k] == 4){
                            computerScore[i][j] += 19000;
                        }                        
                    }
                }
                
                if(myScore[i][j] > max){
                    max  = myScore[i][j];
                    u = i;
                    v = j;
                }else if(myScore[i][j] == max){
                    if(computerScore[i][j] > computerScore[u][v]){
                        u = i;
                        v = j;    
                    }
                }
                
                if(computerScore[i][j] > max){
                    max  = computerScore[i][j];
                    u = i;
                    v = j;
                }else if(computerScore[i][j] == max){
                    if(myScore[i][j] > myScore[u][v]){
                        u = i;
                        v = j;    
                    }
                }
            }
        }
    }
    onestep(u, v, false);
    for (let k = 0; k < count; k++) {
    	if (wins[u][v][k]) {
    		computerwins[k]++;
    	}
    }
    let nowWinner = checkWinner(u, v);
	if (nowWinner) {
		Winner.innerHTML = "The Winner is " + nowWinner;
		endState = true;
	} else {
		Winner.innerHTML = "The next player is you!";
	}
}
function init() {
	for (let i = 0; i < 16; i++) {
		isExist.push(Array(16).fill(null));
	}
	//赢法数组
    for(let i = 0; i < 15; i++){
        wins[i] = [];
        for(let j = 0; j < 15; j++){
            wins[i][j] = [];
        }
    }
    //横线赢法
    for(let i = 0; i < 15; i++){
        for(let j = 0; j < 11; j++){
            for(let k = 0; k < 5; k++){
                wins[i][j+k][count] = true;
            }
            count++;
        }
    }
    //竖线赢法
    for(let i = 0; i < 15; i++){
        for(let j = 0; j < 11; j++){
            for(let k = 0; k < 5; k++){
                wins[j+k][i][count] = true;
            }
            count++;
        }
    }
    //正斜线赢法
    for(let i = 0; i < 11; i++){
        for(let j = 0; j < 11; j++){
            for(let k = 0; k < 5; k++){
                wins[i+k][j+k][count] = true;
            }
            count++;
        }
    }
    //反斜线赢法
    for(let i = 0; i < 11; i++){ 
        for(let j = 14; j > 3; j--){
            for(let k = 0; k < 5; k++){
                wins[i+k][j-k][count] = true;
            }
            count++;
        }
    }
    for (let i = 0; i < count; i++) {
    	mywins.push(0);
    	computerwins.push(0);
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

function back() {
	endState = false;
	if (lastx.length == 0) return ;
	let backx = lastx.pop();
	let backy = lasty.pop();
	isExist[backx][backy] = null;
	context.drawImage(img, 11 + backx * cell, 11 + backy * cell, 28, 28);
	context.beginPath();
	context.moveTo(25 + backx * cell, 11 + backy * cell);
	context.lineTo(25 + backx * cell, 39 + backy * cell);
	context.stroke();
	context.beginPath();
	context.moveTo(11 + backx * cell, 25 + backy * cell);
	context.lineTo(39 + backx * cell, 25 + backy * cell);
	context.stroke();
}
