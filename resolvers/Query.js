const { ObjectId } = require('mongodb');

const users = async (parent, args, { User }) => {
    const co =  await User.find({}).toArray();
    return co;
}

const user = async (parent, args, { User }) => {
    return await User.findOne({_id: ObjectId(args.id)});
}

const posts = async (parent, args, { Post }) => {
    return await Post.find({}).toArray();
}

module.exports = {
    users,
    user,
    posts
}