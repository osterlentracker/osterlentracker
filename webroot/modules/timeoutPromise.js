export default function timeoutPromise(promise, timeoutInMilliseconds){
	timeoutInMilliseconds = typeof timeoutInMilliseconds === 'undefined' ? 60 * 1000 : timeoutInMilliseconds;
	return new Promise(async (resolve, reject) => {
		var timeout = setTimeout(() => {
			timeout = null;
			reject("Timeout promise, Timed out");
		},timeoutInMilliseconds);
		try{
			var response = await promise;
			resolve(response);
		}catch(e){
			reject(e);
		}
		if(timeout !== null)
			clearTimeout(timeout);
	});
}