import { Children, isValidElement, type ReactNode } from "react";

export function getChildrenElements(children: ReactNode) {
	return Children.toArray(children).filter(isValidElement);
}
