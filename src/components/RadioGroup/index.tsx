import { useState, Fragment } from "react";
import { RadioGroup } from "@headlessui/react";

const plans = ["1D", "3D", "7D", "1M"];

interface RadioGroupProps {
	className?: string;
}

const MyRadioGroup = ({ className }: RadioGroupProps) => {
	const [plan, setPlan] = useState(plans[0]);

	return (
		<RadioGroup value={plan} onChange={setPlan} as="ul" className={`${className}`}>
			{plans.map((plan) => (
				<RadioGroup.Option key={plan} value={plan} as={Fragment}>
					{({ active, checked }) => (
						<li
							className={`${
								checked ? "border-indigo-500 text-indigo-500" : "border-gray-600 text-gray-400"
							} hover:border-indigo-500 hover:text-indigo-500 px-4 py-2 rounded-xl border-[1px] border-solid cursor-pointer outline-none`}>
							{plan}
						</li>
					)}
				</RadioGroup.Option>
			))}
		</RadioGroup>
	);
};

export default MyRadioGroup;
