<Page route="/subscript"
		declarations='{"dict":["hello","world"],"index":0}'>
	<div>
		<div>
			Testing subscript, the index: <Val expr="$index"/>
		</div>

		<div>
			With the subscript comp:
			<Subscript var="$reffed" in="$dict" field="$index">
				<Val expr="$reffed"/>
			</Subscript>
		</div>

		<div>
			With ast:
			<Val ast='{"token": "var", "var": "index"}'/>
		</div>

		<div>
			<NumActions var="$index">
				<Button action="decrease">Dec</Button>
				<Button action="increase">Inc</Button>
			</NumActions>
		</div>
	</div>
</Page>