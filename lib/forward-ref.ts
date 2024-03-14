import {
	type ForwardedRef,
	forwardRef as f,
	type ReactNode,
	type Ref,
	type RefAttributes,
} from "react";

/**
 * @see https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/utils.tsx
 */

// eslint-disable-next-line @typescript-eslint/ban-types
declare function forwardRefWithGenerics<T, P = {}>(
	render: (props: P, ref: Ref<T>) => ReactNode,
): (props: P & RefAttributes<T>) => ReactNode;

export const forwardRef = f as typeof forwardRefWithGenerics;

export type { ForwardedRef };
