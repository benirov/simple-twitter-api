const { ApolloServer, PubSub } = require('apollo-server');
const { MongoClient } = require('mongodb');

//importamos schema
const typeDefs = require('./schemas');

//2. importamos Resolvers
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');

const pubsub = new PubSub();

const resolvers = {
    Query,
    Mutation
}

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, function (err, client) {
    if (err)
        throw err;

    console.log("Connected successfully to MongoDB");

    const db = client.db('simpletwitter');

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: {
            usuarios: db.collection('usuarios'),
            pubsub
        }
    });

    server.listen().then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
});