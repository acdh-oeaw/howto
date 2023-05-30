import { Dialog } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Children, cloneElement, Fragment, isValidElement, type ReactNode, useState } from "react";

interface CarouselProps {
	children: ReactNode;
	title: string;
}

export function Carousel(props: CarouselProps): JSX.Element | null {
	const { children, title } = props;

	const items = Children.toArray(children).filter(isValidElement);

	const [isOpen, setIsOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);

	const hasPrevious = selectedIndex > 0;
	const hasNext = selectedIndex < items.length - 1;

	function onPrevious() {
		setSelectedIndex((current) => {
			if (current > 0) return current - 1;
			return current;
		});
	}

	function onNext() {
		setSelectedIndex((current) => {
			if (current < items.length - 1) return current + 1;
			return current;
		});
	}

	function onOpen() {
		setIsOpen(true);
	}

	function onClose() {
		setIsOpen(false);
	}

	const selected = items[selectedIndex];

	if (selected == null) return null;

	return (
		<Fragment>
			<button
				className="relative my-4 w-full rounded border p-4 transition hover:bg-neutral-100 [&>*]:my-2"
				onClick={onOpen}
			>
				{/* @ts-expect-error Missing type for allowed props. */}
				{cloneElement(selected, { variant: "image" })}
			</button>

			<Dialog className="relative z-50" open={isOpen} onClose={onClose}>
				<div className="fixed inset-0 bg-black/30" />

				<div className="fixed inset-0 flex items-center justify-center p-4">
					<Dialog.Panel className="relative grid w-full max-w-[1440px] gap-4 rounded bg-white p-8">
						<Dialog.Title className="text-lg font-extrabold">{title}</Dialog.Title>

						<div className="grid grid-cols-[auto_1fr_auto] gap-4">
							<button
								className="flex items-center gap-1 rounded p-4 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-500 disabled:hover:bg-transparent"
								disabled={!hasPrevious}
								onClick={onPrevious}
							>
								<ChevronLeftIcon className="h-5 w-5 shrink-0" />
								<span className="sr-only">Previous</span>
							</button>

							<div className="prose max-w-none overflow-hidden">
								{/* @ts-expect-error Missing type for allowed props. */}
								{cloneElement(selected, { sizes: "1440px" })}
							</div>

							<button
								className="flex items-center gap-1 rounded p-4 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-500 disabled:hover:bg-transparent"
								disabled={!hasNext}
								onClick={onNext}
							>
								<span className="sr-only">Next</span>
								<ChevronRightIcon className="h-5 w-5 shrink-0" />
							</button>
						</div>

						<button className="absolute right-4 top-4 flex items-center gap-1 text-neutral-600 transition hover:text-neutral-900 focus:text-neutral-900">
							<span className="sr-only">Close</span>
							<XMarkIcon className="h-5 w-5 shrink-0" />
						</button>
					</Dialog.Panel>
				</div>
			</Dialog>
		</Fragment>
	);
}
