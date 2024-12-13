import { useState, useRef, useEffect } from "react";

const LanguageSelector = () => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Get current language from URL
	const getCurrentLanguage = () => {
		const pathParts = window.location.pathname.split("/");
		if (pathParts[1] === "nl-BE") {
			return "nl-BE";
		}
		return "en-US"; // Default language
	};

	// Navigate to URL with language code
	const handleLanguageChange = (langCode: string) => {
		const currentPath = window.location.pathname;

		let newPath;
		if (currentPath.startsWith("/nl-BE/")) {
			// Remove language code if switching to default English
			newPath = langCode === "en-US" ? currentPath.replace("/nl-BE/", "/") : currentPath;
		} else if (langCode === "nl-BE") {
			// Add nl-BE language code to path
			newPath = currentPath === "/" ? "/nl-BE" : "/nl-BE" + currentPath;
		} else {
			// Keep path as-is for English (default)
			newPath = currentPath;
		}

		window.location.href = newPath;
		setIsOpen(false);
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white z-10"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="lucide lucide-languages"
				>
					<path d="m5 8 6 6" />
					<path d="m4 14 6-6 2-3" />
					<path d="M2 5h12" />
					<path d="M7 2h1" />
					<path d="m22 22-5-10-5 10" />
					<path d="M14 18h6" />
				</svg>
			</button>

			{isOpen && (
				<div className="fixed md:absolute inset-x-0 md:inset-auto bottom-0 md:bottom-full md:right-0 md:mb-2 md:w-44 bg-white rounded-t-lg md:rounded-lg shadow-[0_-2px_10px_rgba(0,0,0,0.1)] md:shadow dark:bg-gray-700 z-50">
					<ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
						<li>
							<button onClick={() => handleLanguageChange("en-US")} className="block w-full text-left px-4 py-3 md:py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
								English (US)
							</button>
						</li>
						<li>
							<button onClick={() => handleLanguageChange("nl-BE")} className="block w-full text-left px-4 py-3 md:py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
								Nederlands (BE)
							</button>
						</li>
					</ul>
				</div>
			)}
		</div>
	);
};

export default LanguageSelector;
