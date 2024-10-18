<Page route="/" declarations='{"selectedPageId":""}'>
  Currently selected id: <Val expr="$selectedPageId"/>
  <div>
    Select by drop down:
    <Select value="$selectedPageId" class="p-3 border ms-4">
      <For in="pages">
        <Option value="$id">
          <Val expr="$title"/>
        </Option>
      </For>
    </Select>
    <Select value="$selectedPageId" class="p-4 border m-4" render="custom">
      <For in="pages">
        <Option value="$id">
          <If expr="$selected" test="true" display="inline-block">
            <Button class="border rounded p-4 m-4 bg-black text-white" action="select">
              <Val expr="$title"/>
            </Button>
          </If>
          <If expr="$selected" test="notTrue" display="inline-block">
            <Button class="border rounded p-4 m-4" action="select">
              <Val expr="$title"/>
            </Button>
          </If>
        </Option>
      </For>
    </Select>
  </div>
  <div class="p-3 m-3 border">
    <For in="pages" where='{"id":"$selectedPageId"}'>
      <div>Title: <Val expr="$title"/></div>
      <div>Content: <Val expr="$content"/></div>
    </For>
  </div>
</Page>