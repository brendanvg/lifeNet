/*			console.log('should match this ',arrayItem.)
*/

				if (arrayItem.nodeName === params.firstNode){
/*					var edgeObj = arrayItem.edges
*/					updatedValue[]=arrayItem.edges.out.push(params.secondNode) 

/*					console.log('first out edge being added', edgeObj, 'hhhh', edgeObj.out, edgeObj.in)
*/
					
					/*if (edgeObj.out.length === 0) { 
						console.log('first out edge being added')
						arrayItem.edges = {in= , out= [params.secondNode] }
					}
					else {
						console.log('ANOTHER out edge being added')
					}*/
				}
				if (arrayItem.nodeName === params.secondNode){
/*					var edgeObj = arrayItem.edges
					edgeObj.out.push(params.firstNode) 
*/	
					console.log('first', arrayItem)
					arrayItem.edges.in.push(params.firstNode)

/*					console.log('an in edge being added', edgeObj, 'hhhh', edgeObj.out, edgeObj.in)
*/					console.log('second', arrayItem)

					

				}

				else{
					console.log('didnt match nothing')
				}
			})

			db.put(params.currentNet, updatedValue, function(err){
				console.log('addded edge')
			})
				
/*		})
*/