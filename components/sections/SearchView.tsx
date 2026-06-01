"use client";

import { CitySearch } from "../SearchBox";
import Image from "next/image";
import { CitySuggestion } from "@/lib/schemas";

export function CitySearchView({
	onCitySelect,
}: {
	onCitySelect: (city: CitySuggestion) => void;
}) {
	return (
		<main className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-4 py-10 md:py-28">
			<h1 className="text-foreground mb-4 text-center text-3xl font-bold tracking-tight md:text-6xl">
				Cucine in città
			</h1>
			<p className="text-muted mb-10 text-center text-lg tracking-wide">
				Scopri cosa si mangia ovunque nel mondo, in pochi click
			</p>

			<CitySearch onCitySelect={onCitySelect} />

			<Image
				src="/italy.svg"
				alt="Map of Italy"
				aria-hidden
				width={224}
				height={254}
				className="w-56"
			/>

			<p className="text-muted mt-8 text-center text-lg tracking-wide">
				inizia a cercare una città per scoprire le cucine disponibili
			</p>
		</main>
	);
}
