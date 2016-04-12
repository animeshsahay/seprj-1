var fs = require('fs');
var utf =require('utf8');
var mongoose = require('mongoose');
var db = mongoose.connection;

db.on('error', console.error);


db.once('open', function()
{
	var Schema = mongoose.Schema;

	var DocSchema = new Schema({
		docname : String,
		docs:{ data: Buffer , contentType: String},
		uploaded_at:Date,
		group:String
	}); 
	var Documents=mongoose.model('Doc',DocSchema);
	module.exports = Documents;

	//Function to store documents
	function storeDoc(docPath,group,date)
	{
		var a=new Documents;
		a.docname=docPath;
		a.docs.data = fs.readFileSync(docPath,"utf8");
		a.docs.contentType='';//SOME CONTENT TYPE NEEDS TO BE MENTIONED
		a.uploaded_at=date;
		a.group=group;
		
		a.save(function(err,a)
		{
			if(err) throw err;
			
			console.error('saved document to mongo');
		});
	
	}
	function getDoc(docPath)
	{
		Documents.findOne({docname:docPath},function(err,act) {
			if (err) throw err;
			console.log(utf.decode(act.docs.data));
			return act.docs.data;
		});
	

	}
	function getAllFilesFromGroup(groupName)
	{	
		Documents.find({group:groupName},function(err,act) {
			if (err) throw err;
			return act.docs.data;
		});
	
	}
	function removeImage(imgPath){

		Images.remove({"imgname":imgPath},function(err){
		if(err) throw err;
		console.log("Deleted")
	});

	}
//storeDoc("groupschema.js","CS","7");
//getDoc("groupschema.js");
});
mongoose.connect('mongodb://localhost/local');



