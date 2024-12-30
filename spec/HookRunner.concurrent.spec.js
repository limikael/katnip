import HookRunner from "../src/hooks/HookRunner.js";
import HookEvent from "../src/hooks/HookEvent.js";

describe("hook runner concurrent",()=>{
	it("can run concurrently",async ()=>{
		let runner=new HookRunner();
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

		runner.addListener("test",f1);
		runner.addListener("test",f2);
		runner.addListener("test",f3);
		runner.addListener("test",f4);

		await runner.dispatch(new HookEvent("test"));
		expect(events).toEqual([ 'f1', 'f2s', 'f2e', 'f3s', 'f3e', 'f4' ]);

		events=[];
		await runner.dispatch(new HookEvent("test"),{concurrent: true});
		expect(events).toEqual([ 'f1', 'f2s', 'f3s', 'f2e', 'f3e', 'f4' ]);
	});
});