const { ApolloServer, PubSub } = require('apollo-server');
const { MongoClient } = require('mongodb');
require('events').EventEmitter.prototype._maxListeners = 100;
global.pubsub  = new PubSub();
//importamos schema
const typeDefs = require('./schemas');

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
            subscribe: () => global.pubsub.asyncIterator([NEW_POST])
        }
    }
}

let urlmongo = process.env.URLMONGO || 'mongodb://localhost:27017'
MongoClient.connect(urlmongo, { useNewUrlParser: true }, function (err, client) {
    if (err)
        throw err;

    const corsOptions = {
        origin: 'https://bucolic-swan-ec550d.netlify.app',
        credentials: true
    }

    const db = client.db('simpletwitter');
    let pub = global.pubsub;
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        uploads: false,
        context: {
            User: db.collection('User'),
            Post: db.collection('Post'),
            pub
        },
        subscriptions: {
            onConnect: (connectionParams, webSocket) => {
                console.log(connectionParams, webSocket)
            },
        },
        playground: true,
        introspection: true,
        cors: cors(corsOptions),
    });
    
    //const WS_PORT = process.env.WS_PORT || 3200;

    // Create WebSocket listener server
  

    // Bind it to port and start listening
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    

    

    server.listen(process.env.PORT || 5000).then(({ url, subscriptionsUrl }) => {
        console.log(`🚀 Server ready at ${url}`)
        console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)

      })
});