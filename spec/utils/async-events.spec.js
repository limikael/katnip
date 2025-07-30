import {AsyncEvent, AsyncEventTarget} from "../../src/utils/async-events.js";

describe("async events",()=>{
	it("can run events",async ()=>{
		let runner=new AsyncEventTarget();

		let called;
		runner.addEventListener("test",()=>{
			called=true;

			return 123;
		});

		let res=await runner.dispatchEvent(new AsyncEvent("test"));

		expect(called).toEqual(true);
		expect(res).toEqual(123);
	});

	it("has wildcard listeners",async ()=>{
		let runner=new AsyncEventTarget();

		let called=[];
		runner.addEventListener("test",()=>{
			called.push("test");
		});

		runner.addEventListener("*",()=>{
			called.push("*");
		});

		let res=await runner.dispatchEvent(new AsyncEvent("test"));

		expect(called).toEqual(["*","test"]);
	});

	it("respects hook priority",async ()=>{
		let runner=new AsyncEventTarget();
		let calls=[];

		function listener1() {
			calls.push("one");
		}

		listener1.priority=10;

		function listener2() {
			calls.push("two");
		}

		listener2.priority=5;

		runner.addEventListener("test",listener1);
		runner.addEventListener("test",listener2);

		let res=await runner.dispatchEvent(new AsyncEvent("test"));

		expect(calls).toEqual(["two","one"]);
	});

	it("works with listener modules",async ()=>{
		let runner=new AsyncEventTarget();
		let calls=[];

		let mod={
			ev1: (ev)=>calls.push("ev1"),
			ev2: (ev)=>calls.push("ev2"),
		}

		runner.addListenerModule(mod);
		await runner.dispatchEvent(new AsyncEvent("ev1"));
		await runner.dispatchEvent(new AsyncEvent("ev1"));
		await runner.dispatchEvent(new AsyncEvent("ev2"));

		expect(calls).toEqual(["ev1","ev1","ev2"])
	});

	it("returns",async ()=>{
		let runner=new AsyncEventTarget();
		let calls=[];

		runner.addEventListener("test",()=>123);
		runner.addEventListener("test",()=>456);

		let res=await runner.dispatchEvent(new AsyncEvent("test"));

		//console.log(res);
		expect(res).toEqual(123);
	});
});