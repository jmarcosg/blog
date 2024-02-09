import { Separator } from "../ui";

export const Footer = async () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="container mb-4 px-4 text-center text-gray-400">
			<Separator />

			<small className="my-2 block text-xs">
				&copy; {currentYear}
				<a
					href="https://github.com/jmarcosg/blog"
					target="_blank"
					rel="noopener noreferrer"
					className="hover:underline"
				>
					{" "}
					jmarcosg
				</a>
				. All rights reserved.
			</small>
			<p className="text-xs">
				<span className="font-semibold">Built with ❤️ and ☕️</span>
			</p>
		</footer>
	);
};
