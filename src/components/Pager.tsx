import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "~/components/ui/pagination";

// https://www.zacfukuda.com/blog/pagination-algorithm
function paginate({ current, max }: { current: number; max: number }) {
	// if (!current || !max) return null

	const prev = current === 1 ? null : current - 1;
	const next = current === max ? null : current + 1;
	const items = [1] as (number | null)[];

	if (current === 1 && max === 1) return { current, prev, next, items };
	if (current > 4) items.push(null);

	const r = 2;
	const r1 = current - r;
	const r2 = current + r;

	for (let i = r1 > 2 ? r1 : 2; i <= Math.min(max, r2); i++) items.push(i);

	if (r2 + 1 < max) items.push(null);
	if (r2 < max) items.push(max);

	return { current, prev, next, items };
}

export function Pager({
	page,
	totalPages,
	onChange,
}: {
	page: number;
	totalPages: number;
	onChange: (ops: { page: number }) => void;
}) {
	const changePage = (p: number) => () => onChange({ page: p });

	const { items } = paginate({ current: page, max: totalPages });

	return (
		<Pagination>
			<PaginationContent>
				{/* <PaginationItem>
					<PaginationPrevious onClick={changePage(page - 1)} />
				</PaginationItem> */}
				{items.map((i) => (
					<PaginationItem key={i}>
						{i !== null ? (
							<PaginationLink isActive={i === page} onClick={changePage(i)}>
								{i}
							</PaginationLink>
						) : (
							<PaginationEllipsis />
						)}
					</PaginationItem>
				))}
				{/* <PaginationItem>
					<PaginationNext onClick={changePage(page + 1)} />
				</PaginationItem> */}
			</PaginationContent>
		</Pagination>
	);
}
