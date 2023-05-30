import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import * as path from "node:path";

import { isAbsoluteUrl } from "@stefanprobst/is-absolute-url";

export function copyAsset(
	href: unknown,
	vfilePath: string | undefined,
	/**
	 * Next.js image optimizer only treats images in `_next/static/image` as static.
	 * @see https://github.com/vercel/next.js/blob/222830ad479e70009286f101f25d8322b811b17f/packages/next/server/image-optimizer.ts#L116
	 */
	folderName: "asset" | "image" = "image",
):
	| {
			srcFilePath: string;
			destinationFilePath: string;
			publicPath: string;
	  }
	| undefined {
	if (typeof href !== "string" || href.length === 0) return;

	if (href.startsWith("http://")) return;
	if (href.startsWith("https://")) return;
	if (href.startsWith("/")) return;
	if (href.startsWith("#")) return;
	if (href.startsWith("data:")) return;
	if (href.startsWith("blob:")) return;
	if (href.startsWith("mailto:")) return;
	if (isAbsoluteUrl(href)) return;
	if (vfilePath == null) return;

	const srcFilePath = path.join(path.dirname(vfilePath), href);

	function getNewFileName() {
		/** Assets like pdf documents should not have their filename hashed. */
		const shouldHashFileName = folderName === "image";

		if (!shouldHashFileName) {
			return srcFilePath;
		}

		const buffer = readFileSync(srcFilePath, { encoding: "binary" });
		const hash = createHash("md5");
		hash.update(buffer);

		const newFileName = path.join(
			path.dirname(srcFilePath),
			hash.digest("hex").substr(0, 9999) + path.extname(srcFilePath),
		);

		return newFileName;
	}

	const newPath = path.join("static", folderName, path.relative(process.cwd(), getNewFileName()));

	const publicPath = path.posix.join("/_next", newPath.split(path.sep).join(path.posix.sep));
	const destinationFilePath = path.join(process.cwd(), ".next", newPath);

	// TODO: make async
	if (!existsSync(destinationFilePath)) {
		mkdirSync(path.dirname(destinationFilePath), { recursive: true });
		copyFileSync(srcFilePath, destinationFilePath);
	}

	return {
		srcFilePath,
		destinationFilePath,
		publicPath,
	};
}
