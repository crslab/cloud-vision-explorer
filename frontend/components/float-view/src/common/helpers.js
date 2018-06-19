function loadJSON(filePath, callback) {
  let xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open("GET", filePath, true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = () => {
    if (xobj.readyState === 4 && xobj.status === 200) {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

function getRandomSample(data, sampleSize) {
  let sampleData = [];
  let existingSampledIndices = [];
  for (let i = 0; i < sampleSize; i++) {
    let sampleIndex = Math.floor(Math.random() * data.length);
    while (existingSampledIndices.includes(sampleIndex)) {
      sampleIndex = Math.floor(Math.random() * data.length);
    }
    existingSampledIndices.push(sampleIndex);
    sampleData.push(data[sampleIndex]);
  }
  return sampleData;
}

export { loadJSON, getRandomSample };
