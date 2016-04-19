var cytoscape = require('cytoscape')
var hyperquest= require('hyperquest')
var catS = require('concat-stream')
var gnfModule = require('./genericNetFunctions.js')
var gnf = gnfModule()

module.exports =

function initialize(){

	var nClicked = false;
	var firstNode = {}
	var secondNode = {}

	return {
		loadNodes:loadNodes,
  	}

		
	function loadNodes(){
	  	console.log('woooo')
	    hyperquest('http://localhost:5003/loadNodes')
	    .pipe(
	    	catS(function(data){
	    		var x = data.toString()
	    		var y = JSON.parse(x)

	    		for (i = 0; i<y.length; i++){
	    			var key = y[i].key
	    			var value = y[i].value
	        		console.log('key is '+key)
	    			console.log('value is '+value)
	    			addNode(key)

	    			function addNode (key) {
	    				cy.add({
				        group:"nodes",
				        data: {
				          weight:75,
				          id:key,
				        },
				        position: {x: 200, y : 200},
				    	})
	    			}	
	    		}
	    	})
	    )
	}
}




