/**
 * 中国天气
 * DT27 @ 2017-07-16 17:34:02
 */
function loadWeather() {
    var html = '';

    $('div.containsweatherfull').html('<div class="weatherfull"><div class="col-xs-3 transbg"></div><div class="col-xs-3 transbg"></div><div class="col-xs-3 transbg"></div><div class="col-xs-3 transbg"></div></div>');

    $.getJSON('https://www.domoticz.cn/WeatherCN/?citycode='+settings['cnweather_citycode']+'&v=0',function(weather){
        $('.containsweather').each(function(){
            var curfull = $(this);
            if(typeof(weather.currently)=='undefined'){
                curfull.remove();
                currentweather=false;
                curfull.find(".weather").html('<p style="font-size:10px; width:100px;">WeatherCN Load ERROR</p>');
            }
            else {
                currentweather = weather.currently;
                var wiclass = getIcon(currentweather.icon);
                var temp = currentweather.temperature;
                if(settings['use_fahrenheit']==1) temp = currentweather.temperaturef;
                if(settings['static_weathericons']==1){
                    html += '<h2><span>'+Math.round(temp)+_TEMP_SYMBOL+'</span> <i class="wi '+wiclass+'"></i></h2>';
                    curfull.find(".weather").html('<i class="wi '+wiclass+'"></i>');
                }
                else{
                    html += '<h2><span>'+Math.round(temp)+_TEMP_SYMBOL+'</span> '+getSkycon(currentweather.icon,'skyconsmall')+'</h2>';
					curfull.find(".weather").html(getSkycon(currentweather.icon,'skyconsmall'));
					curfull.find(".weather").attr('title',currentweather.summary);
                }
                curfull.find(".weatherdegrees").html('<strong>'+Math.round(temp)+_TEMP_SYMBOL+'</strong><span class="rainrate"></span>');

                curfull.find(".weatherloc").html(currentweather.city);
            }
        });
        $('.containsweatherfull').each(function(){
            var curfull = $(this);
            if(typeof(weather.daily)=='undefined'){
                curfull.remove();
            }
            else {
                curfull.find(".weatherfull .col-xs-3").html('');

                var day;
                for(var i=0;i<4;i++) {
                    curfor = weather.daily[i];
                    //修正兼容iOS
                    //day = new Date(curfor.time);
                    day = new Date(curfor.time.substr(0,10)+"T"+curfor.time.substr(11,8));
                    switch(day.getDay()) {
                        case 1: dayNL = language.weekdays.monday; break;
                        case 2: dayNL = language.weekdays.tuesday; break;
                        case 3: dayNL = language.weekdays.wednesday; break;
                        case 4: dayNL = language.weekdays.thursday; break;
                        case 5: dayNL = language.weekdays.friday; break;
                        case 6: dayNL = language.weekdays.saturday; break;
                        case 0: dayNL = language.weekdays.sunday; break;
                    }

                    var wiclass = getIcon(curfor.icon);
                    var lowtemp = curfor.temperatureMin
                    var hightemp = curfor.temperatureMax;

                    html = '<div class="day">'+dayNL+'<br />'+day.getDate()+'/'+(day.getMonth()+1)+'</div>';
                    if(settings['static_weathericons']==1) html += '<div class="icon"><i class="wi '+wiclass+'"></i></div>';
                    else html += getSkycon(curfor.icon,'skycon');
                    html += '<div class="temp"><span class="dayT">'+hightemp+_TEMP_SYMBOL+'</span><span class="nightT">'+lowtemp+_TEMP_SYMBOL+'</span></div>';

                    curfull.find('.weatherfull').each(function(){
						$(this).find('.col-xs-3:eq('+i+')').html(html);
						$(this).find('.col-xs-3:eq('+i+')').attr('title',curfor.summary);
                    });

                }
            }
        });
        setTimeout(function(){
            loadWeatherCN();
        }, (60000*30));
    });
}
function loadWeatherFull(){}

function getSkycon(code,classname){
	var random = getRandomInt(1,100000);
	
	var icon="PARTLY_CLOUDY_DAY";
	if(code=='chanceflurries') 	icon="WIND";
	if(code=='chancerain') 		icon="RAIN";
	if(code=='chancesleet') 	icon="SLEET";
	if(code=='chancesnow') 		icon="SNOW";
	if(code=='chancetstorms') 	icon="WIND";
	if(code=='clear') 			icon="CLEAR_DAY";
	if(code=='cloudy') 			icon="CLOUDY";
	if(code=='flurries') 		icon="WIND";
	if(code=='fog') 			icon="FOG";
	if(code=='hazy') 			icon="PARTLY_CLOUDY_DAY";
	if(code=='mostlycloudy') 	icon="CLOUDY";
	if(code=='mostlysunny') 	icon="CLEAR_DAY";
	if(code=='partlycloudy') 	icon="PARTLY_CLOUDY_DAY";
	if(code=='partlysunny') 	icon="PARTLY_CLOUDY_DAY";
	if(code=='sleet') 			icon="SLEET";
	if(code=='rain') 			icon="RAIN";
	if(code=='snow') 			icon="SNOW";
	if(code=='sunny') 			icon="CLEAR_DAY";
	if(code=='tstorms') 		icon="WIND";

	var skycon ='<script>';
	skycon+='var skycons = new Skycons({"color": "white"});';
  	skycon+='skycons.add("icon'+random+'", Skycons.'+icon+');';
	skycon+='skycons.play();';
	skycon+='</script>';
	skycon+='<canvas class="'+classname+'" data-icon="'+icon+'" id="icon'+random+'"></canvas>';
	return skycon;
}

function getIcon(code){
	var wiclass='wi-cloudy';
	
	if(code=='clear') 	wiclass="wi-day-sunny";
	if(code=='') 		wiclass="wi-day-cloudy";
	if(code=='') 		wiclass="wi-day-thunderstorm";
	if(code=='rain' || code=='chancerain') 	wiclass="wi-rain";
	if(code=='') 		wiclass="wi-rain-mix";
	if(code=='') 		wiclass="wi-showers";
	if(code=='cloudy' || code=='partlycloudy') 	wiclass="wi-cloudy";
	if(code=='') 		wiclass="wi-night-cloudy";
	if(code=='') 		wiclass="wi-night-clear";
	if(code=='') 		wiclass="wi-cloudy-gusts";
	if(code=='') 		wiclass="wi-tornado";
	if(code=='') 		wiclass="wi-storm-showers";
	if(code=='tstorms') wiclass="wi-thunderstorm";
	if(code=='snow') 	wiclass="wi-snow";
	if(code=='') 		wiclass="wi-hail";
	if(code=='') 		wiclass="wi-fog";
	return wiclass;
}

