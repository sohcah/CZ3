import { MongoClient } from "mongodb";
import config from "./config";

const uri = config.mongoURI;
// Create a new MongoClient
const mongo = new MongoClient(uri);

mongo.connect()
export default () => mongo.db(config.mongoDB);


export type Counter = any;
