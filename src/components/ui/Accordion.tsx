import type { SideBarRoute } from "@myTypes/SideBar";
import { useState, useEffect } from "react";

type AccordionProps = SideBarRoute & {
	target?: string;
};

export default function Accordion({ title, items, icon, href, target }: AccordionProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [svgContent, setSvgContent] = useState<string>("");

	useEffect(() => {
		if (icon) {
			fetch(icon)
				.then((res) => res.text())
				.then(setSvgContent);
		}
	}, [icon]);

	const handleClick = () => {
		if (href) {
			window.open(href, target ?? "_self");
		} else if (items?.length > 0) {
			setIsOpen(!isOpen);
		}
	};

	return (
		<div className="accordion">
			<button
				type="button"
				className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
				onClick={handleClick}
			>
				{icon && (
					<div
						className="flex-shrink-0 w-6 h-6 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
						dangerouslySetInnerHTML={{ __html: svgContent }}
					/>
				)}
				<span className="flex-1 ml-3 text-left whitespace-nowrap">{title}</span>
				{items?.length > 0 && (
					<svg className={`w-6 h-6 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
					</svg>
				)}
			</button>

			<ul className={`py-2 space-y-1 ${isOpen ? "" : "hidden"}`}>
				{items?.map((item) => (
					<li key={item.href}>
						<a
							href={item.href}
							className="flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
						>
							{item.label}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
