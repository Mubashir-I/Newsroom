/**
 * Cloudinary Upload Utility
 * This handles uploading images to Cloudinary and returning the secure URL.
 */

export const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    
    // For unsigned uploads, you need an upload preset. 
    // If you're using signed uploads, you'd need a server-side signature.
    // Assuming the user might want a simple approach:
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "newsroom_uploads");
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    
    if (!cloudName) {
        throw new Error("Cloudinary Cloud Name is not configured");
    }

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to upload image");
        }

        const data = await response.json();
        return data.secure_url; // This is the URL we save in the database
    } catch (error: any) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};
