/*
	nameToId->name:group,person : /*Let us discuss this

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
//getActivitiesSince(time) : /*just did something too simple (should modify)*/
//add list of groups in user schema.. : /*DONE*/
var ActivityLog=mongoose.model('ActivityLog',ActivityLogPostSchema);
module.exports = ActivityLog;

var GSchema = new Schema({ 

	groupname: String,
	gId: {type:String,unique:true}
	
});
var Group=mongoose.model('Groups',GSchema);
module.exports = Group;

var MemberSchema = new Schema({ 
	userId: String,	
	name: String,
	type : String,	
	groupName:[GSchema],
	date: String,
	admin: Boolean

});


var Member=mongoose.model('Members',MemberSchema);
module.exports = Member;


var UserSchema = new Schema({ 

	name: String,
	username: String,
	userId: {type:String,unique:true}
	passwd: String,
	dept: String
	
});

var User=mongoose.model('Users',UserSchema);
module.exports = User;

var DisGroupSchema =new Schema({
	groupId: String,
	name : String,
	members : [UserSchema],
	date: String

});

var DisGroup = mongoose.model('DisGroups',DisGroupSchema);
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
function getActivitiesSince(time){
	ActivityLog.findOne({date:{$lt:time}},function(err,act) {
		if (err) throw err;
		return act;
		//console.log([act.member,act.post,act.activity,act.date]);
	});
	

}
function addPost(Posted_by,Message,groupId,date)
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

function upVotePost(member,PostTitle,time){
	Post.findOneAndUpdate({title:PostTitle},{$inc:{likes:1}},function(err) {
		if (err) throw err;
		console.log('Sucess');
	});
	
	addActivity(member,PostTitle,"like",time);

}

function downVotePost(member,PostTitle,time){

	Post.findOneAndUpdate({title:PostTitle},{$inc:{likes:-1}},function(err) {
		if (err) throw err;
		console.log('Sucess: %s',post_like);
	});
	addActivity(member,PostTitle,"like",time);

}

function LikeComment(member,PostTitle,comm,inc_Like,time){

	Post.findOneAndUpdate({title:PostTitle},{comments:[{
		comment:comm,
		likes: inc_Like}]},function(err) {
		if (err) throw err;
		console.log('Sucess');
	});
	addActivity(member,(PostTitle+": "+comm),"Like Comment",time);

}
function addUser(usn,name,username,passwd,type)
{
	//var userId=name;
	var one = new User({
		name: name,
		username:username,
		passwd:passwd,
		userId: usn,
		type: type
	});
	one.save(function(err) {
		if (err) throw err;
		console.log('Sucess');
	});
	var two = new Member({

		userId: userId,
	
		name: name,
		type : type,	
		groupName:[],
		date:""
	});
	two.save(function(err) {
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
	var two = new Group({
		groupname:name,
		gId:name
	});
	one.save(function(err) {
		if (err) throw err;
		console.log('Sucess');
	});	
	two.save(function(err) {
		if (err) throw err;
		console.log('Sucess');
	});
}
function addMember(groupId,userId,ADMIN){

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
					}
					else
						console.log("User"+err);
				}
				
				
			);
		}
	  );
	Member.findOne({"userId":userId},
		function(err,result)
		{
			console.log("Dis"+err)
			Group.findOne({"gId":groupId},
				function(err,res){
					if(!err)
					{
						result.groupName.push(res);
						result.markModified("groupName");
						result.admin=ADMIN;
						result.save(function(err){console.log("res"+err);});
					}
					else
						console.log("Group"+err);
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

function isAdmin(NAME,TYPE)
{
	Member.find({$and:[{"name":NAME},{"type":TYPE}]},function(err)	{
		 if(err) return false;
		console.log("TRUE");
		return true;
	});
}

//Give admin permission to other user
function makeAdmin(PRESENT,TYPE,NEW)
{
	if(isAdmin(PRESENT,TYPE))
	{
		//make new also an admin
		Member.findOneAndUpdate({$and:[{name:NEW},{type:TYPE}]},{admin:true},function(err){
		if(err) throw err;
		console.log("%s now an admin.",NEW)
		});
	}
	else
	{
		console.log("%s is not an admin.",PRESENT)
	}
}

db.once('open', function() {

	
//addUser("Krithika","student");
//addUser("Ram","student");

//addGroup("CS");
//sleep(1000);
//addmember("CS","Krithika","9");
//sleep(1000);
//addmember("CS","Ram",true);
//sleep(1000);
//addPost("Krithika","tree","CS","7");
//getActivitiesSince("9");
//sleep(1000);

//isAdmin("Aarti","Student");
//makeAdmin("Aarti","Student","Krithika")
//UpVotePost("Ganesh","DS");
//sleep(1000);*/
//addCommentToPost('DS','Ganesh','good');
//sleep(1000);
//addCommentToPost('DS','Ganesh','v.good');
//sleep(1);
/*LikeComment('Krithika','DS','good',1);
sleep(1);*/
});


mongoose.connect('mongodb://localhost/local');

