import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
	input: "https://fantasyonline2.com/swagger.json",
	base: "https://fantasyonline2.com",
	output: "src/utils/fo-api",
});
