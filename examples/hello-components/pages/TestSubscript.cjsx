<Page route="/subscript"
		declarations='{"dict":["hello","world"],"index":0,"hello":"hello world"}'>
	<div>
		<div>
			Testing subscript, the index: <Val expr="$index"/>
		</div>

		<div>
			Testing subscript, the value: <Val expr="pos $index\: $dict[$index]"/>
		</div>

		<div>
			Input <ValInput expr="$dict[$index]"/>
		</div>

		<div>
			<NumActions var="$index">
				<Button action="decrease">Dec</Button>
				<Button action="increase">Inc</Button>
			</NumActions>
		</div>
	</div>
</Page>