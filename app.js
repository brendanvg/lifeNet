var express = require ('express')
var app = express()
var body = require('body/any')
var cors = require('cors')
var levelup= require('levelup')
var db = levelup('./myFlintDb')
var edgesDb = levelup('./edgesFlintDb')
var groupsDb = levelup('./groupsFlintDb')
var netsDb = levelup('./netsDb')
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
// 		 node : node,
//       group: group,
// 		 position: x, y,
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

app.get('/loadGroups', cors(corsOption), function (req,res,next){
	var stream = groupsDb.createReadStream()
	collect(stream, (err,data) => {
		res.writeHead(200, {'content-type': 'application/JSON'})
      res.end(JSON.stringify(data))
    }) 
})

app.get('/loadNets', cors(corsOption), function (req,res,next){
	var stream = netsDb.createReadStream()
	collect(stream, (err,data) => {
		res.writeHead(200, {'content-type': 'application/JSON'})
      res.end(JSON.stringify(data))
    }) 
})


app.post('/addGroup', cors(corsOption), function (req,res,next){
	body(req,res,function(err,params){
		var group= params.nodeGroup
		var node = params.nodeName

		groupsDb.get(group, function(err,value){
			if (err){
				if (err.notFound){
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

		var value11 = params.nodeGroup+','+200+','+200
		db.put(params.nodeName, value11, function(err){
			if (err) return console.log(err)
			console.log('successfully put ',params.nodeName, value11)
		})
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
		var nodeName = params.name
		var x=positionObject.x
		var y=positionObject.y
		console.log('server id ', nodeName)
		console.log('server side x= ', x)
		console.log('server side y= ', y)

		db.get(nodeName, function(err,value){
			console.log('key of db id ', value)
			var value1=value
			var valArray= value1.split(',')
			console.log('valllll array', valArray)
			valArray[1]=x
			valArray[2]=y
			var newString = valArray.toString()
			console.log('updated x and y', valArray[1], valArray[2])

			// var newValue= value1+','+x+','+y
			
			// db.put(nodeName, valArray, function(err){
			db.put(nodeName, newString, function(err){
				if (err) return console.log('err= ',err)
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

