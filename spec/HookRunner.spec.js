import HookRunner from "../src/hooks/HookRunner.js";
import HookEvent from "../src/hooks/HookEvent.js";

describe("hook runner",()=>{
	it("can run hooks",async ()=>{
		let runner=new HookRunner();

		let called;
		runner.addListener("test",()=>{
			called=true;

			return 123;
		});

		let res=await runner.dispatch(new HookEvent("test"));

		expect(called).toEqual(true);
		expect(res).toEqual(123);
	});

	it("respects hook priority",async ()=>{
		let runner=new HookRunner();
		let calls=[];

		function listener1() {
			calls.push("one");
		}

		listener1.priority=10;

		function listener2() {
			calls.push("two");
		}

		listener2.priority=5;

		runner.addListener("test",listener1);
		runner.addListener("test",listener2);

		let res=await runner.dispatch(new HookEvent("test"));

		expect(calls).toEqual(["two","one"]);
	});

	it("works with listener modules",async ()=>{
		let runner=new HookRunner();
		let calls=[];

		let mod={
			ev1: (ev)=>calls.push("ev1"),
			ev2: (ev)=>calls.push("ev2"),
		}

		runner.addListenerModule(mod);
		await runner.dispatch(new HookEvent("ev1"));
		await runner.dispatch(new HookEvent("ev1"));
		await runner.dispatch(new HookEvent("ev2"));

		expect(calls).toEqual(["ev1","ev1","ev2"])
	});

	it("returns",async ()=>{
		let runner=new HookRunner();
		let calls=[];

		runner.addListener("test",()=>123);
		runner.addListener("test",()=>456);

		let res=await runner.dispatch(new HookEvent("test"));

		//console.log(res);
		expect(res).toEqual(123);
	});
});