
const fetch = require('node-fetch');
const config = require('./../config/app')

module.exports ={
	cleanString : function(str) {
    	return str.replace(/[^\w\s]|_/g, '')
        .replace(/[0-9]/g, '')
        .replace(/\s+/g, ' ')
        .toLowerCase();
	},

	isWord : function (word){
		if(!isNaN(word))
			return false;
		else if(word.length<=1)
			return false;

		return true;
	},

	sortObject : function (obj) {
	    var arr = [];
	    var prop;
	    for (prop in obj) {
	        if (obj.hasOwnProperty(prop)) {
	            arr.push({
	                'word': prop,
	                'occurrence': obj[prop]
	            });
	        }
	    }
	    arr.sort(function(a, b) {
	        return b.value - a.value;
	    });
	    return arr; // returns array
	},

	callAPI : function(api,item) {

	   return new Promise((resolve, reject) => {
	       fetch(api)
	           .then(response => {
	               if (response.ok) {
	                   return response.json();
	               }
	               resolve(response);
	           })
	           .then((res) => {

	           	let output = {};
	           	let result = {};
				result.word = item.word;
				output.occurrence = item.occurrence;
	
	            if(typeof(res.def[0]) != 'undefined')
	            {
	            	let def=res.def[0];

	            	if(typeof(def.pos) == 'undefined'){
	            		output.pos = 'Not available';
	            	}
	            	else{
	            		// console.log(word + " : " + (def.pos));
	            		output.pos = def.pos;
	            	}

	            	if(typeof(def.tr[0].mean) != 'undefined'){
	            		output.mean = def.tr[0].mean;
	            	}
	            	else{
	            		output.mean = 'Not available';	
	            	}

	            }
	            else{

	            	output = 'Not available';	
	            }
	            	
	            	result.output = output;
	               resolve(result);
	           })
	           .catch((error) => {
	               console.log("error", error)
	               reject(error);
	           });

	   });

	},

	getWordDetails : async function(words) {
	   const requests = [];
	   for (const item of words) {
	        //console.log(item);
	        try{

				var url = new URL(config.api.url);
				params = {key:config.api.key, lang:'en-ru', text:item.word}
				Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

				const apiOutput =  this.callAPI(url.href,item);
				requests.push(apiOutput) ;	
	        }
	        catch(error){
	        	console.log('Error during API call : ' + error.message);
	        }
	   }
	   let response = await Promise.all(requests);

	   return response;
	       //
	}
}