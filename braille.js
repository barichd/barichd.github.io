"use strict"

var DOT1 = 1 << 0;
var DOT2 = 1 << 1;
var DOT3 = 1 << 2;
var DOT4 = 1 << 3;
var DOT5 = 1 << 4;
var DOT6 = 1 << 5;
var DOT7 = 1 << 6;
var DOT8 = 1 << 7;

var VKCODES_TO_DOTS = new Object();
VKCODES_TO_DOTS[70] = DOT1; // f
VKCODES_TO_DOTS[68] = DOT2; // d
VKCODES_TO_DOTS[83] = DOT3; // s
VKCODES_TO_DOTS[74] = DOT4; // j
VKCODES_TO_DOTS[75] = DOT5; // k
VKCODES_TO_DOTS[76] = DOT6; // l
VKCODES_TO_DOTS[65] = DOT7; // a
VKCODES_TO_DOTS[186] = DOT8; // ;
VKCODES_TO_DOTS[82] = DOT1; // r
VKCODES_TO_DOTS[69] = DOT2; // e
VKCODES_TO_DOTS[87] = DOT3; // w
VKCODES_TO_DOTS[85] = DOT4; // u
VKCODES_TO_DOTS[73] = DOT5; // i
VKCODES_TO_DOTS[79] = DOT6; // o
VKCODES_TO_DOTS[81] = DOT7; // q
VKCODES_TO_DOTS[80] = DOT8; // p
VKCODES_TO_DOTS[32] = 0; // space

var trappedKeys = new Set()
var trappedButtons = new Set()
var gesture = null
var brailleInput = document.getElementById("brailleInput");
var textReader = document.getElementById("textReader")

var typeChar = function() {
    var oldValue = brailleInput.value;
    var newCaretPos = brailleInput.selectionStart + 1;
	var brailleChar = String.fromCharCode(gesture | 0x2800);
	brailleInput.value = String.substr(oldValue,0,brailleInput.selectionStart) + brailleChar + String.substr(oldValue, brailleInput.selectionEnd);
	brailleInput.setSelectionRange(newCaretPos, newCaretPos);
	textReader.innerHTML = brailleChar;
    gesture = null;
}

var getDot = function(obj) {
    var id = parseInt(obj.id)
    if (id > 0) {
        return Math.pow(2,id-1)
    } else {
        return 0
    }
}

var buttonDown = function(event) {
    var dot = getDot(event.target)
    //alert(dot)
    trappedButtons.add(dot)
    if (dot == 0) gesture = 0;
		else gesture |= dot;
}

var buttonUp = function(event) {
        var dot = getDot(event.target)
   		if (trappedButtons.has(dot)) {
            trappedButtons.delete(dot);
        }
		if (trappedButtons.size == 0) {
			//if (e.shiftKey) gesture ^= 0xFF;
			typeChar()
		}

}

brailleInput.onkeydown = function(e) {
		if (e.ctrlKey | e.altKey) return;
		if (e.key.length == 1) e.preventDefault(); //block typing of printable characters
		var dot = VKCODES_TO_DOTS[e.which];
		if (dot === undefined) return;
		trappedKeys.add(e.which);
		if (dot == 0) gesture = 0;
			else gesture |= dot;
	}

brailleInput.onkeyup = function(e) {
		e.preventDefault();
		if (!trappedKeys.has(e.which)) return;
		trappedKeys.delete(e.which);
		if (trappedKeys.size == 0) {
			if (e.shiftKey) gesture ^= 0xFF;
			typeChar()
		}
	}
    
for (var i = 0; i <= 6; i++){
    var btn = document.getElementById(i.toString())
    btn.onmousedown = buttonDown
    btn.onmouseup = buttonUp
    btn.ontouchstart = buttonDown
    btn.ontouchend = buttonUp
}