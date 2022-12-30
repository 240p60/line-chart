import { Fragment, useState, useEffect, useCallback } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { debounce } from "lodash";

interface ComboboxProps<T> {
	options: T[] | null;
	selected: T;
	handleChange: (data: T) => void;
}

const MyCombobox = <
	T extends {
		id: number;
		symbol: string;
	}
>({
	options,
	selected,
	handleChange
}: ComboboxProps<T>) => {
	const [query, setQuery] = useState(selected.symbol);
	const [filteredOptions, setFilteredOptions] = useState(options || []);

	const debounceFilterHandler = useCallback(
		debounce((query: string) => {
			if (query === "") {
				setFilteredOptions(options || []);
			}

			setFilteredOptions(
				options?.filter((coin) => {
					return coin.symbol.toLowerCase().includes(query.toLowerCase());
				}) || []
			);
		}, 500),
		[options]
	);

	useEffect(() => {
		debounceFilterHandler(query);
	}, [query]);

	return (
		<Combobox value={selected} onChange={handleChange}>
			<div className="relative">
				<div className="relative flex items-stretch w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
					<Combobox.Input
						className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-200 focus:ring-0"
						onChange={(event) => setQuery(event.target.value)}
						value={query}
					/>
					<Combobox.Button className="bg-white rounded-l-none flex items-center">
						<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
					</Combobox.Button>
				</div>
				<Transition
					as={Fragment}
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					afterLeave={() => setQuery(selected.symbol)}>
					<Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
						{filteredOptions?.length === 0 && query !== "" ? (
							<div className="relative cursor-default select-none py-2 px-4 text-gray-700">
								Nothing found.
							</div>
						) : (
							filteredOptions?.map((option) => (
								<Combobox.Option
									key={option.id}
									className={({ active }) =>
										`relative cursor-default select-none py-2 pl-10 pr-4 ${
											active ? "bg-indigo-500 text-white" : "text-gray-900"
										}`
									}
									value={option}>
									{({ selected, active }) => (
										<>
											<span
												className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
												{option.symbol}
											</span>
											{selected ? (
												<span
													className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
														active ? "text-white" : "text-indigo-500"
													}`}>
													<CheckIcon className="h-5 w-5" aria-hidden="true" />
												</span>
											) : null}
										</>
									)}
								</Combobox.Option>
							))
						)}
					</Combobox.Options>
				</Transition>
			</div>
		</Combobox>
	);
};

export default MyCombobox;
