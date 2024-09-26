type Props = {
	className?: string;
	data: {
		faction: {
			id: number;
			name: string;
		};
		factionXp: number;
	};
};

function FactionDisplay({ data, className }: Props) {
	// consider mobs with 0 faction xp to not be in a faction
	if (data.factionXp === 0) {
		return null;
	}

	// TODO improve display
	return <div className={className}>{data.faction?.name}</div>;
}

export default FactionDisplay;
