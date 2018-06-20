import { connect } from 'react-redux';
import RenderView from 'javascripts/components/RenderView.js'
import { actions as interpolateActions, asyncActions as interpolateAsync, isShowSlider } from 'javascripts/reducers/interpolate.js';

// gives our component access to state through props.<prop name>
function mapStateToProps(state) {
  return {
    state: {
      interpolate: {
        pt1: state.interpolate.pt1,
        pt2: state.interpolate.pt2,
        result: state.interpolate.interpolate,
        histogram: state.interpolate.histogram,
        isShowSlider: isShowSlider(state.interpolate)
      }
    }
  };
}

// here we're mapping actions to props
function mapDispatchToProps(dispatch) {
  return {
    action: {
      interpolate: {
        addStart: id => dispatch(interpolateActions.addStartingPoint(id)),
        addEnd: id => dispatch(interpolateActions.addEndingPoint(id)),
        pinPositions: (pt1, pt2) => dispatch(interpolateActions.pinPoints(pt1, pt2)),
        reset: () => dispatch(interpolateActions.reset()),
        async: {
          interpolate: weight => dispatch(interpolateAsync.requestInterpolate(weight))
        }
      }
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RenderView);
