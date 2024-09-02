import type { PaginationState, SortingState } from "@tanstack/react-table";
import { useQueryStates } from "nuqs";
import { dataTableSearchParams } from "./data-table-utils";

export const useDataTableQueryParams = () => {
	const [params, setParams] = useQueryStates(dataTableSearchParams);

	const sorting: SortingState = [
		{
			id: params.sort,
			desc: params.sort_dir === "desc",
		},
	];
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
