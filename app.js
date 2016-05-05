var express = require ('express')
var app = express()
var body = require('body/any')
var cors = require('cors')
var levelup= require('levelup')
var db = levelup('./mydb39')
var edgesDb = levelup('./edgesDb11')
var groupsDb = levelup('./groupsDb4')

var corsOption = {
	origin: 'http://localhost:5003'
}
var collect = require('collect-stream')

app.use(express.static('public'))

// var cb0= function(req,res,next){
// 	console.log('dammmm')
// 	next()
// }

// var cb1= function (req,res,next){
	
// 	res.sendfile('index.html')
// 	// res.redirect('/loadNodes')
// 	next()
// }
// var cb2= function (req,res,next){
// 	// res.redirect('/loadEdges')
// 	next()
// }
// var cb3= function (req,res,next){
// 	res.redirect('/test1')
// 	next()
// }

// app.get('/', function(req,res){
// 	console.log('helllllllo!')
// 	res.sendfile('public/index.html')
// })

app.get('/test1', function(req,res){
	console.log('ohhhhhh!! YEA!')
})
//value.split('!')  valueArray[1] = in-edge   valueArray[2]=out-edge
// db=key=nodeId, value= 'group, x, y, !in-edge,in-edge,in-edge! out-edge,out-edge!'

app.get('/loadSpecificGroup/:key', function(req,res){
	console.log('woooooo!VUUU',req.params.key)
})

app.get('/loadGroups', cors(corsOption), function (req,res,next){
	var stream = groupsDb.createReadStream()
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


app.get('/loadNodes', cors(corsOption), function(req,res,next){
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

app.listen(5003, function(){
	console.log('listening on port 5003')
})