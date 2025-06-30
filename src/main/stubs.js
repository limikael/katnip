export const SERVER_JS=
`export async function onFetch({request}) {
    // return new Response("This is the server...");
}
`;

export const INDEX_JSX=
`export default function() {
	return (<>
		<div class="p-5">HELLO FROM KATNIP</div>
	</>);
}
`;

export const QUICKMIN_YAML=
`jwtSecret: "changeme"
adminUser: "admin"
adminPass: "admin"
apiPath: "admin"

collections:
  pages:
    policies:
    - roles: admin
    fields:
      <Text id="content"/>
`;

export const TAILWIND_CONFIG_CJS=
`module.exports = {
  content: ["./src/**/*.jsx"],
  theme: {
    extend: {
    },
    colors: {
      error: "#ff0000"
    },
  },
}
`;