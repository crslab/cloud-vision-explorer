import { connect } from 'react-redux';
import RenderView from 'javascripts/components/RenderView.js'
import { actions as interpolateActions, asyncActions as interpolateAsync } from 'javascripts/reducers/interpolate.js';

// gives our component access to state through props.<prop name>
function mapStateToProps(state) {
  return {
    state: {
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
)(RenderView);
