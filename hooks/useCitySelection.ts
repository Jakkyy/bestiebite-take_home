import { useCallback, useState } from "react";

import { CitySuggestion } from "@/lib/schemas";

export function useCitySelection() {
	const [selectedCity, setSelectedCity] = useState<CitySuggestion | null>(
		null,
	);

	const selectCity = useCallback((city: CitySuggestion) => {
		setSelectedCity(city);
	}, []);

	const clearCity = useCallback(() => {
		setSelectedCity(null);
	}, []);

	return { selectedCity, selectCity, clearCity };
}
