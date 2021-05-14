
/*var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");*/

const width = 800;
const height = 600;
const radius = 5;

let showingLabels = false;

const svg = d3.select("#svg-container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + width + " " + height)
    .classed("svg-content", true);
var color = d3.scaleOrdinal(d3.schemeCategory20);


var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));


graph = data

for(let i = 0; i < graph.nodes.length; i++){
    let n = graph.nodes[i]

    if(n.name == undefined){
        n.name = n.id
    }
    
}
console.log(graph)

var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke-width", function (d) { return Math.sqrt(d.value); });

var node = svg.append("g")
    .classed("nodes", true)
    .selectAll("g")
    .data(graph.nodes)
    .enter()
    .append("g")
  .classed("fixed", d => d.fx !== undefined)
    .attr("class", function(d, i){return d.name.toLowerCase() + " " + "node"}, true)

var circles = node.append("circle")
    
    .attr("r", radius)
    .attr("fill", function (d) { return color(d.group); })
    .call(d3.drag()
        .on("start", dragstarted)
 //       .on("end", dragended)
        .on("drag", dragged)
        )
        .on("click", click);


var labs = node.append("text").classed("label", true)
    .text(function (d) {
        return d.id;
    })
    .attr('x', 6)
    .attr('y', 3);

updateLabels()

node.append("title")
    .text(function (d) { return d.id; });

simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

simulation.force("link")
    .links(graph.links);

function ticked() {
    link
        .attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });

        node
        .attr("transform", function(d) {
            //return "translate(" + d.x + "," + d.y + ")";
          return "translate(" + clamp(d.x, 0, width) + "," + clamp(d.y, 0, height) + ")";
        })
}

function click(d){
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;

    d3.select(this.parentNode).classed("fixed", false);

}

function dragstarted(event, d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    d3.select(this.parentNode).classed("fixed", true);

 
}

function dragged(d) {

    d.fx = clamp(d3.event.x, 0, width);
    d.fy = clamp(d3.event.y, 0, height);
}


function dragended(d) {
    
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}


function updateLabels() {
    console.log(showingLabels)
    if (showingLabels == true) {
        d3.selectAll(".label").style("visibility", "unset")
    } else {
        d3.selectAll(".label").style("visibility", "hidden")
    }
}

function showLabelsCbChanged(cb) {
    showingLabels = cb.checked;
    updateLabels()
}

function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
  }

  function text_changed(value) {
    d3.selectAll(".node>circle").attr("r", radius).attr("fill", function (d) {
      
            return color(d.group);
        
    });
    d3.selectAll(".node>circle").attr("r", function (d) {

            return radius;
        
    });


    d3.selectAll(".label").style("visibility", "hidden")


    if (value.length > 0) {
        let selected_g = d3.selectAll(".node[class*=" + value + "]")
        
        selected_g.selectAll("circle").attr("r", "10").attr("fill", function (d) {
            return "purple"
        }).style("z-index", 1000);

        selected_g.selectAll(".label").style("visibility", "unset")
    }else{
        updateLabels()
    }

    
}