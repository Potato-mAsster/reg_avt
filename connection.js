const { MongoClient, ServerApiVersion } = require('mongodb');

async function connectToMongoDB() {
    try {
        const uri = "mongodb+srv://ianytlaa:fy4dMt42IWf1VKdk@cluster0.urti4xo.mongodb.net/idk";
        const client = new MongoClient(uri, {
          serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
          }
        });
        await client.connect();
        await client.db("ianytlaa").command({ ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        return uri;
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectToMongoDB;