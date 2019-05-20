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
var expectedout = [];
var loss = 0;

var losschart = [];

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
  ctx.rect(20+(((c.width-20)/4)*0), 20, ((((c.width-20)/4)-20)*2)+20, c.height-40);  
  ctx.fill();
  ctx.closePath();
  
  for (var i = 2; i < 4; i++) {
    ctx.beginPath();
    //ctx.lineWidth = "6";
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
  var learningrate = 0.1;
  
  // 2 dimensional gradienting
  var d_s = [];
  var d_st = [];
  
  var d_sv = [];
  
  var d_sl = [];
  try {
  if (Math.round(Math.random()) == 0) {d_s.push(Math.round(Math.random()*(s_weights.length-1)));d_st.push("W");d_sv.push(s_weights[d_s[0]]);} 
  else {d_s.push(Math.round(Math.random()*(s_bias.length-1)));d_st.push("B");d_sv.push(s_bias[d_s[0]]);}
  
  if (Math.round(Math.random()) == 0) {d_s.push(Math.round(Math.random()*(s_weights.length-1)));d_st.push("W");d_sv.push(s_weights[d_s[1]]);}
  else {d_s.push(Math.round(Math.random()*(s_bias.length-1)));d_st.push("B");d_sv.push(s_bias[d_s[1]]);}
  
  if (d_s[0] != d_s[1]) {
  
  if(d_st[0]=="W") {s_weights[d_s[0]] -= 0.3} if(d_st[0]=="B") {s_bias[d_s[0]] -= 0.3}
  if(d_st[1]=="W") {s_weights[d_s[1]] -= 0.3} if(d_st[1]=="B") {s_bias[d_s[1]] -= 0.3}
  
  for (var i_ = -2; i_ < 3; i_++) {
    if(d_st[0]=="W") {s_weights[d_s[0]] += 0.1} if(d_st[0]=="B") {s_bias[d_s[0]] += 0.1} d_sv[0]+=0.1;
    
    for (var w_ = -2; w_ < 3; w_++) {
      if(d_st[1]=="W") {s_weights[d_s[1]] += 0.1} if(d_st[1]=="B") {s_bias[d_s[1]] += 0.1} d_sv[1]+=0.1;
      evaluatenetwork();
      getloss();
      if (loss < oldloss) {d_sl = [(d_sv[0]),(d_sv[1])]; oldloss = loss};
    }
    if(d_st[1]=="W") {s_weights[d_s[1]] -= 0.5} if(d_st[1]=="B") {s_bias[d_s[1]] -= 0.5}
  }
  if(d_st[0]=="W") {s_weights[d_s[0]] -= 0.2} if(d_st[0]=="B") {s_bias[d_s[0]] -= 0.2}
  if(d_st[1]=="W") {s_weights[d_s[1]] += 0.2} if(d_st[1]=="B") {s_bias[d_s[1]] += 0.2}
  
  if (d_st[0]=="W") {s_weights[d_s[0]] = d_sv}if (d_st[0]=="B") {s_bias[d_s[0]] = d_sv}
  if (d_st[1]=="W") {s_weights[d_s[1]] = d_sv}if (d_st[1]=="B") {s_bias[d_s[1]] = d_sv}
  }
  evaluatenetwork();
  getloss();} catch(err) {alert(err);}
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
  synapses: s_pos.length,
  neurons: n_pos.length,
  setInput: function(n) {setinputs(n);},
  train: function() {step();}, 
  inputLayer: function(n) {createinputs(n)},
  hiddenLayer: function(n) {createlayer(n)},
  outputLayer: function(n) {createlayer(n)},
  expectedOutput: function(n) {expectedout = n},
  output: function() {
    var out=[];
    for(var i=0;i<layeramount[layeramount.length-1];i++)
    {
      out.push(n_value[(n_value.length-1)-(layeramount[layeramount.length-1]-1)+i]);
    }; return out;
  }
}

} catch(err) {alert(err)}
