const { ObjectId } = require('mongodb');

const usuarios = async (parent, args, { usuarios }) => {
    console.log("Usuarios", usuarios);
    return await usuarios.find({}).toArray();
}

const usuario = async (parent, args, { usuarios }) => {
    return await usuarios.findOne({_id: ObjectId(args.id)});
}

module.exports = {
    usuarios,
    usuario
}