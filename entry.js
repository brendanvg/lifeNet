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

var uh = document.getElementById('uh')
uh.addEventListener('click', function(){console.log('fuuu')})


var postJson1=document.getElementById("postJson1")
postJson1.addEventListener("click", lnf.post)
// var addNode = document.getElementById('addNodeBtn')
// addNode.addEventListener('click',addNodeFun)
// function addNodeFun(){
//   var nodeName=document.getElementById('name').value
//   gnf.addNode(nodeName)
// }





// var addNode = document.getElementById('addNodeBtn')
// addNode.addEventListener('click',addNodeFun)

// function addNodeFun(){
//   var nodeName=document.getElementById('name').value
//  function SendData(url, data) {
//     var xhr = new XMLHttpRequest();
//     xhr.open('POST', url, true)
//     xhr.send(data)
//   }
//   SendData('/addNode', nodeName)
// }