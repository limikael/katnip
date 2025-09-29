import {useData,useProxy,vbind} from "katnip";
import {useState} from "react";

function TodoDetail({todo, onClose}) {
	return (
		<div class="fixed top-0 left-0 w-full h-full bg-black/50 ">
			<div class="w-[50%] m-auto mt-5 bg-white p-5">
				<div>
					Edit Todo
				</div>

				<div class="m-2">
					Title: <input type="text" {...vbind(todo,"title")} class="border p-2"/>
				</div>

				<div class="m-2">
					Content: <input type="text" {...vbind(todo,"content")} class="border p-2"/>
				</div>

				<div>
	        		<button class="m-5 p-2 border" onclick={onClose}>close</button>
	        		<button class="m-5 p-2 border"
	        				onclick={async ()=>{await todo.save(); onClose()}}>
	        			save
	        		</button>
	        		<button class="m-5 p-2 border"
	        				onclick={async ()=>{await todo.delete(); onClose()}}>
	        			delete
	        		</button>
				</div>
			</div>
		</div>
	);
}

export default function() {
	let todos=useData({manyFrom: "todos", hydrate: Object, proxy: true});
	//useData();
	//let state=useProxy({});
	let [todo,setTodo]=useState();

    return (<>
        <div class="mb-5 font-bold">Hello World</div>
    		<button class="m-5 p-2 border"
    				onclick={()=>setTodo(todos.new({title:"", content:""}))}>
    			new
    		</button>
        <div>
        </div>
        <div>Things to do:</div>
        {todos.map(todo=>
        	<div class="p-5 m-5 border" onClick={()=>setTodo(todo)}>
        		Todo: {todo.title}
        	</div>
        )}
        {todo &&
	        <TodoDetail todo={todo} onClose={()=>setTodo(null)}/>
	    }
    </>);
}
