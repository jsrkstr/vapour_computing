


function map(line) {
  var splits = line.split(" ");
  var temp = [];
  for(var i=0; i<splits .length; i++)
  {
    temp.push({key : splits[i], value : 1});
  }
  return temp;
}
 
 
function reduce(allSteps) {
  var result = {};
  for(var i=0; i<allSteps.length; i++)
  {
    var step = allSteps[i];
    result[step.key] = result[step.key] ? (result[step.key] + 1) : 1;
  }
  return result;
}	

var config = {
  dataSplits : 50,
  startNodes : 2
};

exports.map = map;
exports.reduce = reduce;
exports.config = config;
