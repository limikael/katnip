import {extractJsonObject} from "../../src/utils/json-util.js";

describe("json-util",()=>{
	it("can extract json from text",async ()=>{
		let out=`
 ⛅️ wrangler 4.26.0 (update available 4.26.1)
─────────────────────────────────────────────
✅ Successfully created DB 'katnip-test' in region UNKNOWN
Created your new D1 database.

{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "katnip-test",
      "database_id": "fa5d84d1-6ed8-4419-ad83-ffc8700b8ca1"
    }
  ]
}
`;

		let json=extractJsonObject(out);
		let o=JSON.parse(json);
		expect(o.d1_databases[0].database_id).toEqual("fa5d84d1-6ed8-4419-ad83-ffc8700b8ca1");
	});
});