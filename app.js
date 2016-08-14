var express = require ('express')
var app = express()
var body = require('body/any')
var cors = require('cors')
var levelup= require('levelup')
var db = levelup('./myFlintDb55', {valueEncoding: 'json'})
var edgesDb = levelup('./edgesFlintDb')
var groupsDb = levelup('./groupsFlintDb')
var netsDb = levelup('./netsDb1')
var netListDb= levelup('./netListDb')
var h = require('hyperscript')
var hyperstream = require('hyperstream')
var fs = require('fs')
var server = app.listen(5003, function(){
	console.log('listening on port 5003')
})

var io = require('socket.io')(server)


//socket is the object that is assigned to a new client (their connection)
io.on('connection',function(socket){
	//emits what was received from socket to all on connection
	socket.on('news', function (data){
		io.emit('news', data)
	})
})

// var dataRender=require('data-render')

//BETTER DATA STRUCTURE 
//key: network, 
//value is an array of objects, each object is a node with 
//specific properties...group property searched to highlight
//and group like nodes (node can be in more than one group in a network)
// value: [{
// 		 nodeName : nodeName,
//       group: group,
// 		 position: {x, y},
//		 edges: {in: [inEdge1,inEdge2,.....], out: [outEdge]},
//		 edge: [[inEdge, inEdge],[outEdge,outEdge]
//}]
//

//downfall of this datastructure is that you have to search 
//all nodes when matching groups

//db = {key: node, value: group,x,y }
//edgesDb = key: node, value: [[inEdge, inEdge],[outEdge,outEdge]
//groupsDb= {key:group, value: names of nodes in the group}
//netsDb = {key:netName, value: see value for better data structure above}

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));


var corsOption = {
	origin: 'http://localhost:5003'
}
var collect = require('collect-stream')

app.use(express.static('public'))



// app.get('/nodeInfo/:key', function(req,res, next){
// 	var node = req.params.key
// 		db.get(node, function(err,value){
// 			if (err) console.log(err)
// 			else {

// 			}
	// res.sendfile('public/nodeInfo.html')
	
	// res.redirect('http://localhost:5003/nodeInfoFinal/'+node)


// })

app.get('/checkDb/:net',function(req,res,next){
	db.get(req.params.net, function(err,value){
		console.log('currently selected Net includes::::::::',value)
	})
})

app.get('/enterChat', function(req,res,next){
	res.sendFile('http://localhost:5003/public/chat.html')
})


app.get('/nodeInfo/:key', function(req,res, next){
		var node = req.params.key
		console.log('hiii', node)
		db.get(node, function(err,value){
			if (err) console.log(err)
			else {
				var array= value.split(',')
				var group = array[0]
				

				res.render('nodeInfoForm', {pageContent: group})


				// var html = h('div', [
				// 	h('h1', value)	
				// ])
				// fs.createReadStream('public/nodeInfo.html')
				// 	.pipe(hyperstream({
				// 	'#nodeInfoContent':html.outerHTML
				// 	}))
				// 	.pipe(res)
			}
		})
})


app.get('/test1', function(req,res){
	console.log('ohhhhhh!! YEA!')
})
//value.split('!')  valueArray[1] = in-edge   valueArray[2]=out-edge
// db=key=nodeId, value= 'group, x, y, !in-edge,in-edge,in-edge! out-edge,out-edge!'

app.get('/graphSpecificGroup/:key', function(req,res){
	var group = req.params.key
	console.log('heres my comparison', group)


	var finalDataArray= []

	db.createReadStream()
	.on('data', function(data){
		var array = data.value.split(',')
		if (array[0] === group) {
			console.log('woootyyyy',array[0], array[1], array[2])
			console.log('ohhhyea', data, typeof data)
		finalDataArray.push(data) 
		console.log('updated array', finalDataArray)
		}
	})

	.on('error', function (err) {
    	console.log('Oh my!', err)
  	})
  	.on('close', function () {
    	console.log('Stream closed')
  	})
  	.on('end', function () {
    	console.log('Stream ended')
		res.end(JSON.stringify(finalDataArray))

  	})
})

app.get('/graphSpecificNet/:key', function(req,res){
	var net= req.params.key

	var finalDataArray2= []
	db.get(net, function(err,value){
		if(err){
			if (err.notFound){
				console.log('not found')
				return
			}
			return callback(err)
		}
		else {
			console.log('yessssss', value)

			/*for (i =0; i<value.length; i++){
				var nodeName3 = value[i].nodeName
				console.log('ha',nodeName3)
				finalDataArray2.push(nodeName3)
				// console.log('oh', value[i], 'a', value[i].values(), 'b', value[i].keys(), 'c', value[i].entries())
			}
			res.end(JSON.stringify(finalDataArray2))*/
			
			res.end(JSON.stringify(value))

		}
	})

// db.createReadStream()
// 	.on('data', function(data){
// 		console.log('yyyyyy!!!', data)


// 		// var array = data.value.split(',')
// 		// if (array[0] === group) {
// 		// 	console.log('woootyyyy',array[0], array[1], array[2])
// 		// 	console.log('ohhhyea', data, typeof data)
// 		// finalDataArray.push(data) 
// 		// console.log('updated array', finalDataArray)
// 		// }
// 	})

// 	.on('error', function (err) {
//     	console.log('Oh my!', err)
//   	})
//   	.on('close', function () {
//     	console.log('Stream closed')
//   	})
//   	.on('end', function () {
//     	console.log('Stream ended')
// 		// res.end(JSON.stringify(finalDataArray))

//   	})
})


app.get('/loadGroups', cors(corsOption), function (req,res,next){
	var stream = groupsDb.createReadStream()
	collect(stream, (err,data) => {
		res.writeHead(200, {'content-type': 'application/JSON'})
      res.end(JSON.stringify(data))
    }) 
})

app.get('/loadNets3', cors(corsOption), function (req,res,next){
	var stream = netsDb.createReadStream()
	collect(stream, (err,data) => {
		res.writeHead(200, {'content-type': 'application/JSON'})
      res.end(JSON.stringify(data))
    }) 
})

app.get('/loadNets', cors(corsOption), function (req,res,next){
	
	var finalDataArray= []
	var stream = db.createKeyStream()	
	.on('data', function(data){
		console.log('aaaa',data)
		finalDataArray.push(data) 
		console.log('bbb',finalDataArray)
	})

	.on('error', function (err) {
    	console.log('Oh my!', err)
  	})
  	.on('close', function () {
    	console.log('Stream closed')
  	})
  	.on('end', function () {
    	console.log('Stream ended', finalDataArray)
		
		res.end(JSON.stringify(finalDataArray))

  	})
	// collect(stream, (err,data) => {
	// 	res.writeHead(200, {'content-type': 'application/JSON'})
 //      res.end(JSON.stringify(data))
 //    }) 
})


app.post('/addGroup', cors(corsOption), function (req,res,next){
	body(req,res,function(err,params){
		var group= params.nodeGroup
		var node = params.nodeName

		groupsDb.get(group, function(err,value){
			if (err){
				if (err.otFound){
					groupsDb.put(group, node, function(err){
						if (err) console.log(err)
					})
				}
				else console.log('uhoh',err)
			}
			else {
				value+=','+node
					groupsDb.put(group,value, function(err){
						if (err) console.log(err)
					})
			}
		})
	})
	res.end()
})

app.post('/addNet', cors(corsOption), function (req,res,next){
	body(req,res,function(err,params){
		var netName= params.netName

		netsDb.get(netName, function(err,value){
			if (err){
				if (err.notFound){
					netsDb.put(netName, node, function(err){
						if (err) console.log(err)
					})
				}
				else console.log('uhoh',err)
			}
			else {
				value+=','+node
					netsDb.put(group,value, function(err){
						if (err) console.log(err)
					})
			}
		})
	})
	res.end()
})


app.get('/graphAllNodes', cors(corsOption), function(req,res,next){
	var stream = db.createReadStream()
	collect(stream, (err,data) => {
		res.writeHead(200, {'content-type': 'application/JSON'})
      res.end(JSON.stringify(data))
    }) 
})

app.get('/loadEdges', cors(corsOption), function(req,res,next){
	var stream = edgesDb.createReadStream()
	collect(stream, (err,data) => {
		res.writeHead(200, {'content-type': 'application/JSON'})
      res.end(JSON.stringify(data))
    }) 
})

app.post('/addNode', cors(corsOption), function(req,res,next){
	body(req,res, function(err,params){
		console.log('ooooooowwww',params.nodeName)
		//var value11 = params.nodeGroup+','+200+','+200
		
		var name = params.nodeName
		var nets= params.nodeNetworks
		var groups = params.nodeGroup 
		var initPosition = params.position

		//TODO: parse nets to see if we're adding multiple nets or just one


		db.get(nets, function(err,value){
			if (err) {
				if (err.notFound){
					var arrayOfObjects = []
					var nodeObj = {} 
						nodeObj.nodeName = name;
						nodeObj.group = groups;
						nodeObj.position=initPosition;
						nodeObj.edges = {in:[],out:[]}

					arrayOfObjects.push(nodeObj);
					console.log('xxx', nodeObj, arrayOfObjects)
					// array.push([])
					// var inEdges= array[0]
					// var outEdges=array[1]
					// outEdges.push('!'+params.secondNode)

				db.put(nets, arrayOfObjects, function(err){
						if(err) return console.log(err)
						else {
							db.get(nets, function(err,value){
								console.log('the big addNode check for db', value)
							})
						}
					})
				}
				
				else {console.log(err)}

			}

			else{
				var arrayOfObjects2=value
				var nodeObj= {}
					nodeObj.nodeName=name
					nodeObj.group = groups
					nodeObj.position=initPosition
					nodeObj.edges = {in:[],out:[]}


				arrayOfObjects2.push(nodeObj)
				db.put(nets, arrayOfObjects2, function(err){
					if (err) {console.log('nooo',err)}
					else {
						db.get(nets, function(err,value){
								console.log('the big addNode check for db of saamme net', value)
						})
					}
				})

			}

			// else {
			// 	console.log('here', value)
			// 	var array2= value.split('!')
			// 	console.log('woooo', array2)
			// 	array2[0]+='!'
			// 	array2[1]+=','+params.secondNode
			// 	console.log('yeaaa', array2)
			// 	edgesDb.put(params.firstNode, array2, function(err){
			// 	 	console.log('ooooo',array2)
			// 	})
			// }	
		})



		// db.put(params.nodeName, value11, function(err){
		// 	if (err) return console.log(err)
		// 	console.log('successfully put ',params.nodeName, value11)
		// })
	})
	res.end()
})

app.post('/test', cors(corsOption), function(req,res,next){
	body(req,res,function(err,params){
		
		console.log('wooooooo!')
		edgesDb.get(params.firstNode, function(err,value){
			console.log('firstNode', value)
		})
		edgesDb.get(params.secondNode, function(err,value){
			console.log('secondNode', value)
		})
	})
})
//need to make edgesDb key: node, value: [[inEdge, inEdge],[outEdge,outEdge]]
app.post('/addEdge', cors(corsOption), function(req,res,next){
	body(req,res,function(err,params){
		console.log('in Node out Node',params)

		db.get(params.net, function(err,value){

			console.log('this is my big fat value', value, 'and', typeof value)
			value.forEach(function(arrayItem){
			
			console.log('should match this ',arrayItem.id)


				if (arrayItem.id === params.firstNode){
					var edgeObj = arrayItem.edges
					edgeObj.out.push(params.secondNode) 

					console.log('first out edge being added', edgeObj, 'hhhh', edgeObj.out, edgeObj.in)

					/*if (edgeObj.out.length === 0) { 
						console.log('first out edge being added')
						arrayItem.edges = {in= , out= [params.secondNode] }
					}
					else {
						console.log('ANOTHER out edge being added')
					}*/
				}
				if (arrayItem.id === params.secondNode){
					var edgeObj = arrayItem.edges
					edgeObj.out.push(params.firstNode) 

					console.log('another out edge being added', edgeObj, 'hhhh', edgeObj.out, edgeObj.in)

				}

				else{
					console.log('didnt match nothing')
				}
			})

			db.put(params.currentNet, value/*arrayOfObjects*/, function(err){
				console.log('addded edge')
			})
		})

		edgesDb.get(params.firstNode, function(err,value){
			if (err) {
				if (err.notFound){
					var array = []
					array.push([])
					array.push([])
					var inEdges= array[0]
					var outEdges=array[1]
					outEdges.push('!'+params.secondNode)
				edgesDb.put(params.firstNode, array, function(err){
						if(err) return console.log(err)
						console.log('done adding new first', array)
					})
				}
				else {console.log(err)}
			}
			else {
				console.log('here', value)
				var array2= value.split('!')
				console.log('woooo', array2)
				array2[0]+='!'
				array2[1]+=','+params.secondNode
				console.log('yeaaa', array2)
				edgesDb.put(params.firstNode, array2, function(err){
				 	console.log('ooooo',array2)
				})
			}	
		})


		edgesDb.get(params.secondNode, function(err,value){
			if (err) {
				if (err.notFound){
					var array = []
					array.push([])
					array.push([])
					var inEdges= array[0]
					var outEdges=array[1]
					inEdges.push('!'+params.firstNode)
				edgesDb.put(params.secondNode, array, function(err){
						if(err) return console.log(err)
						console.log('done adding new first', array)
					})
				}
				else {console.log(err)}
			}
			else {
				console.log('here', value)
				var array2= value.split('!')
				console.log('woooo', array2)
				array2[0]+= ','+ params.firstNode+'!'
				console.log('yeaaa', array2)
				edgesDb.put(params.secondNode, array2, function(err){
				 	console.log('ooooo',array2)
				})
			}	
		})

	})
	res.end()
})


app.post('/savePositions', cors(corsOption), function(req,res,next){
	body(req,res,function(err,params){
		var positionObject = params.positionObject
		var nodeName1 = params.name
	



		db.get(params.currentNet, function(err,value){
			console.log('wwwwwwwwwwwwwwwwwwwww', value, typeof value)
			var arrayOfObjects = value
			
			value.forEach(function(arrayItem){
				if (arrayItem.nodeName === nodeName1){
					console.log('fuuuuuuuuk', arrayItem.nodeName, nodeName1)
					arrayItem.position=positionObject
/*					arrayOfObjects.push(arrayItem)
*/				}
				else{
					/*arrayOfObjects.push(arrayItem)
					console.log('poooooooop', arrayOfObjects, 'then', arrayItem,'annnnd',arrayItem.nodeName, nodeName1)
*/
				console.log('dont change this nodes position its not time')
				}
			})

			db.put(params.currentNet, value/*arrayOfObjects*/, function(err){
				console.log('did it')
			})

			db.get(params.currentNet, function(err,value){
				console.log('thebiiiiiiiiiiiiiig check', value)
			})
		})	
	})
	res.end()
})

// app.post('/nodeForm', cors(corsOption), function(req,res,next){
// 	body(req,res, function(err,params){
// 		console.log('param2',params)
// 		var nodeName = params.nodename
// 		var nodeGroup = params.nodegroup
// 		db.put(nodeName, nodeGroup, function (err){
// 			if (err) return console.log(err)
// 			console.log(nodeName, nodeGroup)
// 		})
// 	})
// 	console.log('query',req.query)

// })

