
//IMPORT//

//var array=require('collections/shim-array');//collections and express are additional things we need to install like MongoDB library.
//var dict=require('collections/fast-map');
//var set=require('collections/fast-set');
var express=require('express');
//var session = require('express-session');
var session = require('client-sessions');
var app=express();

app.use(session({
  cookieName: 'session',
  secret: 'randomkey',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
}));

//DECLARATIONS//
app.listen(8000);


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

app.get('/addUserToGroup',function(req,res)){           // explicit addition to a group
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	// attributes the client has to send
	grpId = req.query.grpId;
	usn = req.query.usn;
	addMember(grpId,usn);                  // add this user assuming the usn grpId mapping exists

}
);

app.get('/addPost',function(req,res){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	// attributes the client has to send
	grpId = req.query.grpId;
	usn = req.query.usn;
	post = req.query.post;
	time = req.query.tstmp;
	discId = addPost(time,usn,post,grpId);  
/*
call to search algo to create indexes...

*/
	res.send(JSON.stringify(discId));    // the client sets this id from the response it gets	

	}
);

app.get('/addComment',function(req,res){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	// attributes the client has to send
	
	usn = req.query.usn;
	cmt = req.query.comment;
	time = req.query.tstmp;
	discId = req.query.discId;
	addCommentToPost(discId, usn,cmt,time);

	res.send(JSON.stringify(cmtId));   // the client sets this id from the response it gets

	}
);

app.get('/addImage',function(req,res)){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	imgpath = req.query.imgpath;
	storeImage(imgpath);
	}
);


app.get('/getImage',function(req,res)){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	imgpath = req.query.imgpath;
	img = getImage(imgpath);
	res.send(JSON.stringify(img);  // To retrieve info, do img.img.<attr> wher attr may be data or contentType
								   // to get grp name or image name do img.group and img.imgname
	}
);

app.get('/removeImage',function(req,res)){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	imgpath = req.query.imgpath;
	removeImage(imgpath);
	}
);

app.get('/getAllImages',function(req,res)){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	grpName = req.query.grpName; 
	images = getAllImages(grpName);
	
	res.send(JSON.stringify(images))
//	for (var img in images){
//		 Iterate as in getImage
//	}
	}
);

app.get('/addFile',function(req,res)){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	/* write similar to images*/
	filepath = req.query.filepath;
	storeFile(filepath);

	}
);

app.get('/getFile',function(req,res)){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	filepath = req.query.filepath;
	file = getFile(filepath);
	res.send(JSON.stringify(file);  // To retrieve info, do file.file.<attr> wher attr may be data or contentType
								   // to get grp name or file name do file.group and file.filename
	}
);

app.get('/removeFile',function(req,res)){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	filepath = req.query.filepath;
	removeFile(filepath);
	}
);

app.get('/getAllFiles',function(req,res)){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	grpName = req.query.grpName; 
	files = getAllFiles(grpName);
	res.send(JSON.stringify(l))
	/*for (var file in files){
		// Iterate as in getFile
	}
	*/
	}
);

app.get('/upVote',function(req,res)){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	// attributes the client has to send
	
	usn = req.query.usn;
	discId = req.query.discId;
	
	upVotePost(usn,discId);
	
}
);

app.get('/downVote',function(req,res){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	// attributes the client has to send
		
	usn = req.query.usn;
	discId = req.query.discId;
	
	downVotePost(usn,discId);
	}
);

app.get('/update',function(req,res)){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	// attributes the client has to send
	grpId = req.query.grpId;                           
	usn = req.query.usn;
	time = req.query.tstamp;

	epoch = time.getTime()/1000.0;
	acts = [];
	list_activities = getActivitiesSince(epoch);    // list_activities is a activity object with user name and id, activity, time 
	for (var act in list_activities){
		if(act.uid == usn){                        // check name in db
			acts.push(act);                        // client extracts whatever he needs from this object 
		}
	}
	res.send(JSON.stringify(acts)); 
}
);

/*
app.post('/login',function(req,res){
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		
		//attributes the client has to send
		uName = req.query.uName;
		password = req.query.password;
		flag=authenticate(uName,password);              //authenticate the user using info from db
		if(flag==true){
			//should redirect the user to his home page
			res.statusCode = 302;
			res.setHeader("Location","/home");
			res.end;
		}
		else{
			//failed to auth
			res.send("Enter correct username and/or password");

		}
	}
);
*/


app.post('/login',function(req,res){
	sess = req.session;
	uName = req.query.uName;
	user = findUser(uName);                          // equal to uName if present or null otherwise
	if (!user) {
      res.render('login.html', { error: 'Invalid email or password.' });
    } else {
    	password = getPasswd(user);                 // from database
    	if (req.body.password === password) {
        	// sets a cookie with the user's info
        	usn = getusn(user);
        	req.session.user = {NAME:user,usn:usn};
        	res.redirect('/dashboard');
      } else {
    		res.render('login.html', { error: 'Invalid email or password.' });
      }
    }
});

app.get('/dashboard', function(req, res) {
	if (req.session && req.session.user) { // Check if session exists
    // lookup the user in the DB by pulling their email from the session
    	user = getUser(req.session.user.usn);
    	if (!user) {
    		// if the user isn't found in the DB, reset the session info and
        	// redirect the user to the login page
    		req.session.reset();
    		res.redirect('/login');
    	} else {
    		// expose the user to the template
        	res.locals.user = user;

        	// render the dashboard page
        	res.render('dashboard.html');
    	}
	} else {
    	res.redirect('/login');
	}
});


app.get('/logout',function(req,res){
	req.session.reset();
	res.redirect('/');
});

/*  remaining : moderation requests, user activity log for news feed,etc., search, identify posts,etc.  */
