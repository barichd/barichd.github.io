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
var gesture = null

$(document).ready(function(){
	$("#brailleInput").on("keydown", function(e) {
			var dot = VKCODES_TO_DOTS[e.which];
			if (e.ctrlKey | e.altKey) return;
			if (e.key.length == 1) e.preventDefault(); //block typing of printable characters
			if (dot === undefined) return;
			trappedKeys.add(e.which);
			if (dot == 0) gesture = 0;
				else gesture |= dot;
		}).on("keyup", function(e) {
			e.preventDefault();
			if (!trappedKeys.has(e.which)) return;
			trappedKeys.delete(e.which);
			if (trappedKeys.size == 0) {
				if (e.shiftKey) gesture ^= 0xFF;
				var oldValue = $("#brailleInput").val();
				var newCaretPos = $("#brailleInput").selectionStart + 1;
				var brailleChar = String.fromCharCode(gesture | 0x2800);
				$("#brailleInput").val(String.substr(oldValue,0,$("#brailleInput").selectionStart) + brailleChar + String.substr(oldValue, $("#brailleInput").selectionEnd));
				$("#brailleInput").setSelectionRange(newCaretPos, newCaretPos);
				$("#textReader").html(brailleChar);
				gesture = null;
			}
		});
});