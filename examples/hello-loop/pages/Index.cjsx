<Page route="/" pageType="">
  <For let="$thing" in="$things" where="{}">
    <div class="min-h-4 min-w-4 p-5 m-5 border">
      <div class="min-h-4 min-w-4 m-3">
        <Val expr="$thing[name]"/>
      </div>
      <div class="min-h-4 min-w-4">
        <For let="$a" in="$alternatives" where="{&quot;thing_id=&quot;:&quot;$thing[id]&quot;}">
          <Val expr="$a[alt]" class="m-3 p-3 border"/>
          <div class="bg-primary text-white rounded-full p-1 inline-block">
            Thing Id:&nbsp;
            <Val expr="$thing[id]"/>
            ,
          Alt Id:&nbsp;
            <Val expr="$a[id]"/>
          </div>
        </For>
      </div>
    </div>
  </For>
</Page>
