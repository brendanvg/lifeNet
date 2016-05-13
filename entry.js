var gnfModule = require('./genericNetFunctions.js')
var lnfModule = require('./lifeNetFunctions.js')
var http = require('http')
http.post = require('http-post')
var gnf = gnfModule()
var lnf = lnfModule()
var xhr= require('node-xhr')

//ALL GRAPH SELECTION IS DONE HERE 

// window.onload=function(){
//   lnf.loadNodes
//   lnf.loadEdges
// }

cy.style().selector('node:selected').style('background-color', 'magenta')

//Event Listeners
var graphAllNodes2=document.getElementById("graphAllNodes2")
graphAllNodes2.addEventListener("click", lnf.graphAllNodes)

var loadGroups=document.getElementById("loadGroups")
loadGroups.addEventListener("click", lnf.loadGroups)

var loadEdges2=document.getElementById("loadEdges2")
loadEdges2.addEventListener("click", lnf.loadEdges)

var savePositions=document.getElementById('savePositions')
savePositions.addEventListener('click', lnf.savePositions)

var postJson1=document.getElementById("postJson1")
postJson1.addEventListener("click", lnf.createNewNode)



var clear = document.getElementById('clear')
clear.addEventListener('click', lnf.clear)

$('.groups').click(function(){
  console.log('he')
})


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

    if (secondNodeId = firstNodeId){
      console.log('clicked myself')
      window.open('http://localhost:5003/nodeInfo/'+evt.cyTarget.id(), 'Node Info', 'height= 100, width=100, return false') 
    }

    else {
      console.log('nodes2',firstNodeId, secondNodeId)
  
	   lnf.addNewEdge(firstNodeId, secondNodeId)  
    // gnf.addDirectedEdge(firstNodeId, secondNodeId)
    }
  }

  else 
  {
    var node1= evt.cyTarget
    nClicked=true
    firstNode= evt.cyTarget
    console.log('hiii')

  }
})

