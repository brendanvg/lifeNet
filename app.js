var express = require ('express')
var app = express()
var body = require('body/any')
var cors = require('cors')
var levelup= require('levelup')
var db = levelup('./mydb3')
var corsOption = {
	origin: 'http://localhost:5001'
}
var collect = require('collect-stream')

app.use(express.static('public'))
// app.use(express.bodyParser.json())
// app.use(express.form)
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

app.post('/nodeForm3', cors(corsOption), function(req,res,next){
		body(req,res, function(err,params){
			console.log('ooooooowwww',params.nodeName)
			db.put(params.nodeName, params.nodeGroup, function(err){
				if (err) return console.log(err)
				console.log('successfully put ',params.nodeName)
			})
		})
		res.end()
})



app.post('/nodeForm', cors(corsOption), function(req,res,next){
	body(req,res, function(err,params){
		console.log('param2',params)
		var nodeName = params.nodename
		var nodeGroup = params.nodegroup
		db.put(nodeName, nodeGroup, function (err){
			if (err) return console.log(err)
			console.log(nodeName, nodeGroup)
		})
	})
	console.log('query',req.query)

})

app.listen(5003, function(){
	console.log('listening on port 5003')
})