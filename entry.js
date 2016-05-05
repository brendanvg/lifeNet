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
var loadNode2=document.getElementById("loadNode2")
loadNode2.addEventListener("click", lnf.loadNodes)

var loadGroups=document.getElementById("loadGroups")
loadGroups.addEventListener("click", lnf.loadGroups)

var loadEdges2=document.getElementById("loadEdges2")
loadEdges2.addEventListener("click", lnf.loadEdges)

var savePositions=document.getElementById('savePositions')
savePositions.addEventListener('click', lnf.savePositions)

var postJson1=document.getElementById("postJson1")
postJson1.addEventListener("click", lnf.createNewNode)

var test = document.getElementById('test')
test.addEventListener('click',lnf.test)

var clear = document.getElementById('clear')
clear.addEventListener('click', lnf.clear)

var groups1 = document.getElementsByClassName('groups')
console.log('yaaasss',groups1)
// groups1.addEventListener('click',lnf.graphSpecificGroup)

Array.prototype.forEach.call(groups, function(el) {
    // Do stuff here
    console.log(el.tagName);
    console.log('wweeee', el)
});


// function reply_id(clicked_id){
//     alert(clicked_id)
//   }

// groups.forEach.call(groups, function(el){
//   var id = el.id()
//   console.log('yep', id)
// })
// groups.addEventListener('click', lnf.graphSpecificGroup)

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

