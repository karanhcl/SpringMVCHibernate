var platform = null;

function transform(input, params) {
	//load("E:\\mlb\\mlbworkspace\\synthesizer\\src\\test\\resources\\transform\\wwe-common.js");
	load("/opt/cms/xsl/wwe/wwe-common.js");
	var inputJson = JSON.parse(input);
	var output = {};
	platform = params["platform"];
	output = processDataForAsset(inputJson,params);
	return output;
}

function processDataForAsset(input, params) {
	var result = null;
	if (input != null) {
		if (input.hasOwnProperty('list')) {
			list = input.list[0];
			if (list.hasOwnProperty('asset')) {
				var data = list.asset[0].item;
				result = processInputData(data, params);
			}
		}
	}
	var finalResult = {};
	finalResult = result;
	return JSON.stringify(finalResult, undefined, 2);
}

function processInputData(itemList, params) {
	var platform = null;
	if (typeof params != 'undefined') {
		platform = params["platform"];
	}
	var arr = [];
	var list = {
		"type" : "",
		"contentId" : "",
		"show_name" : "",
		"show_name_key" : "",
		"headline" : "",
		"bigblurb" : "",
		"tv_rating" : "",
		"air_date" : "",
		"episode_number" : "",
		"season" : "",
		"episode" : "",
		"duration" : "",
		"out_point" : "",
		"media_playback_id" : "",
		"closed_captioned" : "",		
		"genre" : "",
		"advisory_rating" : "",
		"advisory_slate"  : "",
		"calendar_event_id" : "",
		"thumbnails" : {}
	};

	if (itemList.hasOwnProperty('@id')) {
		list.contentId = itemList["@id"];
	}
	if (itemList.hasOwnProperty('itemType')) {
		list.type = itemList.itemType["@key"];
	}
	if (itemList.hasOwnProperty('field')) {
		for ( var j in itemList.field) {
			if (itemList.field[j]["@key"] == "duration") {
				list.duration = itemList.field[j].$
			} else if (itemList.field[j]["@key"] == "headline") {
				list.headline = itemList.field[j].$
				// } else if (itemList.field[j]["@key"] == "guid") {
				// list.guid = itemList.field[j].$
			} else if (itemList.field[j]["@key"] == "bigblurb") {
				list.bigblurb = itemList.field[j].$
			} else if (itemList.field[j]["@key"] == "thumbnails") {
				var thumbnails = {};
				var thumbnailList = itemList.field[j].subItemList.item;
				if (!Array.isArray(thumbnailList)) {
					var item = [];
					item.push(thumbnailList)
				} else {
					item = thumbnailList
				}
				var obj = {};
				for ( var i in item) {
					var value = {
						"type" : "",
						"width" : "",
						"height" : "",
						"src" : ""
					};
					var thumbnailType, location;

					for ( var thumbnail in item[i].field) {
						if (item[i].field[thumbnail]["@key"] == "thumbnail-type") {
							thumbnailType = thumbnail;
						} else if (item[i].field[thumbnail]["@key"] == "location") {
							location = thumbnail;
						}
					}
					var getData = {};
					value.type = item[i].field[thumbnailType].$
					value.src = item[i].field[location].$

					getData = getWidthHeight(value.type)
					value.width = getData.width;
					value.height = getData.height;
					if (value.width && value.height) {
						obj[value.width + 'x' + value.height] = value;
					}
				}
				list.thumbnails = obj;
			}
		}
	}
	if (itemList.hasOwnProperty('itemTag')) {
		var array = [];
		for ( var i in itemList.itemTag) {
			var tagObj = {};
			if (itemList.itemTag[i]["@type"] == "tv_rating") {
				list.tv_rating = itemList.itemTag[i]["@value"]
			} else if (itemList.itemTag[i]["@type"] == "show_name") {
				list.show_name = itemList.itemTag[i]["@displayName"]
				list.show_name_key = itemList.itemTag[i]["@value"]
			} else if (itemList.itemTag[i]["@type"] == "air_date") {
				list.air_date = itemList.itemTag[i]["@value"]
			} else if (itemList.itemTag[i]["@type"] == "episode_number") {
				list.episode_number = itemList.itemTag[i]["@value"]
				list.season = itemList.itemTag[i]["@value"].substring(0, 2)
				list.episode = itemList.itemTag[i]["@value"].substring(2, 4)
			} else if (itemList.itemTag[i]["@type"] == "duration") {
				list.duration = itemList.itemTag[i]["@value"]
			} else if (itemList.itemTag[i]["@type"] == "out_point") {
				list.out_point = itemList.itemTag[i]["@value"]
			} else if (itemList.itemTag[i]["@type"] == "media_playback_id") {
				list.media_playback_id = itemList.itemTag[i]["@value"]
			} else if (itemList.itemTag[i]["@type"] == "closed_captioned") {
				list.closed_captioned = itemList.itemTag[i]["@value"]
			} else if (itemList.itemTag[i]["@type"] == "advisory_rating") {
				list.advisory_rating = list.advisory_rating + itemList.itemTag[i]["@value"]
			} else if (itemList.itemTag[i]["@type"] == "advisory_slate") {
				    if(itemList.itemTag[i]["@value"] =='A'){
				    	list.advisory_rating = list.advisory_rating + itemList.itemTag[i]["@value"] 
			        }
				list.advisory_slate = itemList.itemTag[i]["@value"] ;
			} else if (itemList.itemTag[i]["@type"] == "genre") {
				list.genre = itemList.itemTag[i]["@value"]
			} else if (itemList.itemTag[i]["@type"] == "calendar_event_id") {
				list.calendar_event_id = itemList.itemTag[i]["@value"]
			}
			if (platform == 'search') {
				tagObj[itemList.itemTag[i]["@type"]] = itemList.itemTag[i]["@value"];
				array.splice(i, 0, tagObj);
				list.itemTag = array;
			}
		}
		
		list.advisory_rating=list.advisory_rating.split('').sort().join('');
		if(list.advisory_slate == ""){
			list.advisory_slate = 'A';
		}
	}
	
	if (platform == 'search') {
		if (itemList.hasOwnProperty('@createdOn')) {
			list.createdOn = itemList["@createdOn"];
		}
		if (itemList.hasOwnProperty('@lastSave')) {
			list.lastSave = itemList["@lastSave"];
		}
		if (itemList.hasOwnProperty('@userDate')) {
			list.userDate = itemList["@userDate"];
		}
	}
	return list;
}
