const { ObjectId } = require('mongodb');

const addUsuario = async (parent, args, { Usuarios }) => {
    let result = await Usuarios.insertOne(args);
    return result.ops[0];
}

module.exports = {
    addUsuario
}