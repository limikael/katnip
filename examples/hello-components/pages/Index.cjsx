<Page route="/" pageType="RibbonPage" header="Header" footer="Footer"
		declarations='{"dict":["hello","world"],"index":0}'>
	<div>
		Hello World test...

		<NumActions var="$index">
			<Button action="decrease">Dec</Button>
			<Button action="increase">Inc</Button>
		</NumActions>

		<!--
		Here is the about page: <Link href="/about">about</Link> ...
		<div>
			testing for loop...
			<For in="$blogs">
				<div>
					loop iteration: <Link href="/blog/$slug"><Val expr="$title"/></Link>
				</div>
			</For>
		</div>
		-->
	</div>
	<MyBlock/>
</Page>