import { TestCase } from 'Cake/TestSuite/TestCase';

import { LightningContainer } from 'Web/Service/Tracker/LightningContainer';
import { Lightning } from 'Web/Service/Tracker/Lightning';

export class TrackerTest extends TestCase
{
	testLightningContainer()
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
		this.assertEquals(lightningContainer.length,4);
		
		var begin = new Date('2010-10-10 03:00');
		var end = new Date('2010-10-10 06:00');
		lightningContainer.seek(begin, end);
		this.assertEquals(lightningContainer.length,4);
		
		var begin = new Date('2010-10-10 08:00');
		var end = new Date('2010-10-10 09:00');
		lightningContainer.seek(begin, end);
		this.assertEquals(lightningContainer.length,0);
		
		var begin = new Date('2010-10-10 03:00');
		var end = new Date('2010-10-10 03:00');
		lightningContainer.seek(begin, end);
		this.assertEquals(lightningContainer.length,1);
		
		var begin = new Date('2010-10-09 03:00');
		var end = new Date('2010-10-09 03:00');
		lightningContainer.seek(begin, end);
		this.assertEquals(lightningContainer.length,0);
	}
}