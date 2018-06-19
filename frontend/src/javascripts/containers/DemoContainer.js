import { connect } from 'react-redux';
import Demo from 'App/components/Demo/Demo.js'
import { actions as coreDataActions, getRandomDataSample, getFixedDataSample } from 'states/modules/coreData.js';
import { actions as interpolateActions, asyncActions as interpolateAsync } from 'states/modules/interpolate.js';

// gives our component access to state through props.<prop name>
function mapStateToProps(state) {
  return {
    state: {
      coreData: {
        data: state.coreData.data,
        randomSample: getRandomDataSample(state.coreData),
        fixedSample: getFixedDataSample(state.coreData)
      },
      interpolate: {
        contexts: state.interpolate.contexts,
        previewContext: state.interpolate.previewContext
      }
    }
  };
}

// here we're mapping actions to props
function mapDispatchToProps(dispatch) {
  return {
    action: {
      coreData: {
        loadData: (data, sampleSize) => dispatch(coreDataActions.loadData(data, sampleSize)),
        setSampleSize: sampleSize => dispatch(coreDataActions.setSampleSize(sampleSize))
      },
      interpolate: {
        pinStart: (data, position) => dispatch(interpolateActions.addStartingPoint(data, position)),
        pinEnd: (data, position) => dispatch(interpolateActions.addEndingPoint(data, position)),
        reset: () => dispatch(interpolateActions.reset()),
        async: {
          interpolate: (contextId, weight) => dispatch(interpolateAsync.requestInterpolate(contextId, weight))
        }
      }
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Demo);
