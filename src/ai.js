"use strict";

// ai.js

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
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
  layeramount.push(a);
  layers += 1;
  
  for (var i = 0; i < a; i++) {
    n_pos.push("L"+layers+"P"+(i+1));
    n_value.push(0);
  }
}

function createlayer(a) {
  
  layeramount.push(a);
  layers += 1
  
  for (var i = 0; i < a; i++) {
    n_pos.push("L"+layers+"P"+(i+1));
    n_value.push(0);
    for (var w = 0; w < layeramount[layers-2]; w++) {
      s_pos.push("fL"+(layers-1)+"P"+(w+1)+"tL"+layers+"P"+(i+1));
      s_weights.push(0.5);
      s_bias.push(0);
    }
  }
}

function evaluatenetwork() {
  var evallayer = 2;
  for (var i = 0; i < (layeramount.length-1);i++) {
    var evalnode = 1;
    for (var w = 0;w<layeramount[evallayer-1];w++) {
      var nodev = 0;
      for (var c = 0; c<layeramount[evallayer-2]; c++) {
        var fspos = s_pos.indexOf("fL"+(evallayer-1)+"P"+(c+1)+"tL"+evallayer+"P"+(w+1));
        nodev += (n_value[n_pos.indexOf("L"+(evallayer-1)+"P"+(c+1))]*s_weights[fspos])+s_bias[fspos];
      }
      n_value[n_pos.indexOf("L"+evallayer+"P"+(w+1))] = nodev;
      evalnode += 1;
    }
    evallayer += 1;
  }
}

function drawUI() {
  for (var i = 0; i < 4; i++) {
    ctx.beginPath();
    //ctx.lineWidth = "6";
    ctx.fillStyle = "lightgrey";
    ctx.rect(20+(((c.width-20)/4)*i), 20, ((c.width-20)/4)-20, 340);  
    //ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }
}

function setinputs(inp) {
  for (var i = 0; i < layeramount[0]; i++) {
    n_value[i] = inp[i];
  }
}

function step() {
  //setinputs([1,0,1,0])
  evaluatenetwork();
  drawUI();
  window.requestAnimationFrame(step);
}

createinputs(4);
createlayer(5);
createlayer(1);

//window.requestAnimationFrame(step);

// cortixo object

try {
window.cortixo = {
  version: "Version 1.0",
  starttime: "19/05/2019 AEST",
  author: "SuperSirBird",
  synapses: s_pos.length,
  neurons: n_pos.length,
  setInput: function(n) {setinputs(n);},
  train: function() {step();}, 
  inputLayer: function(n) {createinputs(n)},
  hiddenLayer: function(n) {createlayer(n)},
  outputLayer: function(n) {createlayer(n)},
  output: function() {
    var out=[];
    for(var i=0;i<layeramount[layeramount.length-1];i++)
    {
      out.push(n_value[(n_value.length-1)-(layeramount[layeramount.length-1]-1)+i]);
    }; return out;
  }
}

} catch(err) {alert(err)}
