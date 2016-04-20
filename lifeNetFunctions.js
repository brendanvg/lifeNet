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
		createNewNode: createNewNode,
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

  	function createNewNode(){
  		var name= document.getElementById('nodeName').value
  		var group = document.getElementById('nodeGroup').value
  		var url = 'http://localhost:5003/nodeForm3'
		var body = {nodeName: name, nodeGroup: group}

  		console.log('name is', name)
  		postJson(url, body, function (err, result) {
  			console.log('ooobab')
		})
		addNode(name)
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
	    		}
	    	})
	    )
	}
}




