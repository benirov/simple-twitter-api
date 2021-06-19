const { gql } = require('apollo-server');

const typeDefs  = gql`

    type Usuario {
        _id: String!
        nombre: String!
        usuario: String!
        password: String!
    }

    type Query{
        usuarios: [Usuario]
        usuario(id: Int!): Usuario
    }


    type Mutation{
        addUsuario(nombre: String!, usuario: String!, password: String!): Usuario!
    }
`;

module.exports = typeDefs;