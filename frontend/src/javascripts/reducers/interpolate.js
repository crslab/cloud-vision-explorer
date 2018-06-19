import { staticFileUrl, VaeImgApi, VaeHistogramApi } from 'javascripts/api/api.js';

// Action types
export const types = {
  ADD_START: "ADD_START",
  ADD_END: "ADD_END",
  INTERPOLATE_REQ: "INTERPOLATE_REQ",
  INTERPOLATE_RESP: "INTERPOLATE_RESP",
  HISTOGARM_REQ: "HISTOGRAM_REQ",
  HISTOGARM_RESP: "HISTOGRAM_RESP",
  API_ERR: "API_ERR",
  RESET: "RESET"
};

// Action creators
export const actions = {
  addStartingPoint: (data, position) => ({
    type: types.ADD_START,
    data,
    position
  }),
  addEndingPoint: (data, position) => ({
    type: types.ADD_END,
    data,
    position
  }),
  requestInterpolation: (contextId, z, weight) => ({
    type: types.INTERPOLATE_REQ,
    contextId,
    z,
    weight
  }),
  receivedInterpolation: (contextId, response) => ({
    type: types.INTERPOLATE_RESP,
    contextId,
    response
  }),
  requestHistogram: (contextId, z, weight) => ({
    type: types.HISTOGARM_REQ,
    contextId,
    z,
    weight
  }),
  receivedHistogram: (contextId, response) => ({
    type: types.HISTOGARM_RESP,
    contextId,
    response
  }),
  apiError: (contextId, error) => ({
    type: types.API_ERR,
    contextId,
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
  requestInterpolate: (contextId, weight) => (dispatch, getState) => {
    let context = getState().interpolate.contexts.find(e => e.id === contextId);
    let z = affineZArray(context.pt1.z, context.pt2.z, weight);
    let data = JSON.stringify({z});
    dispatch(actions.requestInterpolation(contextId, z, weight));
    return VaeImgApi.post(data)
      .then(response => {
        dispatch(actions.receivedInterpolation(contextId, response));
        dispatch(actions.requestHistogram(contextId, z, weight));
        return VaeHistogramApi.post(data);
      })
      .then(response => dispatch(actions.receivedHistogram(contextId, response)))
      .catch(error => dispatch(actions.apiError(contextId, error)));
  }
};


// Initial state
/**
 * Context object shape:
 *  {
 *    id: inititalId,
 *    pt1: {
 *      imgId: 0,
 *      x: 0,
 *      y: 0,
 *      z: [],
 *      z_2d: []
 *    },
 *    pt2: {
 *      imgId: 0,
 *      x: 0,
 *      y: 0
 *      z: [],
 *      z_2d: []
 *    },
 *    interpolate: {
 *      z: [],
 *      weight: 0.0,
 *      status: statuses.OK,
 *      response: {},
 *      resultUrl: ""
 *    },
 *    histogram: {
 *      z: [],
 *      weight: 0.0,
 *      status: statuses.OK,
 *      response: {},
 *      val: []
 *    }
 *  }
 */
export const statuses = {
  REQ: "REQ",
  OK: "OK",
  ERR: "ERR"
};
const initialId = Date.now();
const initialState = {
  contexts: [],
  currentContext: {
    id: initialId,
    pt1: {},
    pt2: {},
    interpolate: {},
    histogram: {}
  },
  previewContext: {
    id: initialId,
    pt1: {},
    pt2: {},
    interpolate: {},
    histogram: {}
  }
};

// Reducers
export default function reducer(state = initialState, action){
  let currentContext = {};
  switch (action.type){
    case types.ADD_START:
      currentContext = Object.assign(
        {},
        state.currentContext,
        {
          id: Date.now(),
          pt1: {
            imgId: action.data.id,
            x: action.position.x,
            y: action.position.y,
            z: action.data.z,
            z_2d: action.data.z_2d,
          }
        }
      );
      return Object.assign(
        {},
        state,
        { currentContext }
      );
    case types.ADD_END:
      currentContext = Object.assign(
        {},
        state.currentContext,
        {
          pt2: {
            imgId: action.data.id,
            x: action.position.x,
            y: action.position.y,
            z: action.data.z,
            z_2d: action.data.z_2d
          }
        }
      );
      return Object.assign(
        {},
        state,
        {
          contexts: [...state.contexts, currentContext],
          currentContext: {
            pt1: {},
            pt2: {},
            interpolate: {},
            histogram: {}
          }
        }
      );
    case types.INTERPOLATE_REQ:
      return Object.assign(
        {},
        state,
        {
          contexts: [
            ...state.contexts.filter(e => e.id !== action.contextId),
            {
              ...state.contexts.find(e => e.id === action.contextId),
              interpolate: {
                weight: action.weight,
                z: action.z,
                status: statuses.REQ,
                response: {},
                resultUrl: ""
              }
            }
          ]
        }
      );
    case types.INTERPOLATE_RESP:
      currentContext = state.contexts.find(e => e.id === action.contextId);
      return Object.assign(
        {},
        state,
        {
          contexts: [
            ...state.contexts.filter(e => e.id !== action.contextId),
            {
              ...currentContext,
              interpolate: {
                ...currentContext.interpolate,
                status: statuses.OK,
                response: action.response,
                resultUrl: staticFileUrl + action.response.replace(/['"]+/g, '')
              }
            }
          ],
          previewContext: {
            ...currentContext,
            interpolate: {
              ...currentContext.interpolate,
              status: statuses.OK,
              response: action.response,
              resultUrl: staticFileUrl + action.response.replace(/['"]+/g, '')
            }
          }
        }
      );
    case types.HISTOGARM_REQ:
      return Object.assign(
        {},
        state,
        {
          contexts: [
            ...state.contexts.filter(e => e.id !== action.contextId),
            {
              ...state.contexts.find(e => e.id === action.contextId),
              histogram: {
                weight: action.weight,
                z: action.z,
                status: statuses.REQ,
                response: {},
                val: []
              }
            }
          ]
        }
      );
    case types.HISTOGARM_RESP:
      currentContext = state.contexts.find(e => e.id === action.contextId);
      return Object.assign(
        {},
        state,
        {
          contexts: [
            ...state.contexts.filter(e => e.id !== action.contextId),
            {
              ...currentContext,
              histogram: {
                ...currentContext.histogram,
                status: statuses.OK,
                response: action.response,
                val: JSON.parse(action.response)
              }
            }
          ],
          previewContext: {
            ...currentContext,
            histogram: {
              ...currentContext.histogram,
              status: statuses.OK,
              response: action.response,
              val: JSON.parse(action.response)
            }
          }
        }
      );
    case types.API_ERR:
      currentContext = state.contexts.find(e => e.id === action.contextId);
      let errorContext = (currentContext.interpolate.status === statuses.REQ)
        ? {
            ...currentContext,
            interpolate: {
              ...currentContext.interpolate,
              status: statuses.ERR,
              response: action.error,
              resultUrl: ""
            }
        }
        : (currentContext.histogram.status === statuses.REQ)
          ? {
              ...currentContext,
              histogram: {
                ...currentContext.histogram,
                status: statuses.ERR,
                response: action.error,
                val: []
              }
          }
          : {...currentContext};
      return Object.assign(
        {},
        state,
        {
          contexts: [
            ...state.contexts.filter(e => e.id !== action.contextId),
            errorContext
          ]
        }
      );
    case types.RESET:
      return initialState;
    default:
      return state;
  }
}

// Selectors
