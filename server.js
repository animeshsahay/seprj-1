
//IMPORT//

//var array=require('collections/shim-array');//collections and express are additional things we need to install like MongoDB library.
//var dict=require('collections/fast-map');
//var set=require('collections/fast-set');
var express=require('express');
var app=express();


//DECLARATIONS//
app.listen(8000);
//http://127.0.0.1:8080/prod_sum?i=3,j=4
//below is simple get function...
app.get('/prod_sum',function(req,res)
				{
					res.header('Access-Control-Allow-Origin', '*');
					res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
					res.header('Access-Control-Allow-Headers', 'Content-Type');
					
					var i=+req.query.k;
					//var j=+req.query.k.j2;
					//console.log(i);console.log(j);
					//var ob={'prod':i*j,'sum':i+j};
					//console.log(prod);
					res.send(JSON.stringify(k));
				}
);

app.get('/assign_course_images',function(request,response)
{
	response.header('Access-Control-Allow-Origin', '*');
	response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	response.header('Access-Control-Allow-Headers', 'Content-Type');
	
	var assign = JSON.parse(request.query.name);
	console.log(assign);
	response.send(assign[0]);
	
}
);


//----------------------------------------------------------------------------------------
/*
To-Do...
app.get('/addUserByDefault',function(req,res)){           // the first time after signup; default
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	// attributes the client has to send
	catalogue = JSON.parseString(req.query.catalogue);     // a js object to be sent by client with user details
	uName = catalogue[name];
	groups = catalogue[groups];
	for (grp in groups){
		addUser(uName,"");              // decide whether to overload or change the name
	}	

}
);
*/
app.get('/addUserToGroup',function(req,res){           // explicit addition to a group
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	// attributes the client has to send
	grpId = req.query.grpId;
	uid = req.query.uid;
	addMember(grpId,uid);                  // add this user assuming the uid grpId mapping exists

}
);

app.get('/addPost',function(req,res){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	// attributes the client has to send
	grpId = req.query.grpId;
	uid = req.query.uid;
	post = req.query.post;
	time = req.query.tstmp;
	discId = addPost(time,uid,post,grpId);  
/*
the user should get updates...

*/
	res.send(JSON.stringify(discId));    // the client sets this id from the response it gets	

	}
);

app.get('/addComment',function(req,res){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	// attributes the client has to send
	
	uid = req.query.uid;
	cmt = req.query.comment;
	time = req.query.tstmp;
	discId = req.query.discId;
	addCommentToPost(discId, uid,cmt,time);

	res.send(JSON.stringify(cmtId));   // the client sets this id from the response it gets

	}
);

app.get('/upVote',function(req,res){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	// attributes the client has to send
	
	uid = +req.query.uid;
	discId = +req.query.discId;
	
	upVotePost(uid,discId);
	
}
);

app.get('/downVote',function(req,res){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	// attributes the client has to send
		
	uid = +req.query.uid;
	discId = +req.query.discId;
	
	downVotePost(uid,discId);
	}
);

app.get('/update',function(req,res){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
//ToDO
	// attributes the client has to send
	grpId = +req.query.grpId;                          // has to send for every group?! 
	uid = +req.query.uid;
	//To do..
	/*
		get time stamp from client..
		get all activities
		see if he should be informed!!
		(u'll hve to get groups he belongs to)
	*/
	list_activities=getActivitiesSince(time);
	if(get_Change(grpId,uid)){
		data = getData(grpId,uid);                    // get updated data
		res.send(JSON.stringify(data));
	}
	
}
);

app.post('/login',function(req,res){
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		
		//attributes the client has to send
		var data="";
		/*everything within req.on end..*/
		req.on("data",function(chunk){
			data+=chunk;
		});
		
		req.on("end",function(){
			console.log(data); 
			/*you extract the json using json.parse..*/
			var x=JSON.parse(data);
			uName = x.uName;
			password = x.password;
			console.log(uName);
			console.log(password);	
			res.send("LOGGED IN");
			/*flag=authenticate(uName,password);              //authenticate the user using info from db
		if(flag==true){
			//should redirect the user to his home page
			res.statusCode = 302;
			res.setHeader("Location","/home");
			res.end;
		}
		else{
			//failed to auth
			res.send("Enter correct username and/or password");

		}*/		
		});
		

	}
);

/*  remaining : moderation requests, user activity log for news feed,etc., search, identify posts,etc.  */
/*sessions..*/