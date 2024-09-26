import { keepPreviousData } from "@tanstack/react-query";
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { type UseQueryStatesKeysMap, useQueryStates } from "nuqs";
import { shallowCompare } from "~/utils/misc";
import {
	type DataTableSearchParamOptions,
	getDataTableSearchParams,
} from "./data-table-utils";

export const useDataTableQueryParams = (ops?: DataTableSearchParamOptions) => {
	const [params, setParams] = useQueryStates(getDataTableSearchParams(ops));

	const sorting: SortingState = params.sort
		? [
				{
					id: params.sort,
					desc: params.sort_dir === "desc",
				},
			]
		: [];
	const setSorting = (
		param: SortingState | ((p: SortingState) => SortingState),
	) => {
		const [s] = typeof param === "function" ? param(sorting) : param;

		if (!s) {
			setParams({
				sort: null,
				sort_dir: null,
			});
			return;
		}
		setParams({
			sort: s.id,
			sort_dir: s.desc ? "desc" : "asc",
		});
	};

	const pagination: PaginationState = {
		pageIndex: params.page - 1,
		pageSize: params.per_page,
	};
	const setPagination = (
		param: PaginationState | ((p: PaginationState) => PaginationState),
	) => {
		const p = typeof param === "function" ? param(pagination) : param;

		setParams({
			page: p.pageIndex + 1,
			per_page: p.pageSize,
		});
	};

	const resetPage = () => setParams({ page: null });

	const search = params.query ?? "";
	const setSearch = (s: string | undefined | null) => {
		setParams({
			query: !s ? null : s,
			page: 1,
		});
	};

	return {
		pagination,
		setPagination,
		sorting,
		setSorting,
		search,
		setSearch,
		resetPage,
	};
};

export function useDataTableQueryOptions<
	T extends UseQueryStatesKeysMap,
	P extends Record<string | number | symbol, unknown>,
	D,
>(
	t: T,
	props: { initialParams: P; initialData: D },
	ops?: DataTableSearchParamOptions,
) {
	const [tableParams] = useQueryStates(getDataTableSearchParams(ops));

	const [filters] = useQueryStates(t);
	const params = { ...filters, ...tableParams };

	return {
		params,
		options: {
			initialData: shallowCompare(params, props.initialParams)
				? props.initialData
				: undefined,
			placeholderData: keepPreviousData,
		},
		searchParamOptions: ops,
	};
}
