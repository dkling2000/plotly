function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
    let url = `/metadata/${sample}`
    d3.json(url).then(function(data){
    console.log(data);

    // Use d3 to select the panel with id of `#sample-metadata`
    let mData = d3.select('#sample-metadata');
    // Use `.html("") to clear any existing metada
    mData.html('');

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key,value])=> {
    let cell = mData.append('tr');
    cell.text(key + " " + value);
})
  });
  };
function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
    let url = `/samples/${sample}`
    d3.json(url).then(function(data1){
        console.log(data1);
      
    // @TODO: Build a Bubble Chart using the sample data
        let trace = {
          x: data1.otu_ids,
          y: data1.sample_values,
          text: data1.otu_labels,
          mode: 'markers',
          marker: {
              color: data1.otu_ids,
              size: data1.sample_values/5
        }
      }; 
      let  bTrace = [trace];
      let layout = {
          Title: 'Belly-Button Bubble Chart',
          xaxis: {
            type: 'OTU IDS'
          },
          yaxis: {
            type: 'Sample Values' 
          }
      };
      Plotly.newPlot('bubble', bTrace, layout);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    let dataSet = [];
    let iter = data1.sample_values.length;
     for (i = 0; i < iter; i++) {
      let dataElement = {};
        Object.entries(data1).forEach(([key,value]) => {
            dataElement[key] = value [i];
        });
        dataSet.push(dataElement);     
    }
    dataSet.sort(function(a,b) {
        return parseFloat(b.sample_values) - parseFloat(a.sample_values)
    })
    dataSet = dataSet.slice(0,10);
    
    let trace1 = [{
        type: 'pie',
        values: dataSet.map(cell => cell.sample_values),
        labels: dataSet.map(cell => cell.otu_ids)
    }];
    let layout1 = {
        title: 'Top 10'
    };
    Plotly.newPlot('pie', trace1, layout1);

    });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
