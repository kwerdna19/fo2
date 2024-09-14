/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
	"/api/public/guild/leaderboard": {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		/**
		 * Retrieves the top 10 guilds based on level.
		 * @description Returns a list of the top 10 guilds, sorted by level in descending order. Each guild's name and level are included in the response. Note: This endpoint requires a valid API key included in the 'x-api-key' header.
		 *
		 */
		get: operations["getGuildLeaderboard"];
		put?: never;
		post?: never;
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	"/api/public/guild/members": {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		get?: never;
		put?: never;
		/**
		 * Retrieves members of the specified guild.
		 * @description Fetches details of guild members such as name, sprite, level, guild name, and rank, sorted by rank and donations. Note: This endpoint requires a valid API key included in the 'x-api-key' header.
		 *
		 */
		post: operations["getGuildMembers"];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	"/api/public/guild": {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		get?: never;
		put?: never;
		/**
		 * Retrieves details of the specified guild.
		 * @description Fetches details of a specific guild including its name, number of members, total donations, level, and approval status. Note: This endpoint requires a valid API key included in the 'x-api-key' header.
		 *
		 */
		post: operations["getGuildDetails"];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	"/api/public/market/search": {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		get?: never;
		put?: never;
		/**
		 * Retrieves market listings based on search criteria.
		 * @description Fetches market listings filtered by an optional search term applicable to item names across multiple languages, supporting pagination and sorting. Returns up to 10 listings per page, sorted by 'Listed' in descending order by default.
		 */
		post: operations["searchMarketListings"];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
}
export type webhooks = Record<string, never>;
export interface components {
	schemas: never;
	responses: never;
	parameters: never;
	requestBodies: never;
	headers: never;
	pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
	getGuildLeaderboard: {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: never;
		responses: {
			/** @description Successfully retrieved the top 10 guilds. */
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					"application/json": {
						/** @description The name of the guild. */
						Name?: string;
						/** @description The level of the guild. */
						Level?: number;
					}[];
				};
			};
			/** @description Internal server error. This could be due to database connectivity issues or unexpected server errors. */
			500: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	getGuildMembers: {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		/** @description Name of the guild for which to retrieve members. The guild name must be between 4 and 18 characters and can only contain alphanumeric characters and spaces.
		 *      */
		requestBody: {
			content: {
				"application/json": {
					/**
					 * @description The name of the guild to retrieve members for, adhering to validation rules.
					 *
					 * @example Monkey Time
					 */
					name?: string;
				};
			};
		};
		responses: {
			/** @description Successfully retrieved the guild members. */
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					"application/json": {
						/** @description The name of the guild member. */
						Name?: string;
						/** @description The sprite image reference of the guild member. */
						Sprite?: string;
						/** @description The level of the guild member. */
						Level?: number;
						/** @description The name of the guild. */
						GuildName?: string;
						/** @description The rank of the guild member within the guild. */
						GuildRank?: string;
					}[];
				};
			};
			/** @description Invalid JSON in request body or the guild name does not meet validation criteria (missing, empty, not between 4 and 18 characters, or contains invalid characters). */
			400: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
			/** @description Internal server error. This could be due to database connectivity issues or unexpected server errors. */
			500: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	getGuildDetails: {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		/** @description Name of the guild for which to retrieve details. The guild name must be between 4 and 18 characters and can only contain alphanumeric characters and spaces.
		 *      */
		requestBody: {
			content: {
				"application/json": {
					/**
					 * @description The name of the guild to retrieve details for, adhering to validation rules.
					 * @example Monkey Time
					 */
					name?: string;
				};
			};
		};
		responses: {
			/** @description Successfully retrieved the guild details. */
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					"application/json": {
						/** @description The name of the guild. */
						Name?: string;
						/** @description The number of members in the guild. */
						NumMembers?: number;
						/** @description The total donations made to the guild. */
						TotalDonations?: number;
						/** @description The level of the guild. */
						Level?: number;
						/**
						 * Format: date-time
						 * @description The date and time the guild was approved.
						 */
						Approved?: string;
					};
				};
			};
			/** @description Invalid JSON in request body or the guild name does not meet validation criteria (missing, empty, not between 4 and 18 characters, or contains invalid characters). */
			400: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
			/** @description Internal server error. This could be due to database connectivity issues or unexpected server errors. */
			500: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	searchMarketListings: {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody: {
			content: {
				"application/json": {
					/**
					 * @description Optional filter by item name. Case-insensitive.
					 * @example crab
					 */
					search_term?: string;
					/**
					 * @description Criteria for sorting the results. Defaults to 'Listed'.
					 * @example Listed
					 * @enum {string}
					 */
					sort_by?: "Price" | "TimeLeft" | "Listed";
					/**
					 * @description Direction for sorting. Defaults to 'DESC'.
					 * @example DESC
					 * @enum {string}
					 */
					sort_direction?: "ASC" | "DESC";
					/**
					 * @description Page number for pagination, starts from 1.
					 * @example 1
					 */
					page?: number;
				};
			};
		};
		responses: {
			/** @description Successfully retrieved market listings and associated item definitions. */
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					"application/json": {
						/** @description Array of market listing objects. */
						listings?: {
							/** @description Unique identifier for the market listing. */
							Id?: number;
							/** @description Identifier for the item definition associated with the listing. */
							ItemDefinitionId?: number;
							/** @description Data specific to the item instance in the listing. */
							ItemInstanceData?: Record<string, never>;
							/** @description Price of the listed item. */
							Price?: number;
							/** @description Duration of the listing in days. */
							Duration?: number;
							/** @description Timestamp when the item was listed, in milliseconds since the Unix epoch. */
							Listed?: number;
							/** @description Most recent sale price for the item from the archive. */
							LastSoldPrice?: number;
						}[];
						/** @description Array of item definition objects. */
						itemDefinitions?: {
							/** @description Unique identifier for the item definition. */
							id?: number;
							/** @description Filename for the sprite associated with the item. */
							sfn?: string;
							/** @description Type identifier for the item. */
							ty?: number;
							/** @description Subtype identifier for the item. */
							st?: number;
							/** @description Quality of the item. */
							q?: number;
							/** @description Level requirement for the item. */
							lr?: number;
							/** @description Stat requirements for the item. */
							sr?: string;
							/** @description Binding type of the item. */
							bt?: string;
							/** @description Stats associated with the item. */
							sta?: string;
							/** @description Stack size of the item. */
							ss?: number;
							/** @description Vendor buy currency for the item. */
							vbc?: string;
							/** @description Vendor buy price for the item. */
							vbp?: number;
							/** @description Vendor sell currency for the item. */
							vsc?: string;
							/** @description Vendor sell price for the item. */
							vsp?: number;
							/** @description Translations for the item name and description. */
							t?: {
								[key: string]: {
									/** @description Item name in a specific language. */
									n?: string;
									/** @description Item description in a specific language. */
									d?: string;
								};
							};
						}[];
						/** @description Pagination information. */
						pagination?: {
							/** @description Total number of items available across all pages. */
							totalItems?: number;
							/** @description Total number of pages available. */
							totalPages?: number;
							/** @description Current page number being viewed. */
							currentPage?: number;
							/** @description Number of items per page, fixed at 10. */
							itemsPerPage?: number;
						};
					};
				};
			};
			/** @description Invalid request parameters. */
			400: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
			/** @description Internal server error. */
			500: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
}