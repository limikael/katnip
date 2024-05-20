<Page route="/blog/$slug" pageType="RibbonPage" header="Header" footer="Footer">
	<div>
		testing slug: <Val expr="$slug"/>
	</div>
	<For in="blogs" where='{"slug":"$slug"}'>
		<h1><Val expr="$title"/></h1>
		<p>
			<Val expr="$content"/>
		</p>
	</For>
</Page>