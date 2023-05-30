import { useDialog } from "@react-aria/dialog";
import { FocusScope } from "@react-aria/focus";
import { type OverlayProps as AriaOverlayProps } from "@react-aria/overlays";
import { OverlayContainer, useModal, useOverlay, usePreventScroll } from "@react-aria/overlays";
import { type ReactNode } from "react";
import { useRef } from "react";

export interface ModalDialogProps extends AriaOverlayProps {
	title?: string;
	children: ReactNode;
}

/**
 * Modal dialog.
 */
export function ModalDialog(props: ModalDialogProps): JSX.Element {
	const { title, children } = props;

	const overlayRef = useRef<HTMLDivElement>(null);
	const { overlayProps, underlayProps } = useOverlay(props, overlayRef);

	usePreventScroll();
	const { modalProps } = useModal();

	const { dialogProps, titleProps } = useDialog({}, overlayRef);

	return (
		<OverlayContainer>
			<div
				{...underlayProps}
				className="fixed inset-0 z-10 flex flex-col items-center justify-start bg-black bg-opacity-50 p-4 md:p-10vmin"
			>
				<FocusScope contain restoreFocus autoFocus>
					<div
						className="flex w-full max-w-screen-md flex-col overflow-hidden rounded bg-white p-8 shadow-md focus:outline-none focus-visible:ring focus-visible:ring-brand-blue"
						{...overlayProps}
						{...dialogProps}
						{...modalProps}
						ref={overlayRef}
					>
						{title != null ? (
							<h2 {...titleProps} className="sr-only">
								{title}
							</h2>
						) : null}
						{children}
					</div>
				</FocusScope>
			</div>
		</OverlayContainer>
	);
}
