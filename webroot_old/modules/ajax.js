import $ from 'jquery'
import timeoutPromise from 'modules/timeoutPromise'
class Ajax {
	get(url){
		return new Promise(async (resolve, reject) => {
			try{
				$.ajax({
					url: url,
					method: 'GET'
				}).done((data) => {
					resolve(data);
				}).fail((e) => {
					reject('Unable to GET '+url);
				});
			}catch(e){
				reject('Unable to GET '+url);
			}
		});
	}
	post(url, data){
		return new Promise(async (resolve, reject) => {
			try{
				$.ajax({
					url: url,
					method: 'POST',
					data: data
				}).done((data) => {
					resolve(data);
				}).fail((e) => {
					reject('Unable to POST '+url);
				});
			}catch(e){
				reject('Unable to POST '+url);
			}
		});
	}
	image(url){
		return timeoutPromise(new Promise((resolve, reject) => {
			try{
				var image = new Image();
				image.onload = () => {
					resolve(image);
				}
				image.onerror = () => {
					reject("Was not able to load image");
				}
				image.src = url;
			}catch(e){
				resolve(image);
			}
		}), 15000);
	}
}

export default new Ajax();