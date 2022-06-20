const { ApolloServer, PubSub } = require('apollo-server');
const { createServer } =  require('http');
const { MongoClient } = require('mongodb');
global.pubsub = pubsub = new PubSub();
//importamos schema
const typeDefs = require('./schemas');

const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const NEW_POST = 'NEW_POST';
//2. importamos Resolvers
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const resolvers = {
    Query,
    Mutation,
    Subscription: {
        newPost: {
            subscribe: () => pubsub.asyncIterator([NEW_POST])
        }
    }
}

let urlmongo = process.env.URLMONGO || 'mongodb://localhost:27017'
MongoClient.connect(urlmongo, { useNewUrlParser: true }, function (err, client) {
    if (err)
        throw err;

    const db = client.db('simpletwitter');

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        uploads: false,
        context: {
            User: db.collection('User'),
            Post: db.collection('Post'),
            pubsub
        }
    });

    const WS_PORT = process.env.WS_PORT || 3200;

    // Create WebSocket listener server
    const websocketServer = createServer((request, response) => {
        response.writeHead(404);
        response.end();
    });

    // Bind it to port and start listening
        websocketServer.listen(WS_PORT, () => console.log(
            `Websocket Server is now running on http://localhost:${WS_PORT}`
        ));
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const subscriptionServer = SubscriptionServer.create(
        {
            schema,
            execute,
            subscribe,
        },
        {
            server: websocketServer,
            path: '/subscriptions',
        },
    );

    

    server.listen().then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
});