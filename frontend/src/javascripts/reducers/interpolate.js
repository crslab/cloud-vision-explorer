import { staticFileUrl, VaeImgApi, VaeHistogramApi } from 'javascripts/api/api.js';
import data from 'data/artdataWithImgSize.json'

// Action types
export const types = {
  ADD_START: "ADD_START",
  ADD_END: "ADD_END",
  PIN_POSITIONS: "PIN_POSITIONS",
  INTERPOLATE_REQ: "INTERPOLATE_REQ",
  INTERPOLATE_RESP: "INTERPOLATE_RESP",
  HISTOGARM_REQ: "HISTOGRAM_REQ",
  HISTOGARM_RESP: "HISTOGRAM_RESP",
  API_ERR: "API_ERR",
  RESET: "RESET"
};

// Action creators
export const actions = {
  addStartingPoint: id => ({
    type: types.ADD_START,
    id
  }),
  addEndingPoint: id => ({
    type: types.ADD_END,
    id
  }),
  pinPoints: (pt1, pt2) => ({
    type: types.PIN_POSITIONS,
    pt1,
    pt2
  }),
  requestInterpolation: (z, weight) => ({
    type: types.INTERPOLATE_REQ,
    z,
    weight
  }),
  receivedInterpolation: response => ({
    type: types.INTERPOLATE_RESP,
    response
  }),
  requestHistogram: (z, weight) => ({
    type: types.HISTOGARM_REQ,
    z,
    weight
  }),
  receivedHistogram: response => ({
    type: types.HISTOGARM_RESP,
    response
  }),
  apiError: error => ({
    type: types.API_ERR,
    error
  }),
  reset: () => ({
    type: types.RESET
  })
};

// Actions performing async tasks that ends with regular actions
const affineZArray = (z1Array, z2Array, weight) => z1Array.map((z1, i) => (weight * z2Array[i]) + ((1 - weight) * z1));
// We're returning a function for this action creator in order to perform multiple
// state change for states that are depeendent with each other, like API calls
// have 3 states: requested, received, and error thrown. If this action creator
// returns a plain JSON object, then you can't have multiple dependent state changes.
export const asyncActions = {
  requestInterpolate: weight => (dispatch, getState) => {
    let z = affineZArray(getState().interpolate.pt1.z, getState().interpolate.pt2.z, weight);
    let data = JSON.stringify({z});
    dispatch(actions.requestInterpolation(z, weight));
    return VaeImgApi.post(data)
      .then(response => {
        dispatch(actions.receivedInterpolation(response));
        dispatch(actions.requestHistogram(z, weight));
        return VaeHistogramApi.post(data);
      })
      .then(response => dispatch(actions.receivedHistogram(response)))
      .catch(error => dispatch(actions.apiError(error)));
  }
};

/**
  State Shape:
  {
     pt1: {
       imgId: 0,
       x: 0,
       y: 0,
       z: [],
     },
     pt2: {
       imgId: 0,
       x: 0,
       y: 0
       z: [],
     },
     interpolate: {
       z: [],
       weight: 0.0,
       status: statuses.OK,
       response: {},
       resultUrl: ""
     },
     histogram: {
       z: [],
       weight: 0.0,
       status: statuses.OK,
       response: {},
       val: []
     }
   }
*/
export const statuses = {
  REQ: "REQ",
  OK: "OK",
  ERR: "ERR"
};
const initialState = {
   pt1: {},
   pt2: {},
   interpolate: {},
   histogram: {}
 }

// Reducers
export default function reducer(state = initialState, action){
  let dataPoint = {};
  switch (action.type){
    case types.ADD_START:
      dataPoint = data.find(e => e.filename === `${action.id}.jpg`)
      return Object.assign(
        {},
        state,
        {
          pt1: {
            imgId: action.id,
            x: undefined,
            y: undefined,
            z: dataPoint.z
          }
        }
      );
    case types.ADD_END:
      dataPoint = data.find(e => e.filename === `${action.id}.jpg`)
      return Object.assign(
        {},
        state,
        {
          pt2: {
            imgId: action.id,
            x: undefined,
            y: undefined,
            z: dataPoint.z
          }
        }
      );
    case types.PIN_POSITIONS:
      return Object.assign(
        {},
        state,
        {
          pt1: {
            ...state.pt1,
            x: action.pt1.x,
            y: action.pt1.y,
          },
          pt2: {
            ...state.pt2,
            x: action.pt2.x,
            y: action.pt2.y,
          }
        }
      );
    case types.INTERPOLATE_REQ:
      return Object.assign(
        {},
        state,
        {
          interpolate: {
            weight: action.weight,
            z: action.z,
            status: statuses.REQ,
            response: {},
            resultUrl: ""
          }
        }
      );
    case types.INTERPOLATE_RESP:
      return Object.assign(
        {},
        state,
        {
          interpolate: {
            ...state.interpolate,
            status: statuses.OK,
            response: action.response,
            resultUrl: staticFileUrl + action.response.replace(/['"]+/g, '')
          }
        }
      );
    case types.HISTOGARM_REQ:
      return Object.assign(
        {},
        state,
        {
          histogram: {
            weight: action.weight,
            z: action.z,
            status: statuses.REQ,
            response: {},
            val: []
          }
        }
      );
    case types.HISTOGARM_RESP:
      return Object.assign(
        {},
        state,
        {
          histogram: {
            ...state.histogram,
            status: statuses.OK,
            response: action.response,
            val: JSON.parse(action.response)
          }
        }
      );
    case types.API_ERR:
      let errorContext = (state.interpolate.status === statuses.REQ)
        ? {
            ...state,
            interpolate: {
              ...state.interpolate,
              status: statuses.ERR,
              response: action.error,
              resultUrl: ""
            }
        }
        : (state.histogram.status === statuses.REQ)
          ? {
              ...state,
              histogram: {
                ...state.histogram,
                status: statuses.ERR,
                response: action.error,
                val: []
              }
          }
          : {...state};
      return Object.assign(
        {},
        state,
        errorContext
      );
    case types.RESET:
      return initialState;
    default:
      return state;
  }
}

// Selectors
export const isShowSlider = state => !isNaN(state.pt1.x) && !isNaN(state.pt1.y) && !isNaN(state.pt2.x) && !isNaN(state.pt2.y)
export const isCanSelect = (state, imgId) => (imgId !== state.pt1.imgId) && (imgId !== state.pt2.imgId)

