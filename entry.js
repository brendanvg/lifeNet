var gnfModule = require('./genericNetFunctions.js')
var lnfModule = require('./lifeNetFunctions.js')
var http = require('http')
http.post = require('http-post')
var gnf = gnfModule()
var lnf = lnfModule()
var xhr= require('node-xhr')


cy.style().selector('node:selected').style('background-color', 'magenta')

//Event Listeners
var loadNode2=document.getElementById("loadNode2")
loadNode2.addEventListener("click", lnf.loadNodes)

var savePositions=document.getElementById('savePositions')
savePositions.addEventListener('click', lnf.savePositions)

var postJson1=document.getElementById("postJson1")
postJson1.addEventListener("click", lnf.createNewNode)



//nClicked=false, first click, true,second click
var nClicked = false;
var firstNode = {}
var secondNode = {}

cy.on('tap', 'node', function(evt){
  if (nClicked) {
    nClicked = false
	console.log('byee')
    var secondNode = evt.cyTarget
    var secondNodeId = secondNode.id()
    var firstNodeId= firstNode.id()

    console.log('nodes2',firstNodeId, secondNodeId)
  
	lnf.addNewEdge(firstNodeId, secondNodeId)  
    // gnf.addDirectedEdge(firstNodeId, secondNodeId)

  }

  else 
  {
    var node1= evt.cyTarget
    nClicked=true
    firstNode= evt.cyTarget
    console.log('hiii')

  }
})