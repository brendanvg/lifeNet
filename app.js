var express = require ('express')
var app = express()
var body = require('body/any')
var cors = require('cors')
var levelup= require('levelup')
var db = levelup('./mydb28')
var edgesDb = levelup('./edgesDb1')

var corsOption = {
	origin: 'http://localhost:5003'
}
var collect = require('collect-stream')

app.use(express.static('public'))
app.get('/', function(req,res){
	res.sendfile('index.html')
})


//value.split('!')  valueArray[1] = in-edge   valueArray[2]=out-edge
// db=key=nodeId, value= 'group, x, y, !in-edge,in-edge,in-edge! out-edge,out-edge!'

app.get('/loadNodes', cors(corsOption), function(req,res,next){
	var stream = db.createReadStream()
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


//need to make edgesDb key: node, value: [[inEdge, inEdge],[outEdge,outEdge]]
app.post('/addEdge', cors(corsOption), function(req,res,next){
	body(req,res,function(err,params){
		console.log('in Node out Node',params)

		edgesDb.get(params.secondNode, function(err,value){
			if (err) {
				if (err.notFound){
					var value = []
					var updatedValue = value.push(secondNode)
					console.log('values', updatedValue)
					edgesDb.put(params.secondNode, updatedValue, function(err){
						if(err) return console.log(err)
						console.log('done adding new')
					})
				}
				else {console.log(err)}
			}
			else {
				console.log(value)
				console.log('yaaa', value.outEdges)
				console.log('entries',value.entries())
				var newOutEdges= value.outEdges.push(params.secondNode)
				edgesDb.put(params.firstNode, newOutEdges, function(err){
					if(err) return console.log(err)
					console.log('donnnne updating')
				})
			}
		})


		edgesDb.get(params.firstNode, function(err,value){
			if (err) {
				if (err.notFound){
					edgesDb.put(params.firstNode, [params.secondNode], function(err){
						if(err) return console.log(err)
						console.log('done adding new')
					})
				}
				else {console.log(err)}
			}
			else {
				console.log(value)
				console.log('yaaa', value.outEdges)
				console.log('entries',value.entries())
				var newOutEdges= value.outEdges.push(params.secondNode)
				edgesDb.put(params.firstNode, newOutEdges, function(err){
					if(err) return console.log(err)
					console.log('donnnne updating')
				})
			}
		})
		// db.get(params.firstNode, function(err,value){
		// 	console.log('value of source node', value)
			
		// 	if (value.includes('!')){
		// 		console.log('value of source node before split', value)
		// 		var valArray = value.split('!')
		// 		console.log('value of source after split', valArray)
		// 		var oldOut= valArray[2]
		// 		var newOut = '!'+valArray[2] + ','+ params.secondNode
		// 		valArray[2] = newOut

		// 		var newValue = valArray.toString()


		// 		db.put(params.firstNode, newValue, function(err){
		// 			if (err) return console.log(err)
		// 			console.log('after putting new value of out-edge', newValue)
		// 		})

		// 		console.log('checking new out', newOut)

		// 	}

		// 	else {
		// 		var edgeString= '!'+''+'!'+params.secondNode+'!'
		// 		console.log('woo', value)
		// 		var newValue= value += edgeString
		// 		console.log('uhhhhh!!!', newValue)
		// 		db.put(params.firstNode, newValue, function(err){
		// 			if (err) return console.log(err)
		// 		})
		// 	}
		// })
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