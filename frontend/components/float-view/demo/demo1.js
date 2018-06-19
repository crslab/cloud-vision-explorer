import { loadJSON, getRandomSample } from "../src/common/helpers.js";
import CustomEventsCollection from "../src/common/customEvents.js";

function mouseOverDataHandler(e) {
  console.log(JSON.stringify(e.detail.filename));
}

//let filePath = "../data/movies.json";
let filePath = "../data/artdata.json";
let elementOneId = "floatViewTest1";

loadJSON(filePath, response => {
  let data = JSON.parse(response);
  let sampleData = getFixedSample(data, 80); //1000
  document.getElementById(elementOneId).objectArray = sampleData;
  document.getElementById(elementOneId).addEventListener(CustomEventsCollection.mouseOverData, mouseOverDataHandler)
});
