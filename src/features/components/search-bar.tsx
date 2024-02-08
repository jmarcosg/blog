"use client";

import { Search } from "@/assets/icons";
import { Input } from "@/components/ui";
import React from "react";

interface SearchBarProps {
	value: string;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const SearchBar = (props: SearchBarProps) => {
	const { value, onChange } = props;

	const inputRef = React.useRef<HTMLInputElement | null>(null);

	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k" && inputRef.current) {
				e.preventDefault();
				inputRef.current.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<div className="relative w-full">
			<Search className="absolute inset-y-0 left-3 my-auto h-6 w-6 text-gray-500" />
			<Input
				type="search"
				value={value}
				onChange={onChange}
				placeholder="Search a post, a topic, a keyword..."
				className="rounded-2xl px-12 py-7 bg-neutral-100/40 dark:bg-slate-700 transition-all text-gray-500 dark:text-gray-100"
				ref={inputRef}
			/>
		</div>
	);
};
