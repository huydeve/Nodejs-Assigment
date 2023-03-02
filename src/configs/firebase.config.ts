import admin from "firebase-admin"
//@ts-ignore
import serviceAccount from "../../path/to/serviceKey.json"
import multer from "multer";


// Initialize firebase admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'fifa-eea18.appspot.com'
})
// Cloud storage
export const bucket = admin.storage().bucket()


// Multer configuration
const storage = multer.memoryStorage();
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    }
});

export async function uploadImage(file: Express.Multer.File): Promise<string> {
    const { originalname, buffer } = file;
    const fileUpload = bucket.file(originalname);

    const blobStream = fileUpload.createWriteStream({
        metadata: {
            contentType: file.mimetype
        }
    });

    return new Promise((resolve, reject) => {
        blobStream.on('finish', async () => {
            await fileUpload.getSignedUrl({
                action: 'read',
                expires: "12-2-2500"
            }).then((response) => {
                resolve(response.toString());

            })
        }).on('error', (err) => {
            reject(err);
        }).end(buffer);
    });
}

