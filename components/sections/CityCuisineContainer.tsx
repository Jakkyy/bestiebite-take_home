"use client";

import dynamic from "next/dynamic";

import { useCitySelection } from "@/hooks/useCitySelection";
import { Spinner } from "../ui/spinner";
import { CitySearchView } from "./SearchView";

const CityCuisinesView = dynamic(
	() => import("./CuisinesView").then((m) => m.CityCuisinesView),
	{ loading: () => <CuisinesViewFallback /> },
);

export function CityCuisineContainer() {
	const { selectedCity, selectCity, clearCity } = useCitySelection();

	return selectedCity ? (
		<CityCuisinesView city={selectedCity} onBack={clearCity} />
	) : (
		<CitySearchView onCitySelect={selectCity} />
	);
}

function CuisinesViewFallback() {
	return (
		<main className="mx-auto flex w-full max-w-7xl justify-center px-4 pt-28 pb-16 sm:px-6 lg:px-16">
			<Spinner aria-label="Caricamento cucine" />
		</main>
	);
}
