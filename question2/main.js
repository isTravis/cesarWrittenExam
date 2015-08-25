// Create new sigma object and set margin
var s = new sigma('container');
s.settings('sideMargin', 20);

// Load neighborhoods plugin to generate lists of neighbors
var db = new sigma.plugins.neighborhoods();

// Initialize values.
var rootN = 7;
var N = rootN*rootN;
var pValue = 0;
var pThreshold = 1/N;
var pLowerBound = 0;
var pUpperBound = 2*pThreshold;
var pStep = 2*pThreshold/100;
var componentPercent = 1/N;

// Call initial render
addNodes();
s.refresh();
drawDetails();

function findLargestComponentNodes(){
	var largestComponent = [];
	var allNodes = s.graph.nodes();

	// Iterate over all nodes and calculate the size of the cluster.
	// This is definitely not optimized (as we are counting the same cluster many times)
	// but it is trivially fast for the size of our demo, so I went with the 
	// more straightforward approach.
	for(var tt = 0; tt<allNodes.length; tt++){
		var cluster = dfs(s.graph, allNodes[tt].id); // Calculate cluster. Returns array of node IDs
		if(cluster.length > largestComponent.length){ 
			largestComponent = cluster; // If this new cluser is larger than our largest, update largest
		}

		if(largestComponent.length == N){ 
			break; // If the component contains all the nodes, stop checking for other larger components
		}
	}

	componentPercent = largestComponent.length/N; //Set componentPercent

	return largestComponent; //return array nodeIDs contained in the largest component
}

function colorNodes(nodes){
	//For each node in the array passed in, set its color.
	for(var kk = 0; kk < nodes.length; kk++){
		s.graph.nodes(nodes[kk]).color = '#3498db'; 
	}
}


function addNodes(){
	// Add N nodes to the graph. Spacing them to form a square.
	for (var ii = 0; ii<N; ii++){
		s.graph.addNode({
			id: 'n'+ii,
			x: (ii%Math.sqrt(N))*50,
			y: Math.floor(ii/Math.sqrt(N))*50,
			size: 1,
			color: '#ccc'
		});
	}
}


function addEdges(p){
	// Iterate over every pair of nodes.
	// With probability p, add an edge between them.
	for (var jj = 0; jj<N; jj++){
		for (var ii = 0; ii<N; ii++){
			if(ii != jj){ //Only do this if the two referenced nodes are not the same node
				if(Math.random() < p ){
					s.graph.addEdge({
						id: 'e-'+jj+'-'+ii,
						source: 'n'+jj,
						target: 'n'+ii
					});
				}
			}			
		}
	}
}


function updateP(p) {
	// Handle when the p slider is changed. 
	// Update the pValue variable and redraw/calculate everything

	pValue = p;

	s.graph.clear();
	addNodes();
	addEdges(p);
	var largestComponent = findLargestComponentNodes();
	colorNodes(largestComponent)
	s.refresh();
	drawDetails();
}

function updateN(newN) {
	// Handle when the N slider is changed. 
	// Update the rootN variable and redraw/calculate everything

	rootN = newN;
	N = rootN*rootN;
	pValue = 0; //reset pValue when N is changed
	pThreshold = 1/N;
	pUpperBound = 2*pThreshold;
	pStep = 2*pThreshold/100;

	s.graph.clear();
	addNodes();
	s.refresh();
	drawDetails();
}

function drawDetails(){
	// Update all the DOM elements that need to be bound to local variables
	// Poor man's data-binding...
	document.getElementById('nRange').value = rootN;
	document.getElementById('nRangeValue').value = N;
	document.getElementById('nValue').innerHTML = N;
	document.getElementById('pValue').innerHTML = Math.floor(pValue*1000)/1000;
	document.getElementById('pRange').value = pValue;
	document.getElementById('pRange').max = pUpperBound;
	document.getElementById('pRange').step = pStep;
	document.getElementById('pThreshold').innerHTML = Math.floor(pThreshold*1000)/1000;
	document.getElementById('componentPercent').innerHTML = Math.floor(componentPercent*100);
}


function dfs(g, startNode){
	// Get the neighborhood object for the graph. 
	// Input node ID doesn't matter, we just need some seed
	// It will return all neighbors.
	var neighborhood = g.read(db.neighborhood('n0')) 
	
	nodesInComponent = []; //Store all node IDs found to be in the component 
	traversedNodes = []; //Store where we've been so we don't loop back on ourselves
	traversedNodes.push(g.nodes(startNode)); 
	traversedNodesObject = {}; //Store where we've been in an object for O(1) lookup time
	allNodes = g.nodes();
	
	while(traversedNodes.length !=0){
		var currentNode=traversedNodes.pop();
		traversedNodesObject[currentNode.id] = true;
		nodesInComponent.push(currentNode.id);

		if(neighborhood.allNeighborsIndex[currentNode.id]){ //If the currentNode has neighbors
			neighborList = Object.keys(neighborhood.allNeighborsIndex[currentNode.id]); //Get an array of the IDs that are neighbors
			neighborList = neighborList.map(function(id){ //Map the neighbor IDs to actual node objects
				return g.nodes(id)
			});

			for (var ii=0;ii<neighborList.length;ii++){ // For each neighbor
				currentNeighbor=neighborList[ii];
				if(traversedNodesObject[currentNeighbor.id]!=true){ //If we haven't seen it yet, add it to our lists!
					traversedNodes.push(currentNeighbor);
					traversedNodesObject[currentNeighbor.id]=true;
				}
			}
		}

	}
	return nodesInComponent;
}

