// This file is auto-generated by @hey-api/openapi-ts

import type { CancelablePromise } from "./core/CancelablePromise";
import { OpenAPI } from "./core/OpenAPI";
import { request as __request } from "./core/request";
import type {
	GetGuildDetailsData,
	GetGuildDetailsResponse,
	GetGuildLeaderboardData,
	GetGuildLeaderboardResponse,
	GetGuildMembersData,
	GetGuildMembersResponse,
} from "./types.gen";

/**
 * Retrieves the top 10 guilds based on level.
 * Returns a list of the top 10 guilds, sorted by level in descending order. Each guild's name and level are included in the response. Note: This endpoint requires a valid API key included in the 'x-api-key' header.
 *
 * @param data The data for the request.
 * @param data.xApiKey API Key for authentication.
 * @returns unknown Successfully retrieved the top 10 guilds.
 * @throws ApiError
 */
export const getGuildLeaderboard = (
	data: GetGuildLeaderboardData,
): CancelablePromise<GetGuildLeaderboardResponse> => {
	return __request(OpenAPI, {
		method: "GET",
		url: "/api/public/guild/leaderboard",
		headers: {
			"x-api-key": data.xApiKey,
		},
		errors: {
			500: "Internal server error. This could be due to database connectivity issues or unexpected server errors.",
		},
	});
};

/**
 * Retrieves members of the specified guild.
 * Fetches details of guild members such as name, sprite, level, guild name, and rank, sorted by rank and donations. Note: This endpoint requires a valid API key included in the 'x-api-key' header.
 *
 * @param data The data for the request.
 * @param data.xApiKey API Key for authentication.
 * @param data.requestBody Name of the guild for which to retrieve members. The guild name must be between 4 and 18 characters and can only contain alphanumeric characters and spaces.
 *
 * @returns unknown Successfully retrieved the guild members.
 * @throws ApiError
 */
export const getGuildMembers = (
	data: GetGuildMembersData,
): CancelablePromise<GetGuildMembersResponse> => {
	return __request(OpenAPI, {
		method: "POST",
		url: "/api/public/guild/members",
		headers: {
			"x-api-key": data.xApiKey,
		},
		body: data.requestBody,
		mediaType: "application/json",
		errors: {
			400: "Invalid JSON in request body or the guild name does not meet validation criteria (missing, empty, not between 4 and 18 characters, or contains invalid characters).",
			500: "Internal server error. This could be due to database connectivity issues or unexpected server errors.",
		},
	});
};

/**
 * Retrieves details of the specified guild.
 * Fetches details of a specific guild including its name, number of members, total donations, level, and approval status. Note: This endpoint requires a valid API key included in the 'x-api-key' header.
 *
 * @param data The data for the request.
 * @param data.xApiKey API Key for authentication.
 * @param data.requestBody Name of the guild for which to retrieve details. The guild name must be between 4 and 18 characters and can only contain alphanumeric characters and spaces.
 *
 * @returns unknown Successfully retrieved the guild details.
 * @throws ApiError
 */
export const getGuildDetails = (
	data: GetGuildDetailsData,
): CancelablePromise<GetGuildDetailsResponse> => {
	return __request(OpenAPI, {
		method: "POST",
		url: "/api/public/guild",
		headers: {
			"x-api-key": data.xApiKey,
		},
		body: data.requestBody,
		mediaType: "application/json",
		errors: {
			400: "Invalid JSON in request body or the guild name does not meet validation criteria (missing, empty, not between 4 and 18 characters, or contains invalid characters).",
			500: "Internal server error. This could be due to database connectivity issues or unexpected server errors.",
		},
	});
};
