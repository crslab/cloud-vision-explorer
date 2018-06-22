import VaeImg from "./vae_img.js";
import VaeHistogram from "./vae_histogram.js";
import { gcsBucketName } from '../config.js';

let staticFileUrl = "http://127.0.0.1:5000/"
let devApiUrl = "http://127.0.0.1:5000/api"
const getSourceImageUrl = imgName=> `https://storage.googleapis.com/${gcsBucketName}/image/${imgName}`
const getInterpolatedImageUrl = imgName => `${staticFileUrl}${imgName}`

let VaeImgApi = new VaeImg(devApiUrl);
let VaeHistogramApi = new VaeHistogram(devApiUrl);

export { staticFileUrl, devApiUrl, VaeImgApi, VaeHistogramApi, getSourceImageUrl, getInterpolatedImageUrl };
