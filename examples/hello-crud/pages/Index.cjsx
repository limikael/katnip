<Page route="/">
  <div class="w-full min-h-full bg-duskblue text-center px-5">
    <div class="max-w-md shadow-lg min-h-screen bg-cobalt mx-auto text-lightblue p-5">
      <p class="text-xl font-bold mb-5">To Do List</p>
      <For in="pages" insert="true">
        <div class="mb-5 flex border-b pb-5">
          <ValInput class="p-2 bg-lightblue text-black rounded-full grow" var="$title"/>
          <Button class="bg-niceblue text-white ms-5 p-2 rounded-full text-sm" action="save">Add</Button>
        </div>
      </For>

      <For in="pages">
        <div class="mb-5 flex">
          <ValInput var="$title" class="p-2 bg-lightblue text-black rounded-full grow"/>
          <Button class="bg-niceblue text-white ms-5 p-2 rounded-full text-sm" action="save">Save</Button>
          <Button class="bg-niceblue text-white ms-5 p-2 rounded-full text-sm" action="delete">Delete</Button>
        </div>
      </For>
    </div>
  </div>
</Page>