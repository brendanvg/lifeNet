var cytoscape = require('cytoscape')
var hyperquest= require('hyperquest')
var catS = require('concat-stream')
var gnfModule = require('./genericNetFunctions.js')
var gnf = gnfModule()
var postJson = require('post-json')

module.exports =

function initialize(){

	var nClicked = false;
	var firstNode = {}
	var secondNode = {}

	return {
		loadNodes:loadNodes,
		loadEdges: loadEdges,
		createNewNode: createNewNode,
		savePositions:savePositions,
		addNewEdge: addNewEdge,
		test: test,
		clear: clear,
  	}

	function test () {
		var url = 'http://localhost:5003/test'
		var body = {firstNode: firstNodeId, secondNode:secondNodeId} 

		postJson(url,body, function(err,result){
		})

	}
	function clear(){
		cy.nodes().remove()
	}

	function addNode (name) {
		cy.add({
        group:"nodes",
        data: {
          weight:75,
          id:name,
        },
        position: {x: 200, y : 200},
    	})
	}		
	function addDirectedEdge(source,target) {
	     cy.add({
	      data: {
	        source: source,
	        target: target
	      }
	    })
	}

	function addPositionedNode (name,x1,y1) {
		console.log('at least it got to here')
		console.log('x',x1)
		console.log('y',y1)
		cy.add({
        group:"nodes",
        data: {
          weight:75,
          id:name,
        },
        position: {x: x1, y : y1},
    	})
    	return 'done'
	}		

  	function createNewNode(){
  		var name= document.getElementById('nodeName').value
  		var group = document.getElementById('nodeGroup').value
  		var url = 'http://localhost:5003/addNode'
 
			if (name && group){
				var body = {nodeName: name, nodeGroup: group}

		  		postJson(url, body, function (err, result) {
				})
				addNode(name)
				// savePositions()
			}
			else alert('Name and group are both required')
	}

	function addNewEdge(firstNodeId, secondNodeId) {
		var url = 'http://localhost:5003/addEdge'
		var body = {firstNode: firstNodeId, secondNode:secondNodeId} 

		postJson(url,body, function(err,result){
		})
			addDirectedEdge(firstNodeId, secondNodeId)

	}

		
	function loadNodes(){
	  	console.log('woooo')
	    hyperquest('http://localhost:5003/loadNodes')
	    .pipe(
	    	catS(function(data){
	    		var x = data.toString()
	    		var y = JSON.parse(x)
	    		console.log('thisisy', y)
	    		console.log('type', typeof y)

	    		for (i = 0; i<y.length; i++){
	    			if (typeof y === "object") {
		    			var key = y[i].key
		    			var value = y[i].value
		        		console.log('key is '+key)
		    			console.log('value is '+value)
		    			
		    			var array= value.split(',')
		  				console.log(array)

						var x2= Number(array[1])
		     			var y2 = Number(array[2])
		     			console.log('important',x2,y2)
		     			
		  				// addPositionedNode(key,x,y)
		  				// addNode(key)
		  				// addNode()
		  				// console.log('adding')

		  				cy.add({
					        group:"nodes",
					        data: {
					          weight:75,
					          id:key,
					        },
					        position: {x: x2, y : y2},
					        classes:'',
					    })
		  			}
	    		}
	    	})
	    )
	}

	function loadEdges(){
		console.log('Fuuuu')
	    hyperquest('http://localhost:5003/loadEdges')
	    .pipe(
	    	catS(function(data){
	    		var x = data.toString()
	    		var y = JSON.parse(x)
	    		console.log('thisisy', y)
	    		console.log('type', typeof y)
	    		console.log('length of y', y.length)
	    	// 	for (i=0; i<y.length; i++){
	    	// 		console.log('keyyy', y[i].key)
	    	// 		var key = y[i].key
	    	// 		var value = y[i].value
	     //    		console.log('key is '+key)
	    	// 		console.log('value is '+value)
	    	// 		var array1= value.split('!')
	    	// 		var inEdges = array1[0]
	    	// 		var outEdges= array1[1]

	    	// 		console.log('woot',array1)
	    	// 		var inEdges2= inEdges.split(',')
	    	// 		var outEdges2= outEdges.split(',')
	    	// 		console.log('donedone',inEdges2)
	    	// 		console.log('orrr', outEdges2)
	    	//  		for (j=0; j<inEdges2.length; j++){
						// if (inEdges2[j] != ''){
		    // 			console.log('inners',inEdges2[j])
		    // 			}
		    // 		}
	    	// 	}


	    		for (i = 0; i<y.length; i++){
	    			// if (typeof y === "object") {
		    			var key = y[i].key
		    			var value = y[i].value
		        		console.log('key is '+key)
		    			console.log('value is '+value)
		    			var array1= value.split('!')
		    			var inEdges = array1[0]
		    			var outEdges= array1[1]

		    			console.log('woot',array1)
		    			var inEdges2= inEdges.split(',')
		    			var outEdges2= outEdges.split(',')
		    			console.log('donedone',inEdges2)
		    			console.log('orrr', outEdges2)

		    			// var array2 = array1.split(',')
		    			for (j=0; j<inEdges2.length; j++){
		    				if (inEdges2[j] != ''){
		    					console.log('inners',inEdges2[j])
		    					cy.add({
							      data: {
							        source: inEdges2[j],
							        target: key
							      }
							    })
		    				}
		    			}
		    			// for (k=0; k<outEdges2.length; k++){
		    			// 	if (outEdges2[k] != ''){
		    			// 		console.log('outers', outEdges2[k])
		    			// 		cy.add({
		    			// 			data: {
		    			// 				source: key,
		    			// 				target: outEdges2[k]
		    			// 			}
		    			// 		})
		    			// 	}
		    			// }
		    		// }
	    		}
	    	})
	    )
	}

	function savePositions(){
		cy.nodes().forEach(function(ele){
			console.log( ele.id() )
			var id= ele.id()
			var positionObject= ele.renderedPosition()
			

			var url = 'http://localhost:5003/savePositions'
			var body= {name:id, positionObject}

			postJson(url,body,function(err,result){
				console.log('client side positions posted')
			})

		})
	}


}




