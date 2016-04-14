/*
	nameToId->name:group,person
*/


var mongoose=require('mongoose');
var db = mongoose.connection;
db.on('error', console.error);
var Schema = mongoose.Schema;
var ActivityLogPostSchema = new Schema({ 
	member :String,
	post: String,
	activity: String, 	
	date : String//grpId..
});
//given timestamp, return all things that happened since that time stamp. 
//getActivitiesSince(time)
//add list of groups in user schema..
var ActivityLog=mongoose.model('ActivityLog',ActivityLogPostSchema);
module.exports = ActivityLog;

var MemberSchema = new Schema({ 

	name: String,
	type : String,	
	groupName:String,
	date: String
});


var Member=mongoose.model('Members',MemberSchema);
module.exports = Member;

var UserSchema = new Schema({ 

	name: String,
	userId: String
	
});


var User=mongoose.model('Users',UserSchema);
module.exports = User;

var DisGroupSchema =new Schema({
	groupId: String,
	name : String,
	members : [UserSchema],
	date: String

});

var DisGroup = mongoose.model('Groups',DisGroupSchema);
module.exports=DisGroup;

var CommentSchema = new Schema({

	by: String,
	comment : String,
	likes : Number,
	date:String
});

var Comment = mongoose.model('Comments',CommentSchema);
module.exports=Comment;

var PostSchema =new Schema({
	title : String,
	by: String,
	likes : Number,
	comments : [CommentSchema],
	date:String,
	groupId: String
});

var Post= mongoose.model('Posts',PostSchema);
module.exports=Post;

function addActivity(mem,p,act,dat){
	
	var act= new ActivityLog({
		member : mem,
		post : p,
		activity : act,
		date: dat
	});
	act.save(function(err) {
		if (err) throw err;
		console.log('Sucess');
	});
}

function addPost(date,Posted_by,Message,groupId)
{
	Post.count({},function(err,Title){
		var post= new Post({
			message : String,
			title : Title,
			by: Posted_by,
			message : Message,
			likes : 0,
			comments : [{}],
			date:date,
			groupId: groupId
		});
		post.save(function(err) {
			if (err) throw err;
			console.log('Sucess');
		});
		addActivity(Posted_by,Title,"add",date);
	});
}

function addCommentToPost(PostTitle,MemberName,comments,date){

	Post.findOneAndUpdate({title:PostTitle},{$push:{comments:{
		by:MemberName,
		comment:comments,
		likes: 0,
		date:date}}},function(err) {
		if (err) throw err;
		console.log('Sucess');
	});
	addActivity(MemberName,PostTitle,"comment",date);

}

function upVotePost(member,PostTitle){
	//post_like=0;
	//Post.find({title:PostTitle},function(err,post) {
		//if (err) throw err;
		//global.post_like=parseInt(post.likes)+1;
		//console.log('Sucess1: %s',(post.likes));
	//});
	Post.findOneAndUpdate({title:PostTitle},{$inc:{likes:1}},function(err) {
		if (err) throw err;
		console.log('Sucess');
	});
	
	addActivity(member,PostTitle,"like",getDateTime());

}

function downVotePost(member,PostTitle){

	Post.findOneAndUpdate({title:PostTitle},{$inc:{likes:-1}},function(err) {
		if (err) throw err;
		console.log('Sucess: %s',post_like);
	});
	addActivity(member,PostTitle,"like",getDateTime());

}

function LikeComment(member,PostTitle,comm,inc_Like){

	Post.findOneAndUpdate({title:PostTitle},{comments:[{
		comment:comm,
		likes: inc_Like}]},function(err) {
		if (err) throw err;
		console.log('Sucess');
	});
	addActivity(member,(PostTitle+": "+comm),"Like Comment",getDateTime());

}
function addUser(name,type)
{
	var userId=name;
	var one = new User({
		name: name,
		userId: userId,
		type: type
	});
	one.save(function(err) {
		if (err) throw err;
		console.log('Sucess');
	});	
	return userId;
}
function addGroup(name)
{
	var one = new DisGroup({
		name: name,
		groupId: name,
		members:[],
		date:getDateTime()
	});
	one.save(function(err) {
		if (err) throw err;
		console.log('Sucess');
	});	
}
function addmember(groupId,userId){

	DisGroup.findOne({"groupId":groupId},
		function(err,result)
		{
			console.log("Dis"+err)
			User.findOne({"userId":userId},
				function(err,res){
					if(!err)
					{
						result.members.push(res);
						result.markModified("members")
						result.save(function(err){console.log("res"+err);});
						addActivity(userId,"Member","ADD",getDateTime());
					}
					else
						console.log("User"+err);
				}
				
				
			);
		}
	  );
	
	

}

function removeGroup(GROUPNAME){

	DisGroup.remove({"name":GROUPNAME},function(err,groups){
		if(err) throw err;
		console.log("Deleted")
	});
	addActivity(GROUPNAME,"Group","Remove",getDateTime());

}

function removeMember()	{

	Member.remove({"id":memid},function(err,groups){
		if(err) throw err;
		console.log("Deleted")
	});
	DisGroup.remove({"members":{"name":MemberName}},function(err,groups){
		if(err) throw err;
		console.log("Deleted")
	});
	addActivity(MemberName,"Member","Remove",getDateTime());

}


function getDateTime(){

	var date = new Date();
	var hour = date.getHours();
	hour = (hour<10 ? "0" : "")+ hour
	var mini = date.getMinutes();
	mini =(mini <10 ? "0" : "") +mini;
	var sec = date.getSeconds();
	sec = (sec<10 ? "0" : "")+sec;
	var year = date.getFullYear();	
	var month = date.getMonth() + 1;
	month =(month < 10 ? "0" : "")+ month;
	var day = date.getDate();
	day = (day < 10?"0" : "")+day;
	return hour+":"+mini+":"+sec+" "+day+"/"+month+"/"+year;

}
function sleep(time)
{
	var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
}
db.once('open', function() {

	
/*addUser("Krithika","student");
addUser("Ganesh","student");

addGroup("CS");
sleep(1000);*/
//addmember("CS","Krithika");
//sleep(1000);
//addmember("CS","Ganesh");
//sleep(1000);
//addPost("DS","Krithika","tree","CS");
//sleep(1000);
//UpVotePost("Ganesh","DS");
//sleep(1000);*/
//addCommentToPost('DS','Ganesh','good');
//sleep(1000);
addCommentToPost('DS','Ganesh','v.good');
//sleep(1);
/*LikeComment('Krithika','DS','good',1);
sleep(1);*/
});


mongoose.connect('mongodb://localhost/local');

