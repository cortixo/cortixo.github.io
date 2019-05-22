"use strict";

// ai.js

var c = document.getElementById("cortixoUI");
var ctx = c.getContext("2d");

var s_weights = [];
var s_bias = [];
var s_pos = [];

var n_pos = [];
var n_value = [];

var layers = 0;
var layeramount = [];
var expectedout = [];
var loss = 0;
var learningrate = 0.1;

var losschart = [];

var ai_key = "U3VwZXJTaXJCaXJk";

var keeproll = false;

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
      n_value[n_pos.indexOf("L"+evallayer+"P"+(w+1))] = 0.5+(Math.tanh(2*(nodev-0.5))/2);
      evalnode += 1;
    }
    evallayer += 1;
  }
}

function drawUI() {
  
  ctx.clearRect(0, 0, c.width, c.height);
  
  ctx.fillStyle = "lightgrey";
  
  ctx.beginPath();
  ctx.rect(0, 0, c.width, c.height);
  ctx.fill();
  ctx.closePath();
  
  // draw loss
  
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.rect(5, 5, c.width-10, c.height-10);  
  ctx.fill();
  ctx.closePath();
  
  if (losschart.length > 1000) {losschart.shift();}
  
  ctx.strokeStyle = "#33FFA2";
  for (var i = 0; i < losschart.length;i++) {
    ctx.beginPath();
    ctx.moveTo(5+((c.width-10)/losschart.length)*i,c.height-5 - (losschart[i]/4)*(c.height-10));
    if (i == losschart.length-1) {
      ctx.lineTo(5+((c.width-10)/losschart.length)*(i+1),c.height-5 - (losschart[i]/4)*(c.height-10));
    } else {
      ctx.lineTo(5+((c.width-10)/losschart.length)*(i+1),c.height-5 - (losschart[i+1]/4)*(c.height-10));
    }
    ctx.stroke();
    ctx.closePath();
  }
}

function setinputs(inp) {
  for (var iset = 0; iset < layeramount[0]; iset++) {
    n_value[iset] = inp[iset];
  }
}

function getloss() {
  loss = 0;
  for (var iloss = 0; iloss < expectedout.length; iloss++) {
    loss += Math.abs(expectedout[iloss]-n_value[iloss+(n_value.length-(layeramount[layeramount.length-1]))]);
  }
}

function tweak() {
  getloss();
  losschart.push(loss);
  
  var oldloss = loss;
  
  // 1 dimensional gradient (temp)
  
  //var item_ = Math.round(Math.random()*(s_weights.length-1));
  //var add_ = (Math.random()-0.5)*2*learningrate;
  
  //if (Math.round(Math.random()) == 0) {
  //  s_weights[item_] += add_;
  //  evaluatenetwork();
  //  getloss();
  //  if (loss > oldloss) {
  //    s_weights[item_] -= add_*1.2; // slope
  //  }
  //} else {
  //  s_bias[item_] += add_;
  //  evaluatenetwork();
  //  getloss();
  //  if (loss > oldloss) {
  //    s_bias[item_] -= add_*1.2; // slope
  //  }
  //}
  
  // 2 dimensional gradient
  
  var item_a = Math.round(Math.random()*(s_weights.length-1)); 
  if (Math.round(Math.random()) == 0) {var iat = "W"} else {var iat = "B"}
  var item_b = Math.round(Math.random()*(s_weights.length-1));
  if (Math.round(Math.random()) == 0) {var ibt = "W"} else {var ibt = "B"}
  if (item_a != item_b) {
    for (var ika = 0;ika<5;ika++) {
    if(iat=="W"){var item_a_v = s_weights[item_a]}else{var item_a_v = s_bias[item_a]}
    if(ibt=="W"){var item_b_v = s_weights[item_b]}else{var item_b_v = s_bias[item_b]}
    var item_a_tv = item_a_v; var item_b_tv = item_b_v;
    for (var dir = 0;dir<8;dir++) {
      if(iat=="W"){s_weights[item_a] = item_a_v}else{s_bias[item_a] = item_a_v}
      if(ibt=="W"){s_weights[item_b] = item_b_v}else(s_bias[item_b] = item_b_v)
      
      if(iat=="W"){s_weights[item_a] += learningrate*Math.sin(((Math.PI*2)/8)*dir)}else{s_bias[item_a] += learningrate*Math.sin(((Math.PI*2)/8)*dir)}
      if(ibt=="W"){s_weights[item_b] += learningrate*Math.cos(((Math.PI*2)/8)*dir)}else{s_bias[item_b] += learningrate*Math.cos(((Math.PI*2)/8)*dir)}
      
      evaluatenetwork();
      getloss();
      
      if (loss < oldloss) {
        item_a_tv = (item_a_v+(learningrate*Math.sin(((Math.PI*2)/8)*dir)));
        item_b_tv = (item_b_v+(learningrate*Math.cos(((Math.PI*2)/8)*dir)));
        oldloss = loss;
      }
    }
    
    if(iat=="W"){s_weights[item_a] = item_a_tv}else{s_bias[item_a] = item_a_tv}
    if(ibt=="W"){s_weights[item_b] = item_b_tv}else{s_bias[item_b] = item_b_tv}
      if (keeproll == false) {ika = 999}
    }
  }
  
}

function step() {
  //setinputs([1,0,1,0])
  evaluatenetwork();
  tweak();
  drawUI();
  //window.requestAnimationFrame(step);
}

//window.requestAnimationFrame(step);

// cortixo object

try {
window.cortixo = {
  version: "Version 1.0",
  starttime: "19/05/2019 AEST",
  author: "SuperSirBird",
  synapses: function() {return s_pos.length},
  neurons: function() {return n_pos.length},
  reset: function() {s_weights = [];s_bias = [];s_pos = [];n_pos = [];n_value = [];layers = 0;layeramount = [];expectedout = [];loss = 0;learningrate = 0.1;losschart = []},
  setInput: function(n) {setinputs(n)},
  train: function() {step();}, 
  inputLayer: function(n) {createinputs(n)},
  hiddenLayer: function(n) {createlayer(n)},
  outputLayer: function(n) {createlayer(n)},
  expectedOutput: function(n) {expectedout = n},
  run: function() {evaluatenetwork()},
  learnRate: function(n) {learningrate = n},
  optimalRoll: function() {keeproll = true;}
  output: function() {
    var out=[];
    for(var i=0;i<layeramount[layeramount.length-1];i++)
    {
      out.push(n_value[(n_value.length-1)-(layeramount[layeramount.length-1]-1)+i]);
    }; return out;
  }
}

} catch(err) {alert(err)}
