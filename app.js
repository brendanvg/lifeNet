var express = require ('express')
var app = express()
var body = require('body/any')
var cors = require('cors')
var levelup= require('levelup')
var db = levelup('./mydb')

var corsOption = {
	origin: 'http://localhost:5001'
}

app.use(express.static('public'))
// app.use(express.bodyParser.json())
// app.use(express.form)
app.get('/', function(req,res){
	res.sendfile('index.html')
})
app.post('/addNode', cors(corsOption), function(req,res,next){
	console.log('done!')
})

app.post('/nodeForm', cors(corsOption), function(req,res,next){
	body(req,res, function(err,params){
		var nodeName = params.nodename
		var nodeGroup = params.nodegroup
		db.put(nodeName, nodegroup, function (err){
			if (err) return console.log(err)
		})
	})
})

app.listen(5003, function(){
	console.log('listening on port 5003')
})