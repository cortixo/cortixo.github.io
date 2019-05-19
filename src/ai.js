// ai.js

var c = document.getElementById("myCanvas");
var ctx=c.getContext("2d");
c.width  = window.innerWidth;
c.height = window.innerHeight;

var s_weights = [];
var s_bias = [];
var s_pos = [];

var n_pos = [];
var n_value = [];

var layers = 0;
var layeramount = [];

var ai_key = "U3VwZXJTaXJCaXJk";

function createinputs(a) {
  try {
  layeramount.push(a);
  layers += 1;
  
  for (var i = 0; i < a; i++) {
    n_pos.push("L"+layers+"P"+(i+1));
    n_value.push(0);
  }} catch(err) {alert(err)}
}

function createlayer(a) {
  try {
  layeramount.push(a);
  layers += 1
  
  for (var i = 0; i < a; i++) {
    n_pos.push("L"+layers+"P"+(i+1));
    n_value.push(0);
    for (var w = 0; w < layeramount[layers-1]; w++) {
      spos.push("fL"+(layers-1)+"P"+(w+1)+"tL"+layers+"P"+(i+1));
      s_weights.push(0.5);
      s_bias.push(0);
    }
  }} catch(err) {alert(err)}
}
try{
createinputs(4);
createlayer(5);} catch(err) {alert(err)}

function drawUI() {
  try { 
  for (var i = 0; i < 4; i++) {
    ctx.beginPath();
    //ctx.lineWidth = "6";
    ctx.strokeStyle = "lightgrey";
    ctx.rect(20+(((c.width-40)/4)*i), 20, (c.width-20)/4)-20, 340);  
    //ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }
  } catch(err) {alert(err)}
}

function step() {
  try {
  drawUI();
  window.requestAnimationFrame(step());} catch(err) {alert(err)}
}
try{
window.requestAnimationFrame(step());} catch(err) {alert(err)}
