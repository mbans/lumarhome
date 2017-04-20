use lumarhome
db.createCollection("roomConfig")
db.roomConfig.remove({})
db.roomConfig.insert(
   	 [
   	 	{ "name"   : "livingroom",
   	 	   "title"  :  "LIVING ROOM",
   	 	   "devices" : [ {"displayName": "Big Light"		, "name" : "livingroom_biglight",    "type" : "yeelight"}, 
					  	{"displayName": "Little Light"	, "name" : "livingroom_littlelight", "type" : "yeelight"},
						{"displayName": "Thai Light"	, "name" : "thai_lamp",              "type" : "yeelight"},
						{"displayName": "Fairy Lights"	, "name" : "fairy_lights", 			 "type" : "switch"},
						{"displayName": "The LEDs"		, "name" : "strip_light", 					 "type" : "switch"}
					  ],
   		   "image"  : "static/img/living_room50pc.png"
		}
		,

		{ "name"   : "bedroom",
   	 	   "title"  :  "BEDROOM",
   	 	   "devices" : [ {"displayName": "Martin's Lamp", "name": "bedroom_martin", "type": "yeelight"}, 
						{"displayName": "Lucy's Light",  "name": "bedroom_lucy",   "type": "yeelight"}],
   		   "sceneLabel" : "Bedroom Scene",
   		   "sceneName"  : "bedroom_scene",
   		   "scenes" : ["Barry-White"],
   		   "image"  : "static/img/bedroom50pc.png"
		},
		
		
		{ "name"   : "office",
   	 	   "title"  :  "OFFICE",
   	 	   "devices" : [ {"displayName": "Office Light", "name" : "office", "type": "yeelight"}],
   		   "image"  : "static/img/spare_room50pc.png"
		},
		
		{ 
		   "name"   : "benedict_room",
   	 	   "title"  :  "BENEDICT's ROOM",
   	 	   "devices" : [ {"displayName": "B's wee light", "name" : "yeelight_bluetooth_lamp", "type": "switch"}],
   		   "image"  : "static/img/benedict_room.png"
		}
		,
		
		{ 
		   "name"     : "home_appliances",
   	 	   "title"    :  "HOUSEHOLD APPLIANCES",
   	 	   "devices" : [ 
   	 	   				{"img" : "static/img/dehumidifier.png", "displayName":"Dehumidifier",  "name": "dehumidifier", "type": "switch"},
   	 	   				{"img" : "static/img/oven.png",  		"displayName":"Oven", "			name": "oven", 		 "type": "switch"}
   	 	   			  ],
   		   "image"    : "static/img/appliances.png"
		}
	]
	)
	
#Device config
db.createCollection("deviceConfig")
db.deviceConfig.remove({})
db.deviceConfig.insert(
		[
			{"name" : "livingroom_biglight",    "displayName" : "Big Light", 	 "type" : "yeelight", "account": "lumarhome"},
			{"name" : "livingroom_littlelight", "displayName" : "Little Light",  "type" : "yeelight", "account": "lumarhome"},
			{"name" : "thai_lamp",              "displayName" : "Thai Lamp", 	 "type" : "yeelight", "account": "lumarhome"},
			{"name" : "bedroom_martin",         "displayName" : "Martin's Lamp", "type" : "yeelight", "account": "lumarhome"},
			{"name" : "bedroom_lucy",           "displayName" : "Lucy's Lamp"  , "type" : "yeelight", "account": "lumarhome"},
			{"name" : "office_lamp",            "displayName" : "Office Lamp",   "type" : "yeelight", "account": "lumarhome"},
			{"name" : "fairy_lights",   	    "dispalyName" : "Fairy Light",   "type" : "yeelight",	"url":"https://aps1-wap.tplinkcloud.com/?token=8b21ded7-142a33c15ef64708b16e443", "account": "lumarhome"},
			{"name" : "oven",            		"displayName" : "Oven", 	     "type" : "yeelight",	"url":"https://aps1-wap.tplinkcloud.com/?token=8b21ded7-142a33c15ef64708b16e443", "account": "lumarhome"},
			{"name" : "dehumidifier",    		"displayName" : "Dehumidifier",  "type" : "yeelight",	"url":"https://aps1-wap.tplinkcloud.com/?token=8b21ded7-142a33c15ef64708b16e443", "account": "lumarhome"},
			{"name" : "strip_light",            		"displayName" : "LEDs",          "type" : "yeelight",	"url":"https://aps1-wap.tplinkcloud.com/?token=8b21ded7-142a33c15ef64708b16e443", "account": "lumarhome"}
		]
)


#Scene Config
db.createCollection("sceneConfig")
db.sceneConfig.remove({})
db.sceneConfig.insert(
[   {"name" : "Movies", 
	 "lights" : [{"name" : "livingroom_biglight"    , "hue" : "180"},
		 		 {"name" : "livingroom_littlelight" , "hue" : "180"},
			 	 {"name" : "thai_lamp"				, "hue" : "180"}]
	},

	{"name" : "Date", 
	 "lights" : [{"name" : "livingroom_biglight",    "hue" : "300"},
		         {"name" : "livingroom_littlelight", "hue" : "300"},
	 			 {"name" : "thai_lamp", 			 "hue" : "300"}]
	},
	
	{"name" : "Ambient", 
		 "lights" : [{"name" : "livingroom_biglight",    "hue" : "30"},
			         {"name" : "livingroom_littlelight", "hue" : "30"},
		 			 {"name" : "thai_lamp", 			 "hue" : "30"}]
	},

	{"name" : "Dinner", 
		 "lights" : [{"name" : "livingroom_biglight",    "hue" : "40"},
			         {"name" : "livingroom_littlelight", "hue" : "40"},
		 			 {"name" : "thai_lamp", 			 "hue" : "40"}]
	},
		
	{"name" : "Irish", 
		 "lights" : [{"name" : "livingroom_biglight",    "hue" : "150"},
			         {"name" : "livingroom_littlelight", "hue" : "150"},
		 			 {"name" : "thai_lamp", 			 "hue" : "150"}]
	}
]
)