const { gql } = require('apollo-server');

const typeDefs  = gql`
    type User {
        _id: ID
        username: String
    }

    type Post {
        _id: ID
        text: String!
        user: [User!]
        date: String
    }

    input Add {
        username: String
        
    }

    input AddP { 
        text: String
        user: [Add]
        date: String
    }

    type Query{
        users: [User]
        user(id: Int!): User!
        posts: [Post]
    }


    type Mutation{
        addUser(user: Add): User
        addPost(post: AddP): Post!
    }

    type Subscription{
        newPost: Post!
    }
`;

module.exports = typeDefs;