var cytoscape = require('cytoscape')
var hyperquest= require('hyperquest')
var catS = require('concat-stream')
var gnfModule = require('./genericNetFunctions.js')
var gnf = gnfModule()
var postJson = require('post-json')


//ALL GRAPH MANIPULATION IS DONE HERE....(cy.add())
module.exports =

function initialize(){

	var nClicked = false;
	var firstNode = {}
	var secondNode = {}

	return {
		graphAllNodes:graphAllNodes,
		loadEdges: loadEdges,
		createNewNode: createNewNode,
		savePositions:savePositions,
		addNewEdge: addNewEdge,
		test: test,
		clear: clear,
		loadGroups: loadGroups,
		graphSpecificGroup: graphSpecificGroup,
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

	function addNode (name,group) {
		cy.add({
	        group:"nodes",
	        data: {
	          weight:75,
	          id:name,
	        },
	        position: {x: 200, y : 200},
	        classes: group,
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

	// function addPositionedNode (name,x1,y1) {
	// 	console.log('at least it got to here')
	// 	console.log('x',x1)
	// 	console.log('y',y1)
	// 	cy.add({
	//         group:"nodes",
	//         data: {
	//           weight:75,
	//           id:name,
	//         },
	//         position: {x: x1, y : y1},
 //    	})
 //    	return 'done'
	// }		

  	function createNewNode(){
  		var name= document.getElementById('nodeName').value
  		var group = document.getElementById('nodeGroup').value
  		var url = 'http://localhost:5003/addNode'
  		var url2 = 'http://localhost:5003/addGroup'
 
			if (name && group){
				var body = {nodeName: name, nodeGroup: group}

		  		postJson(url, body, function (err, result) {
				})
				addNode(name,group)
				// savePositions()

				postJson(url2, body, loadGroups)


				
			}
			else alert('Name and group are both required')
	}

function test5(){
	console.log('ok now', this.id)
}

	function loadGroups (callback3){

		var listOfGroupLinks = ""
		var stream3 = hyperquest('http://localhost:5003/loadGroups')
		.pipe(
			catS(function(data){
				var x = data.toString()
				var y = JSON.parse(x)
				console.log('this is y from groups', y)

				for (i = 0; i<y.length; i++){
					console.log('yep',y[i])
					var groupLink = '<tr><button class = "groups" id="'+y[i].key+'">'+y[i].key+'</button><br>'
				
					listOfGroupLinks += groupLink
				}
				var parent= document.getElementById('groupLinkContent')
				parent.innerHTML=listOfGroupLinks
			})
		)
		stream3.on('finish', function(){
			console.log('its done')
			var groups1 = document.getElementsByClassName('groups')

			for(var i = 0; i < groups1.length; i++)
 			{
   				console.log(groups1.item(i));
   				groups1.item(i).addEventListener('click',graphSpecificGroup)
			 }
		})
	}

	

	function addNewEdge(firstNodeId, secondNodeId) {
		var url = 'http://localhost:5003/addEdge'
		var body = {firstNode: firstNodeId, secondNode:secondNodeId} 

		postJson(url,body, function(err,result){
		})
			addDirectedEdge(firstNodeId, secondNodeId)

	}


	function graphSpecificGroup(){ 
		var group= this.id
		var stream2 = hyperquest('http://localhost:5003/graphSpecificGroup/'+group)
		console.log('hi', group)
		console.log('jackpot', stream2)
		loadNodes(stream2)
	}


	function graphAllNodes(){
	  	console.log('woooo')
	    var stream1 = hyperquest('http://localhost:5003/graphAllNodes')
	    loadNodes(stream1)
	}

	function loadNodes(stream1){
		stream1.pipe(catS(function(data){
	    		var x = data.toString()
	    		var y = JSON.parse(x)
	    		console.log('thisisy', y)
	    		console.log('type', typeof y)

	    		for (i = 0; i<y.length; i++){
	    			if (typeof y === "object") {
		    			var key = y[i].key
		    			var value = y[i].value
		        		console.log('nodeee key is '+key)
		    			console.log('nodeee value is '+value)
		    			

		    			var array= value.split(',')
		  				console.log(array)

		  				var netGroup = array[0]
						var x2= Number(array[1])
		     			var y2 = Number(array[2])
		     			console.log('important',x2,y2)


		  				cy.add({
					        group:"nodes",
					        data: {
					          weight:75,
					          id:key,
					        },
					        position: {x: x2, y : y2},
					        classes:netGroup,
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




