import { Button, Card, Layout, Page, TextField, DropZone, Thumbnail, LegacyCard, InlineStack, LegacyStack } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import {
    json, unstable_parseMultipartFormData, unstable_createFileUploadHandler
} from "@remix-run/node";
import fs from "fs";
import path from "path";
import { useLoaderData, Form, useActionData, useSubmit } from "@remix-run/react";
import { useEffect, useState, useCallback } from "react";
import { image } from "remix-utils/responses";



export const loader = async ({ request, params }) => {
    const { admin, session } = await authenticate.admin(request);
    const { id } = params;
    const productId = `gid://shopify/Product/${id}`;

    // const product = await admin.rest.resources.Product.find({
    //     session: session,
    //     id: `${id}`,
    // });

    // return json({
    //     product
    // });
    return null;
}

export const action = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);

    try {
        // Define the upload directory (public/images)
        // const uploadDir = path.join(process.cwd(), "public", "images");
        // console.log("uploadDir: ", uploadDir);

        // // Ensure the upload directory exists, create if it doesn't
        // if (!fs.existsSync(uploadDir)) {
        //     fs.mkdirSync(uploadDir, { recursive: true });
        // }

        // // Create a file upload handler that stores files in the specified directory
        // const uploadHandler = unstable_createFileUploadHandler({
        //     directory: uploadDir,
        //     file: ({ filename }) => filename, // Customize filename if needed
        // });

        // // Parse the multipart form data using the created upload handler
        // const formData = await unstable_parseMultipartFormData(request, uploadHandler);

        // // Get the uploaded file from the form data
        // const file = formData.get("image");
        // // console.log("file: ", file);

        // // Check if the file was successfully uploaded
        // if (!file) {
        //     throw new Error("No file uploaded. Please select an image.");
        // }

        const formData = await request.formData();
        const file = formData.get("image");
        

        const uploadedImage = await file.arrayBuffer();
        const base64Image = Buffer.from(uploadedImage).toString("base64");
        // console.log("base64Image: ----------------", base64Image);

        const image = new admin.rest.resources.Image({ session: session });

        image.product_id = 8605358489857;
        image.position = 1;
        image.attachment = base64Image;
        image.filename = file.name;

        await image.save({
            update: true,
        });


        console.log("response-----------------: ", image);


        // Return a success message with file details
        return json({ success: `Image uploaded successfully as ${file.name}!` });
    } catch (error) {
        // Handle errors and send an error response
        return json({ error: error.message }, { status: 400 });
    }

    return null;
    // save image to shopify
}

export default function ProductsDetails() {
    const submit = useSubmit();
    const loaderData = useLoaderData();
    const [product, setProduct] = useState(null);
    const actionData = useActionData();
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    const [files, setFiles] = useState([]);
    const [uploadableFile, setUploadableFile] = useState(null);

    // loader effect
    useEffect(() => {
        if (loaderData?.product) {
            setProduct(loaderData.product);
        }

    }, [loaderData]);

    // action effect
    useEffect(() => {
        console.log("actionData: ", actionData);
    }, [actionData]);


    const handleDropZoneDrop = (files) => {
        setUploadableFile(files);
        const file = files[0];
        if (validImageTypes.includes(file.type)) {
            setFiles([{ image: URL.createObjectURL(file) }]);
        } else {
            console.log("Invalid file type");
        }

        const formData = new FormData();
        formData.append("image", file);
        submit(formData, {
            method: "POST",
            encType: "multipart/form-data",
        })
    }

    const handleImageUpload = async () => {
        const formData = new FormData();
        formData.append("image", uploadableFile[0]);
        submit(formData, {
            method: "POST",
            encType: "multipart/form-data",
        })
    }

    const uploadedFileUi =
        <InlineStack align="center" blockAlign="center">
            <Thumbnail
                size="large"
                source={files[0]?.image}
                alt="Product Image"
            />
        </InlineStack>



    return (
        <Page title="Product Details"
            primaryAction={{
                content: "Save",
                onAction: handleImageUpload
            }}
        >
            <Layout>
                <Layout.Section>
                    <Card>
                        <Thumbnail
                            size="large"
                            source={files[0]?.image}
                            alt="Product Image"
                        />
                    </Card>
                    <Card>
                        <DropZone type="image" accept="image/png,image/jpg,image/jpeg" allowMultiple={false} onDrop={handleDropZoneDrop}>
                            <LegacyStack vertical>
                                {uploadedFileUi}
                            </LegacyStack>
                        </DropZone>
                    </Card>

                </Layout.Section>
            </Layout>
        </Page>
    )
}

export function ErrorBoundary({ error }) {
    return (
        <div className="error-container">
            <h1>App Error</h1>
        </div>
    );
}
