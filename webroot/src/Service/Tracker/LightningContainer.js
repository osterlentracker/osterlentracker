export class LightningContainer
{
	_lightnings = [];
	_begin = 0;
	_end = 0;
	_invalid = true;
	
	seek(begin, end)
	{
		if(begin > end){
			let temp = begin;
			begin = end;
			end = temp;
		}
		
		if(this._end >= this._lightnings.length){
			this._end = this._lightnings.length - 1;
		}
		
		if(this._lightnings.length === 0){
			this._inalid = true;
			this._begin = 0;
			this._end = 0;
			return;
		}
		
		while(
			(this._end - 1) in this._lightnings &&
			end < this._lightnings[this._end].time
		){
			this._end--;
		}
		while(
			(this._end + 1) in this._lightnings &&
			this._lightnings[this._end + 1].time <= end
		){
			this._end++;
		}
		
		if(this._begin > this._end){
			this._begin = this._end;
		}

		while(
			(this._begin + 1) in this._lightnings &&
			this._lightnings[this._begin].time < begin
		){
			this._begin++;
		}
		while(
			(this._begin - 1) in this._lightnings &&
			begin <= this._lightnings[this._begin - 1].time
		){
			this._begin--;
		}
		
		this._invalid = (this._begin in this._lightnings) === false ||
		(this._begin === this._end &&		
			(
				this._lightnings[this._begin].time >= begin &&
				this._lightnings[this._begin].time <= end	
			) === false
		);
	}
	
	get size()
	{
		return this._lightnings.length;
	}
	
	get length()
	{
		if(this._invalid){
			return 0;
		}
		return this._end - this._begin + 1;
	}
	
	forEach(callback = null)
	{
		if(this._invalid || typeof callback !== 'function'){
			return false;
		}
		for(let index = this._begin; index <= this._end; index++){
			callback(this._lightnings[index]);
		}
	}
	
	push(...lightnings){
		for(let lightning of lightnings){
			this._lightnings.push(lightning);
		}
	}
}