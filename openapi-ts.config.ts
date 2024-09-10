import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
	client: "@hey-api/client-fetch",
	input: "https://fantasyonline2.com/swagger.json",
	output: "src/utils/fo-api/client",
});
