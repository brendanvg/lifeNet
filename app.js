var express = require ('express')
var app = express()
var body = require('body/any')
var cors = require('cors')
var levelup= require('levelup')
var db = levelup('./mydb8')
var corsOption = {
	origin: 'http://localhost:5001'
}
var collect = require('collect-stream')

app.use(express.static('public'))
app.get('/', function(req,res){
	res.sendfile('index.html')
})

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

		db.put(params.nodeName, params.nodeGroup, function(err){
			if (err) return console.log(err)
			console.log('successfully put ',params.nodeName)
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
			var newValue= value1+','+x+','+y

			db.put(nodeName, newValue, function(err){
				if (err) return console.log('err= ',err)
			})

			//SPLIT THE VALUE STRING INTO ARRAY and Identify []
			// var array=newValue.split(',')
			// console.log(array[0],'x= ', array[1], 'y= ', array[2])
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