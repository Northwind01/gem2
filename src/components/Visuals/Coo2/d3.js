import * as d3 from 'd3';

export default (input, options) => {
  var margin = {top: 100, right: 100, bottom: 50, left: 100},
	    width = 700,
	    height = 700,
	    container = options.container,
	    startColor = options.start_color,
	    endColor = options.end_color;

  var widthLegend = 100;

  // create the svg
  var svg = d3.select(container).append("svg")
              .attr('height', height + margin.top + margin.bottom)
              .attr('width', width + margin.left + margin.right)

  var focus = svg.append('g')
                 .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var xScale = d3.scaleBand()
                 .range([0, width]);
  var yScale = d3.scaleBand()
                 .range([0, height]);
  var colorScale = d3.scaleLinear()
                     .range([startColor, endColor]);

  var character_names = [];
  
  d3.csv(input).then(data => {
    var characters = d3.nest()
                       .key(function(d) { return d.character})
                       .entries(data);

    var max_value = 0;

    // make a matrix out of the cooccurrency csv
    var matrix = [];
    characters.forEach(function(character, i) {
      // add the character names to a list
      var name = character.key;
      character_names.push(name);
      // an extra field- clean that up
      delete character.values[0]['character'];
      // this happens to give us the total number of ff's written about that character (diagonal in cooccurrency matrix)
      var sum = character.values[0][name];
      var matrix_row = [];
      for (var key in character.values[0]) {
        // get the percentage by dividing by the sum
        character.values[0][key] = character.values[0][key]/sum;
        var val = character.values[0][key];
        // store the info in the matrix
        var info = {row_name: name, col_name: key, value : val}
        matrix_row.push(info);
        // see what the max percentage is so our scales will be right
        if (val != 1 && val > max_value) {
          max_value = val;
        }
      }
      matrix.push(matrix_row);
    });

    var num_characters = characters.length;

    // Precompute the orders.
    var orders = {
      name: d3.range(num_characters).sort(function(a, b) { return d3.ascending(characters[a].name, characters[b].name); }),
      count: d3.range(num_characters).sort(function(a, b) { return characters[b].count - characters[a].count; }),
      group: d3.range(num_characters).sort(function(a, b) { return characters[b].group - characters[a].group; })
    };

    // The default sort order.
    xScale.domain(orders.name);
    yScale.domain(orders.name);
    colorScale.domain([0, max_value]);

    // add rows
    var row = focus.selectAll('.row')
                   .data(matrix)
                   .enter().append('g')
                   .attr('class', 'row')
                   .attr('transform', function(d, i) { return 'translate(0, ' + yScale(i) +')';})

    // add cells to each row
    var cell = row.selectAll('.cell')
                  .data(function(d) { return d; })
                  .enter().append('g')
                  .attr('class', 'cell')
                  .attr('transform', function(d, i) { return 'translate('+xScale(i)+',0)'})
                  .on('mouseover', handleCellMouseOver)
                  .on('mouseout', handleCellMouseOut);
    cell.append('rect')
        .attr('width', xScale.bandwidth())
        .attr('height', yScale.bandwidth())
        .style('stroke-width', 0);

    // fill in the color using the percentage
    row.selectAll('.cell')
       .data(function(d, i) {
         return matrix[i];
       })
       .attr('fill', function(d, i) {
         if (d.value==1) {
           return 'rgb(175, 175, 175)';
         } else {
           return colorScale(d.value);
         }
       });

    // manually make an axis
    var labels = focus.append('g')
                      .attr('class', 'labels');
    var columnLabels = labels.selectAll('.column-label')
                             .data(character_names)
                             .enter().append('g')
                             .attr('class','column-label')
                             .attr('transform', function(d, i) { return 'translate('+xScale(i) + ','  +'-8)'});
    // tick marks
    columnLabels.append('line')
                .style('stroke', 'black')
                .style('stroke-width', '1px')
                .attr('x1', xScale.bandwidth()/2)
                .attr('x2', xScale.bandwidth()/2)
                .attr('y1', 0)
                .attr('y2', 5);

    columnLabels.append('text')
                .attr('x', xScale.bandwidth()/2)
                .attr('y', -yScale.bandwidth()/2)
                .attr('dy', '.82em')
                .attr('text-anchor', 'start')
                .attr('transform', 'rotate(-60)')
                .text(function(d, i) { return d; });

    // row labels
    var rowLabels = labels.selectAll('.row-label')
                          .data(character_names)
                          .enter().append('g')
                          .attr('class', 'column-label')
                          .attr('transform', function(d, i) { return 'translate(0, '+ yScale(i) +')'; })
    rowLabels.append('line')
             .style('stroke', 'black')
             .style('stroke-width', '1px')
             .attr('x1', 0)
             .attr('x2', -5)
             .attr('y1', yScale.bandwidth()/2)
             .attr('y2', yScale.bandwidth()/2);
    rowLabels.append('text')
             .attr('x', -8)
             .attr('y', yScale.bandwidth()/2)
             .attr('dy', '.32em')
             .attr('text-anchor', 'end')
             .text(function(d, i) { return d;});

  // This will be relevant if csv has the corresponding data (see json example)
  //   var timeout = setTimeout(function() {
  //     order("group");
  //     d3.select("#order").property("selectedIndex", 2).node().focus();
  //   }, 5000);

  //   d3.select("#order").on("change", function() {
  //     clearTimeout(timeout);
  //     order(this.value);
  //   });

  //   /* function to order items */
  //   function order(value) {
  //     xScale.domain(orders[value]);
  //     yScale.domain(orders[value]);

  //     var t = svg.transition().duration(2500);

  //     t.selectAll(".row")
  //         .delay(function(d, i) { return xScale(i) * 4; })
  //         .attr("transform", function(d, i) { return "translate(0," + xScale(i) + ")"; })
  //       .selectAll(".cell")
  //         .delay(function(d) { return xScale(d.x) * 4; })
  //         .attr("x", function(d) { return xScale(d.x); });

  //     t.selectAll(".column")
  //         .delay(function(d, i) { return xScale(i) * 4; })
  //         .attr("transform", function(d, i) { return "translate(" + xScale(i) + ")rotate(-90)"; });
  //   }
  });

  /* function to add info about that particular cell as a text box when hovering */
  function handleCellMouseOver(d, i) {
    var row_idx = character_names.indexOf(d.row_name);
    var percentage = (d.value*100).toFixed(2);
    var group = focus.append('g')
                 .attr('id', 'id-name');

    // since we know all the text will look about the same, can hard code the word wrap
    group.append('text')
         .attr('x', xScale(i))
         .attr('y', yScale(row_idx)-20)
         .attr('text-anchor', 'middle')
         .text(function() {
           var t = 'Of '+ d.row_name + ' fan fictions, ';
           return t;
         });
    group.append('text')
         .attr('x', xScale(i))
         .attr('y', yScale(row_idx)-8)
         .attr('text-anchor','middle')
         .text(function(d2) {
           var t = percentage + "% feature " + d.col_name;
           return t;
         });

    // get the bbox so we can place a background that makes text easier to see
    var bbox = group.node().getBBox();
    var bboxPadding = 5;

    // place the background
    var rect = group.insert('rect', ':first-child')
                    .attr('x', bbox.x - bboxPadding/2)
                    .attr('y', bbox.y - bboxPadding/2)
                    .attr('width', bbox.width + bboxPadding)
                    .attr('height', bbox.height + bboxPadding)
                    .attr('rx', 10)
                    .attr('ry', 10)
                    .attr('class', 'label-background-strong');
  };

  function handleCellMouseOut(d, i) {
    d3.select('#id-name').remove();
  }
}
