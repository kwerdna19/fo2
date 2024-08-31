"use client";

import { useEffect, useState } from "react";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";

const fullConfig = resolveConfig(tailwindConfig);
const {
	theme: { screens },
} = fullConfig;
export function useBreakpoint(query: keyof typeof screens) {
	const mediaQuery = `(min-width: ${screens[query]})`;
	const [isMatch, setMatch] = useState<boolean | null>(null);

	useEffect(() => {
		const matchQueryList = window.matchMedia(mediaQuery);
		const onChange = (e: MediaQueryListEvent) => setMatch(e.matches);

		setMatch(matchQueryList.matches);
		matchQueryList.addEventListener("change", onChange);
		return () => matchQueryList.removeEventListener("change", onChange);
	}, [mediaQuery]);

	return isMatch;
}
