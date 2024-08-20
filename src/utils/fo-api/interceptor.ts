import { OpenAPI } from "./client/core/OpenAPI";

OpenAPI.interceptors.request.use(async (request) => {
	request.next = {
		revalidate: 3600,
	};
	return request;
});
