import "@tanstack/react-table"; //or vue, svelte, solid, qwik, etc.

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends RowData, TValue> {
		heading?: string;
		sortTypes?: {
			id: string;
			name: string;
		}[];
		sortFieldReplacement?: string;
		hidden?: boolean;
	}
}
