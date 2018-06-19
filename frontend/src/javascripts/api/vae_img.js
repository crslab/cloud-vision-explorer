import fetch from 'cross-fetch';

class VaeImg {
  constructor(baseUrl) {
    this.url = (baseUrl[baseUrl.length - 1] === "/") ? baseUrl : baseUrl + "/";
    this.url += this.is;
  }

  get is() {
    return "VaeImg";
  }

  post(data) {
    return fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    })
    .then(response => response.json());
  }
}

export default VaeImg;
