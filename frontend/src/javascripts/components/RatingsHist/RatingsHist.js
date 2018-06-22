import React from 'react';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';
import './RatingsHist.css';

class RatingsHist extends React.Component {
      static get propTypes() {
      return {
        arr: PropTypes.array.isRequired,
      }
    }
    
    render() {
        return (
            <div className="container">
            
                <div className="itemAverage">
                    {/* Chip: multiply average by 5, and concatenate a unicode star */}
                    <Chip label={
                        this.props.arr.length ?
                        (this.props.arr.reduce((acc, val) => acc + val)/this.props.arr.length * 5).toFixed(1) + " \u2605"
                        : "- \u2605"
                    }/>
                </div>
                
                <div className="itemText">
                    <div>{
                        this.props.arr.length ?
                        (this.props.arr.reduce((acc, val) => acc + val)/this.props.arr.length * 5).toFixed(1) + " \u2605"
                        : "-"
                    } of 5 stars</div>
                    <div>{this.props.arr.length} ratings</div>
                </div>
                
                <div className="itemDivider">
                    <Divider />
                </div>
                
                <div className="itemStars"> 
                    <div> 5 Stars </div>     
                    <div> 4 Stars </div>       
                    <div> 3 Stars </div>       
                    <div> 2 Stars </div>       
                    <div> 1 Star </div>  
                </div>
                
                <div className="itemHist">
                    {/* Histogram: Set LinearProgress bar lengths to bincounts in percent */}
                    {this.binCounts(this.props.arr.sort(), true).reverse().map((val, i) => 
                        <div key={i}>
                            <LinearProgress variant="determinate" value= {val}/>
                        </div>)
                    }      
                </div>
                <div className="itemCount"> 
                    {/* Histogram: Set LinearProgress bar lengths to bincounts in percent */}
                    {this.binCounts(this.props.arr.sort(), false).reverse().map((val, i) => <div key={i}>{val}</div>)}
                </div>
                
            </div>
        );
    }
    
    binCounts(sortedArr, IsPercent){
        let thresholds = [0.2, 0.4, 0.6, 0.8, 1.0]; 
        let counts = [0,0,0,0,0];
        let currThresholdIdx = 0;
        
        for(let i = 0; i < sortedArr.length; i++){
            while(sortedArr[i] > thresholds[currThresholdIdx])
                currThresholdIdx += 1;
            counts[currThresholdIdx] += 1;
        }
        
        // Convert raw counts to percent for display
        if (IsPercent)
             return counts.map(v => v/(counts.reduce((acc, val) => acc + val)) * 100);
        else 
            return counts;
    }
    
}

// const RatingsHist = (props) => (
  // <div>
    // <h1>Average: {props.arr.reduce((acc, val) => acc + val)/props.arr.length}</h1>
    // <h1>Total: {props.arr.length}</h1>
    // <h1>Bin counts: {binCounts(props.arr.sort(), false)}</h1>
    // <Divider />
  // </div>
// );

export default RatingsHist;
