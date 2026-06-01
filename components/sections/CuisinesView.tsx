"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { fetchCitiesCuisine } from "@/lib/api";
import type { CityCuisine, CitySuggestion } from "@/lib/schemas";
import { queryKeys } from "@/lib/query-keys";
import { Skeleton } from "../ui/skeleton";
import { Spinner } from "../ui/spinner";

const cuisineGridClass = "mt-6 grid grid-cols-2 gap-4 md:grid-cols-4";

const cuisineCardClass =
	"border-border bg-surface min-h-44 flex items-center justify-center rounded-2xl border px-6 py-7";

export function CityCuisinesView({
	city,
	onBack,
}: {
	city: CitySuggestion;
	onBack: () => void;
}) {
	const { data, isFetching, error, refetch } = useQuery({
		queryKey: queryKeys.cuisines(city.id),
		queryFn: ({ signal }) =>
			fetchCitiesCuisine(city.latitude, city.longitude, signal),
	});

	const cuisines = data?.data ?? [];
	const cityDetails = city.structured_formatting.secondary_text;

	function renderContent() {
		if (isFetching) return <LoadingState cityName={city.name} />;
		if (error) return <ErrorState onRetry={() => void refetch()} />;
		if (cuisines.length === 0) return <EmptyResults />;
		return <CuisineGrid cuisines={cuisines} />;
	}

	return (
		<main
			data-component="CityCuisinesView"
			className="mx-auto w-full max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-16">
			<button
				type="button"
				onClick={onBack}
				className="text-primary hover:text-primary/80 mb-8 inline-flex cursor-pointer items-center gap-2 text-lg font-light tracking-wide transition-colors">
				<ArrowLeft className="size-4" />
				Cucine in città
			</button>

			<h2 className="text-foreground text-5xl font-bold tracking-tight">
				{city.name}
			</h2>
			<div className="from-primary/85 via-primary to-primary/35 mt-3 h-1 w-44 rounded-full bg-linear-to-r shadow-[0_0_12px_rgba(255,92,92,0.45)]" />
			<p className="text-muted mt-2 text-lg">{cityDetails}</p>

			{!error && (isFetching || cuisines.length > 0) && (
				<div className="text-muted mt-12 flex items-center gap-2 text-sm tracking-[0.3em] uppercase">
					{isFetching ? (
						<Skeleton className="inline-block h-4 w-7 align-middle" />
					) : (
						cuisines.length
					)}{" "}
					cucine disponibili
				</div>
			)}

			{renderContent()}
		</main>
	);
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
	return (
		<div className="mt-8 flex items-center gap-3">
			<p className="text-sm text-red-400">
				Errore nel caricamento delle cucine.
			</p>
			<button
				type="button"
				onClick={onRetry}
				className="border-border hover:border-primary/70 text-foreground hover:bg-primary/10 rounded-lg border px-3 py-1 text-xs font-medium transition-colors">
				Riprova
			</button>
		</div>
	);
}

function EmptyResults() {
	return (
		<p className="text-muted mt-8 text-sm">
			Nessuna cucina disponibile per questa città.
		</p>
	);
}

function CuisineGrid({ cuisines }: { cuisines: CityCuisine[] }) {
	return (
		<ul className={cuisineGridClass}>
			{cuisines.map((cuisine) => (
				<li key={cuisine.id} className={cuisineCardClass}>
					<div className="flex flex-col items-center">
						<div className="mb-4 flex size-16 items-center justify-center overflow-hidden rounded-full bg-[#1b1d21] ring-1 ring-white/10">
							<Image
								src={cuisine.image_emoji}
								alt={cuisine.name_it}
								width={64}
								height={64}
								className="h-full w-full object-contain p-1"
							/>
						</div>
						<p className="text-foreground text-center text-xl font-medium tracking-wide">
							{cuisine.name_it}
						</p>
					</div>
				</li>
			))}
		</ul>
	);
}

function LoadingState({ cityName }: { cityName: string }) {
	return (
		<div className="mt-16 flex flex-col items-center gap-3">
			<Spinner aria-label="Caricamento cucine" />
			<p className="text-muted text-sm">
				Stiamo caricando le cucine di {cityName}…
			</p>
		</div>
	);
}
