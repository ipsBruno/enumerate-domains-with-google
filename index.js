var request = require('request');
var dorkk = shuffle(require('fs').readFileSync('wordlist.txt').toString().split('\n'));
var NUMERO_THREADS = 50
var TLD = 'site:.br'
var dorksLista = chunk(dorkk, (dorkk.length > NUMERO_THREADS  ? dorkk.length / NUMERO_THREADS : 1) | 0);



setInterval(function() {
	require('fs').appendFileSync('sitesDominios.log', sitesTestarLista.join('\r\n'));
	sitesTestarLista = []
}, 5000);


for (var i in dorksLista) {
	init(dorksLista[i]);
}

var sitesTestarLista = []

function init(dorksList) {


	var currentDork = 0;

	var username = 'ipsbruno3110';
	var password = '3110Bruno';

	var cook = [];


	process.on('uncaughtException', function(err) {
		console.log(err, ' Erro ao resolver captcha')
		if (dorksList[currentDork])
			googleSearch(dorksList[currentDork], 0)
	});




	if (dorksList[currentDork])
		googleSearch(dorksList[currentDork], 0)

	function googleSearch(dork, page) {
		googleSearchs(dork, page);
	}

	function googleSearchs(dork, page) {

		var urlGoogle = 'https://www.google.com.br/search?q='+TLD+' ' + encodeURI(dork.trim()) + '&num=100&start=' + (page * 100) + ''
		var proxyStatic = getRandomProxy();

		console.log('CONSULTANDO GOOGLE:', dork.trim(), page);

		request({
				url: urlGoogle,
				followAllRedirects: true,

				headers: {
					'authority': 'www.google.com',
					'cache-control': 'max-age=0',
					'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.115',
					'sec-fetch-user': '?1',
					'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
					'sec-fetch-site': 'same-origin',
					'sec-fetch-mode': 'navigate',
					'accept-encoding': 'text',
					'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
				},
				timeout: 30000,
				proxy: proxyStatic
			}, function(error, response, body) {


				if (!error && response.statusCode == 200) {
					parseGoogleRequest(body, dork, page)
				} else {
					if (body && body.search(' software malicioso') != -1) {

						console.log("Ip Bloqueado: ", body.split('IP: ')[1].split('<br>')[0], " / Id: " + proxyStatic.split("-session-")[1].split(":")[0]);



					}
				}
				currentDork++;

				if (dorksList[currentDork]) googleSearch(dorksList[currentDork], 0);
				else console.log("ACABOU");

			}

		);
	}


	function parseGoogleRequest(body, dork, page) {
		var spliter = body.split('r"><a href="');
		if (!(!spliter.length || spliter.length == 1)) {
			parseGoogleResponse(spliter, dork);
		}
	}

	function parseGoogleResponse(spliter, dork) {
		for (var i in spliter) {
			var uri = spliter[i].slice(0, spliter[i].indexOf('"'))
			if (validURL(uri)) {
				uri = uri.split('/')[2]
				sitesTestarLista.push(uri)
				console.log(uri);
			}
		}
		console.log('Número de sites encontrados: ', spliter.length)
	}
}



function validURL(string) {
	var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
	return (res !== null)
}

function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue, randomIndex;
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}
function chunk(arr, len) {

	var chunks = [],
		i = 0,
		n = arr.length;

	while (i < n) {
		chunks.push(arr.slice(i, i += len));
	}

	return chunks;
}
function getRandomProxy() {

	var username = 'lum-customer-hl_b2129179-zone-zone1-route_err-pass_dyn';
	var password = '094xbt7fp8so';
	var port = 22225;
	var session_id = (Math.random() * 20000) | 0;
	return ('http://' + username + '-session-' + session_id + ':' + password + '@zproxy.lum-superproxy.io:' + port)
}
