let exampleAreaId = "ex2";
let resetBtnId = "ex2__btn";
let inputNumId = "ex2__num";
let sliderId = "ex2__slider";
let startEventTextId = "ex2__text-start";
let moveEventTextId = "ex2__text-move";
let stopEventTextId = "ex2__text-stop";
let valueTextId = "ex2__text-value";

let clickCount = 0;
let pointList = [{}, {}];
function clickHandler(e) {
  if (clickCount == 2) {
    return;
  }
  pointList[clickCount] = {
    x: e.offsetX,
    y: e.offsetY
  };
  drawSliders();
  clickCount++;
}

function drawSliders() {
  let slider = document.getElementById(sliderId);
  if (!slider) {
    slider = document.createElement("dynamic-slider");
    document.getElementById(exampleAreaId).append(slider);
  }
  slider.id = sliderId;
  slider.lineThickness = 2;
  slider.handleRadius = 8;
  slider.x1 = pointList[0].x;
  slider.y1 = pointList[0].y;
  slider.x2 = pointList[1].x;
  slider.y2 = pointList[1].y;
}

function resetDrawing() {
  let box1x = Math.floor((Math.random() * 180) + 1);
  let box1y = Math.floor((Math.random() * 180) + 1);
  let box2x = Math.floor((Math.random() * 180) + 1);
  let box2y = Math.floor((Math.random() * 180) + 1);
  document.getElementById(exampleAreaId).innerHTML = `
    <svg width=200 height=200 style="position: absolute;">
      <rect x="${box1x}" y="${box1y}" width="20" height="20" style="fill:rgb(0,0,0,0);stroke-width:2;stroke:rgb(0,0,0)" />
      <rect x="${box2x}" y="${box2y}" width="20" height="20" style="fill:rgb(0,0,0,0);stroke-width:2;stroke:rgb(0,0,0)" />
    </svg>
  `;
  clickCount = 0;
  pointList = [{}, {}];
  document.getElementById(startEventTextId).style.color = "black";
  document.getElementById(moveEventTextId).style.color = "black";
  document.getElementById(stopEventTextId).style.color = "black";
  document.getElementById(valueTextId).innerHTML = `test`;
}

function injectInputValue(e) {
  let slider = document.getElementById(sliderId);
  if (!slider) {
    return;
  }
  slider.val = e.target.value;
}

function sliderStart(e) {
  document.getElementById(startEventTextId).style.color = "red";
  document.getElementById(moveEventTextId).style.color = "black";
  document.getElementById(stopEventTextId).style.color = "black";
  document.getElementById(valueTextId).innerHTML = `${e.detail.proportion}`;
}

function sliderMove(e) {
  document.getElementById(startEventTextId).style.color = "black";
  document.getElementById(moveEventTextId).style.color = "red";
  document.getElementById(stopEventTextId).style.color = "black";
  document.getElementById(valueTextId).innerHTML = `${e.detail.proportion}`;
}

function sliderStop(e) {
  document.getElementById(startEventTextId).style.color = "black";
  document.getElementById(moveEventTextId).style.color = "black";
  document.getElementById(stopEventTextId).style.color = "red";
  document.getElementById(valueTextId).innerHTML = `${e.detail.proportion}`;
}

document.getElementById(exampleAreaId).addEventListener("click", clickHandler);
document.getElementById(resetBtnId).addEventListener("click", resetDrawing);
document.getElementById(inputNumId).addEventListener("input", injectInputValue);
document.getElementById(exampleAreaId).addEventListener("slider-start", sliderStart);
document.getElementById(exampleAreaId).addEventListener("slider-move", sliderMove);
document.getElementById(exampleAreaId).addEventListener("slider-stop", sliderStop);
