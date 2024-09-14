import { type FileRouter, createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "~/server/auth/auth";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const uploadRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	imageUploader: f({ image: { maxFileSize: "8KB" } })
		// Set permissions and file types for this FileRoute
		.middleware(async ({ req, files }) => {
			// This code runs on your server before upload
			const session = await auth();

			// If you throw, the user will not be able to upload
			if (!session) throw new UploadThingError("Unauthorized");

			// Whatever is returned here is accessible in onUploadComplete as `metadata`
			return { userId: session.user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			// This code RUNS ON YOUR SERVER after upload
			console.log("Upload complete for userId:", metadata.userId);
			console.log("file url", file.url);

			// return to client
			return { uploadedBy: metadata.userId };
		}),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
