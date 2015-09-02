import { TestCase } from 'Cake/TestSuite/TestCase';

var LightningContainer = require(WWW_ROOT+'/src/Service/Tracker/LightningContainer').LightningContainer;
var Lightning = require(WWW_ROOT+'/src/Service/Tracker/Lightning').Lightning;

export class DevTest extends TestCase
{
	testTest()
	{
		var lightningContainer = new LightningContainer();
		lightningContainer.push(
			new Lightning({time: new Date('2010-10-10 02:00')}),
			new Lightning({time: new Date('2010-10-10 03:00')}),
			new Lightning({time: new Date('2010-10-10 04:00')}),
			new Lightning({time: new Date('2010-10-10 05:00')}),
			new Lightning({time: new Date('2010-10-10 06:00')}),
			new Lightning({time: new Date('2010-10-10 07:00')}),
		)
		
		var begin = new Date('2010-10-10 04:10');
		var end = new Date('2010-10-10 05:10');
		lightningContainer.seek(begin, end);
		this.assertEquals(lightningContainer.length,1);
		
		var begin = new Date('2010-10-10 04:00');
		var end = new Date('2010-10-10 05:00');
		lightningContainer.seek(begin, end);
		this.assertEquals(lightningContainer.length,2);
		
		var begin = new Date('2010-10-10 01:00');
		var end = new Date('2010-10-10 01:00');
		lightningContainer.seek(begin, end);
		this.assertEquals(lightningContainer.length,0);
		
		var begin = new Date('2010-10-10 05:00');
		var end = new Date('2010-10-10 05:00');
		lightningContainer.seek(begin, end);
		this.assertEquals(lightningContainer.length,1);
		
		var begin = new Date('2010-10-10 02:50');
		var end = new Date('2010-10-10 06:10');
		lightningContainer.seek(begin, end);
		this.assertEquals(lightningContainer.length,3);
		
		var begin = new Date('2010-10-10 03:00');
		var end = new Date('2010-10-10 06:00');
		lightningContainer.seek(begin, end);
		this.assertEquals(lightningContainer.length,3);
	}
}