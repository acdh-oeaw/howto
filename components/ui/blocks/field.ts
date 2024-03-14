import type { ReactNode } from "react";
import type { ValidationResult as AriaValidationResult } from "react-aria-components";

export interface FieldProps {
	label?: ReactNode;
	description?: ReactNode;
	errorMessage?: ReactNode | ((validation: AriaValidationResult) => ReactNode);
}
