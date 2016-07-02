var catS = require('concat-stream')
var postJson = require('post-json')
var hyperquest= require('hyperquest')


var postNewNet= document.getElementById('postNewNet')
postNewNet.addEventListener('click',postNewNet)

var loadNets = document.getElementById('loadNets')
loadNets.addEventListener('click',loadNets)

function postNewNet(){
  		console.log('workinnnn')
  		var url = 'http://localhost:5003/postNewNet'
  		var netName=document.getElementById('netName').value
  		postJson(url,netName, loadNets) 
  	}
  	
  	function loadNets(callback3){

		var listOfGroupLinks = ""
		var stream3 = hyperquest('http://localhost:5003/loadNets')
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
