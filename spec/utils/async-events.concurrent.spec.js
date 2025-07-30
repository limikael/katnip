import {AsyncEvent, AsyncEventTarget} from "../../src/utils/async-events.js";

describe("hook runner concurrent",()=>{
	it("can run concurrently",async ()=>{
		let runner=new AsyncEventTarget();
		let events=[];

		let delay=async millis=>new Promise(r=>setTimeout(r,millis));

		let f1=async ()=>{events.push("f1")};
		f1.priority=5;

		let f2=async ()=>{events.push("f2s"); await delay(100); events.push("f2e");};
		f2.priority=10;

		let f3=async ()=>{events.push("f3s"); await delay(100); events.push("f3e");};
		f3.priority=10;

		let f4=async ()=>{events.push("f4")};
		f4.priority=20;

		runner.addEventListener("test",f1);
		runner.addEventListener("test",f2);
		runner.addEventListener("test",f3);
		runner.addEventListener("test",f4);

		await runner.dispatchEvent(new AsyncEvent("test"));
		expect(events).toEqual([ 'f1', 'f2s', 'f2e', 'f3s', 'f3e', 'f4' ]);

		events=[];
		await runner.dispatchEvent(new AsyncEvent("test"),{concurrent: true});
		expect(events).toEqual([ 'f1', 'f2s', 'f3s', 'f2e', 'f3e', 'f4' ]);
	});
});