var $ = jQuert = require('jquery');
require('./jquery.csv.js')

added={}
function userAddDefault(){
	f = $.csv.toObjects('catalogue.csv');
	/*
		f is a list of dictionary with the attributes:
		Name
		USN
		groups:[]
	*/
	for(var i in f)
	{
		entry=f[i];
		addUser(entry[usn],entry[name],entry[usn],entry[usn]);
		for(var j in entry[groups])
		{
			group=entry[groups][j];
			if(group in added):
				addMember(group,entry[usn],false);
			else
			{
				added[group]=true;
				addGroup(group);
				addMember(group,entry[usn],false);
			}
		}
	}

}
