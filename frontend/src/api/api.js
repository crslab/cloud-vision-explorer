import VaeImg from "api/vae_img.js";
import VaeHistogram from "api/vae_histogram.js";

let staticFileUrl = "http://127.0.0.1:5000/"
let devApiUrl = "http://127.0.0.1:5000/api"

let VaeImgApi = new VaeImg(devApiUrl);
let VaeHistogramApi = new VaeHistogram(devApiUrl);

export { staticFileUrl, devApiUrl, VaeImgApi, VaeHistogramApi };
