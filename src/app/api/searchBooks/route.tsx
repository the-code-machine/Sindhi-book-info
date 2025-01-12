import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://sarthakkhare123:sarthak123@cluster0.vefvk2f.mongodb.net/";
const dbName = "test";

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
    if (!cachedClient) {
        const client = new MongoClient(uri);
        await client.connect();
        cachedClient = client;
    }
    return { client: cachedClient, db: cachedClient.db(dbName) };
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';

    if (!query) {
        return NextResponse.json({ message: 'Query parameter is required' }, { status: 400 });
    }

    try {
        const { db } = await connectToDatabase();
        const booksCollection = db.collection('books');

        // Fetch top 10 matching books
        const books = await booksCollection
            .find({
                $or: [
                    { "Title of the book": { $regex: query, $options: "i" } },
                    { "Title of the book Devnagiri": { $regex: query, $options: "i" } },
                    { "Author Name": { $regex: query, $options: "i" } },
                    { "Location of the Collection/Library/Institution": { $regex: query, $options: "i" } }
                ]
            })
            .limit(10) // Limit to top 10 matches
            .toArray();

        return NextResponse.json({ books });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
