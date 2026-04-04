// dotenv configuration
require("dotenv").config()

// const { parsing } = require("../envparser.js") // if not using dotenv

// start handling with firebase
const { initializeApp } = require("firebase/app");
const {
    getFirestore,
    doc,
    setDoc,
    collection,
    getDocs,
    query,
    deleteDoc,
    updateDoc,
    deleteField
} = require("firebase/firestore");

let firestoreDB, app;

// Configuration & Initialize Firebase
const initializeFirebaseApp = (firebaseConfig) => {
    try {
        app = initializeApp(firebaseConfig);
        firestoreDB = getFirestore(app);
        return app;
    } catch (error) {
        console.log(error, "firebase-initializeFirebaseApp");
        throw error;
    }
};

// configuration
const configuration = async () => {
    // const keys = await parsing('.env')
    try {
        const firebaseConfig = {
            apiKey:process.env.apiKey,
            authDomain:process.env.authDomain,
            projectId: process.env.projectId,
            storageBucket:process.env.storageBucket,
            messagingSenderId:process.env.messagingSenderId,
            appId:process.env.appId
        };

        initializeFirebaseApp(firebaseConfig);
    } catch (error) {
        throw error;
    }
};

// Create & Update Document
const uploadProcessData = async (
    dataToUpload = {},
    collectionName,
    documentId
) => {
    try {
        const id =
            documentId || doc(collection(firestoreDB, "_"), undefined).id;

        const document = doc(firestoreDB, collectionName, id);

        let dataUploaded = await setDoc(document, dataToUpload);

        return;
    } catch (error) {
        console.log(error, "firebase-uploadProcessedData");
    }
};

// Get Firebase App
const getFirebaseApp = () => app;

// Read the docs of a collection
const GetData = async (collectionName) => {
    try {
        const collectionRef = collection(firestoreDB, collectionName);
        const finalData = [];

        const q = query(collectionRef);

        const docSnap = await getDocs(q);

        docSnap.forEach((doc) => {
            finalData.push(doc.data());
        });

        return finalData;
    } catch (error) {
        throw error;
    }
};

// Delete Doc
const deleteDocument = async (collectionName, documentId) => {
    try {
        if (!firestoreDB) {
            console.error(
                "Firestore DB not initialized. Call initializeFirebaseApp first."
            );
            return false;
        }

        const docRef = doc(firestoreDB, collectionName, documentId);

        await deleteDoc(docRef);

        console.log(
            `Document with ID '${documentId}' successfully deleted from collection '${collectionName}'.`
        );

        return true;
    } catch (error) {
        console.error(
            `Error deleting document '${documentId}' from collection '${collectionName}':`,
            error
        );

        return false;
    }
};

// Delete Field
const delField = async (collectionName, documentId, fieldToDelete) => {
    try {
        if (!firestoreDB) {
            console.error("FirestoreDB haven't been initialized yet");
            return;
        } else {
            try {
                const docRef = doc(firestoreDB, collectionName, documentId);

                await updateDoc(docRef, {
                    [fieldToDelete]: deleteField()
                });

                return "Deleted";
            } catch (error) {
                console.log("Couldn't remove field:", error);
                return;
            }
        }
    } catch (error) {
        throw error;
    }
};

// EXPORTS
module.exports = {
    configuration,
    uploadProcessData,
    getFirebaseApp,
    GetData,
    deleteDocument,
    delField
};