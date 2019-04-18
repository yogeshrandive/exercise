
const fetch = require('node-fetch');
const helper = require('./class/helper');
const config = require('./config/app');


// Variables 
let wordData = {};
let topData = {};
let totalWords = 0;
let showTop = 10;
let fileUrl = config.file.url;

console.log("Reading file data... \nLarge file may take some time.");

fetch(fileUrl)
    .then(res => res.text())
    .then(body => {
    	
    	/*
			ToDo
			- Clean the input string : remove space,special chars, numbers
			- Convert string to array
			- Check if array value is word 
				: for now we just check if value not number 
				: and length is grater than 1
			- increment the totaWords counter to find total occurrency
			- sort the final words object by occurrency and get top 10 data
			- Find words detail by given API
    	*/
    	/* Clean input data  */
    	let cleanData = helper.cleanString(body);

    	let cleanDataArray = cleanData.split(' ');

		cleanDataArray.forEach(function(item) {

			/* Check if it is a word */
			if(helper.isWord(item)){
				if(item in wordData){
					wordData[item] = wordData[item] + 1;
				}
				else{
					wordData[item] = 1;
				}

				totalWords++;
			}

		});

		console.log('\n');
		console.log('Total occurrences count of words in document : ' + totalWords)

		let sortedData = helper.sortObject(wordData).slice(0,showTop);

		console.log('\n');
		console.log('top '+ showTop + ' words(order by word Occurances) ');

		console.log('\n');
		console.log(sortedData);

		/* Call the get details function and wait for response */
		helper.getWordDetails(sortedData).then(function(result){

			let wordDetail = JSON.stringify(result);
			
			console.log('\n');
			console.log('Final Output : words list in JSON format for top 10 words ');

			console.log(wordDetail);
		});

    })
    .catch(err => console.error('Error : ' + err.message));
