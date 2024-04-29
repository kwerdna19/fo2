import { OpenAPI } from "./fo-openapi-client/core/OpenAPI";

OpenAPI.interceptors.request.use(async (request) => {
	request.next = {
		revalidate: 3600,
	};
	return request;
});
