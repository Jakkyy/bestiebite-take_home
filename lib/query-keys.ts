export const queryKeys = {
	suggestions: (term: string) => ["city-suggestions", term] as const,
	cuisines: (city_id: number) => ["cuisines", city_id] as const,
};
