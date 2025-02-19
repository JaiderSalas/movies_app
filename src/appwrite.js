import { Client, Databases,ID, Query } from "appwrite";

const PROJECT_ID = "67b64d84002fe1a46a69"
const DATABASE_ID = "67b64dd500210f577f77";
const COLLECTION_ID = "67b64de00013e22e20f2";

const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject(PROJECT_ID);

const database = new Databases(client)

export const updatebuscador = async (buscartitulo, movie) => {
    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('buscartitulo', buscartitulo)
        ]);
        if(result.documents.length > 0){
            const doc = result.documents[0];
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id,{
                contador: doc.contador + 1
            });
        } else{
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                buscartitulo,
                contador: 1,
                movie_id : movie.id,
                poster_url : `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });
        }
    } catch (error) {
        console.error(error)
    }
}

export const getPopular = async () => {
    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('contador')
        ]);
        return result.documents;
    } catch (error) {
        console.error(error)
    }
}