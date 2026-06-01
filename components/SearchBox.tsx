"use client";

import { fetchCities } from "@/lib/api";
import { CitySuggestion } from "@/lib/schemas";
import { ChevronRight, Search, X } from "lucide-react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
} from "@/components/ui/input-group";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "./ui/skeleton";
import { queryKeys } from "@/lib/query-keys";

export function CitySearch({
	onCitySelect,
}: {
	onCitySelect: (city: CitySuggestion) => void;
}) {
	const [inputValue, setInputValue] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const debouncedValue = useDebounce(inputValue);
	const term = normalizeTerm(debouncedValue);
	const hasMinChars = normalizeTerm(inputValue).length >= 2;
	const isDebouncing = hasMinChars && inputValue !== debouncedValue;

	const {
		data: suggestions = [],
		isFetching,
		isError,
		isSuccess,
		refetch,
	} = useQuery({
		queryKey: queryKeys.suggestions(term),
		queryFn: ({ signal }) => fetchCities(term, signal),
		enabled: term.length >= 2,
	});

	const isLoading = isDebouncing || isFetching;
	const isEmpty = !isLoading && isSuccess && suggestions.length === 0;
	const showSuggestions = hasMinChars && isOpen;

	const handleSelectCity = (city: CitySuggestion) => {
		setInputValue(city.name);
		setIsOpen(false);
		onCitySelect(city);
	};

	const handleValueChange = (value: string) => {
		setIsOpen(true);
		setInputValue(value);
	};

	const handleClear = () => {
		setInputValue("");
		setIsOpen(true);
		inputRef.current?.focus();
	};

	function renderSuggestions() {
		if (isLoading) return <LoadingSuggestions />;
		if (isError) return <ErrorState onRetry={() => void refetch()} />;
		if (isEmpty) return <EmptyResults />;

		return (
			<CommandList aria-label="Suggerimenti città">
				{suggestions.map((item) => (
					<CommandItem
						key={item.id}
						value={String(item.id)}
						onSelect={() => handleSelectCity(item)}
						className="group data-[selected=true]:bg-primary/10 flex cursor-pointer items-center justify-between border-b border-[#1a1a1a] px-4 py-3 text-left transition-colors last:border-b-0">
						<div className="flex flex-col gap-0.5">
							<p className="text-foreground text-sm font-semibold">
								{item.name}
							</p>
							<p className="text-muted text-xs">
								{item.structured_formatting.secondary_text}
							</p>
						</div>
						<ChevronRight className="text-muted size-5 shrink-0 opacity-0 transition-opacity duration-300 group-data-[selected=true]:opacity-100" />
					</CommandItem>
				))}
			</CommandList>
		);
	}

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				rootRef.current &&
				!rootRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div ref={rootRef} className="relative mb-14 w-full max-w-lg">
			<Command
				shouldFilter={false}
				loop
				data-component="CitySearch"
				className="w-full overflow-visible">
				<InputGroup className="border-border text-foreground placeholder:text-muted focus-visible:border-primary/40 focus-visible:ring-primary/30 bg-surface ring-primary/60 h-12 rounded-xl border text-base shadow-none focus-visible:ring-1">
					<InputGroupAddon>
						<Search className="text-primary size-5" />
					</InputGroupAddon>
					<CommandPrimitive.Input
						ref={inputRef}
						data-slot="input-group-control"
						value={inputValue}
						onValueChange={handleValueChange}
						onFocus={() => setIsOpen(true)}
						onKeyDown={(e) => {
							if (e.key === "Escape") setIsOpen(false);
						}}
						placeholder="Cerca una città..."
						aria-label="Cerca una città"
						autoComplete="off"
						className="placeholder:text-muted flex-1 rounded-none border-0 bg-transparent text-base shadow-none outline-none focus-visible:ring-0"
					/>
					{inputValue && (
						<InputGroupAddon align="inline-end">
							<InputGroupButton
								aria-label="Pulisci ricerca città"
								size="icon-sm"
								className="text-muted hover:text-foreground/80 cursor-pointer rounded-full hover:bg-transparent"
								onClick={handleClear}>
								<X className="size-4" />
							</InputGroupButton>
						</InputGroupAddon>
					)}
				</InputGroup>

				{showSuggestions && (
					<div
						role="presentation"
						className="border-border bg-surface absolute top-16 left-0 w-full overflow-hidden rounded-2xl border shadow-md">
						{renderSuggestions()}
					</div>
				)}
			</Command>
		</div>
	);
}

function normalizeTerm(value: string) {
	return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function EmptyResults() {
	return (
		<p className="text-muted px-4 py-3 text-sm">
			Nessun risultato trovato per questo termine.
		</p>
	);
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
	return (
		<div className="flex items-center justify-between gap-3 px-4 py-3">
			<p className="text-sm text-red-400">
				Errore nel caricamento delle città.
			</p>
			<button
				type="button"
				onClick={onRetry}
				className="border-border hover:border-primary/70 text-foreground hover:bg-primary/10 cursor-pointer rounded-lg border px-3 py-1 text-xs font-medium transition-colors">
				Riprova
			</button>
		</div>
	);
}

function LoadingSuggestions() {
	return (
		<ul className="divide-y divide-[#1a1a1a]">
			{Array.from({ length: 4 }).map((_, index) => (
				<li
					key={`skeleton-${index}`}
					className="flex items-center justify-between px-4 py-3 transition-colors">
					<div className="flex flex-col gap-0.5">
						<Skeleton className="h-5 w-32 animate-pulse" />
						<Skeleton className="h-4 w-24 animate-pulse" />
					</div>
				</li>
			))}
		</ul>
	);
}
