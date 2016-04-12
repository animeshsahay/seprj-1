var fs = require('fs');
var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', console.error);

db.once('open', function()
{
	var Schema = mongoose.Schema;

	var ImgSchema = new Schema({
		imgname : String,	
		img:{ data: Buffer , contentType: String},
		uploaded_at:Date,
		group:String
	}); 
	var Images=mongoose.model('Images',ImgSchema);
	module.exports = Images;

	//Function to store documents
	function storeImage(imgPath)
	{
		var a=new Images;
		a.imgname=imgPath;
		a.img.data = fs.readFileSync(imgPath);
		//SOME CONTENT TYPE NEEDS TO BE MENTIONED(NOT SURE)
		a.contentType='image/jpeg';
		a.save(function(err,a)
		{
			if(err) throw err;
			console.error('saved document to mongo');
		});
	
	}

	function getImage(imgPath)
	{	
		Images.findOne({"imgname":imgPath},function(err,act) {
			if (err) throw err;
			return act;
		});
	
	}
	function removeImage(imgPath){

		Images.remove({"imgname":imgPath},function(err){
		if(err) throw err;
		console.log("Deleted")
	});

}

	
	function getAllImagesFromGroup(groupName)
	{	
		Images.find({group:groupName},function(err,act) {
			if (err) throw err;
			return act;
		});
	
	}
	storeImage("images.jpeg");
	getImage("images.jpeg");

});

mongoose.connect('mongodb://localhost/local');
