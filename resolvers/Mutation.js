const { ObjectId } = require('mongodb');
const addUser = async (parent, args, { User }) => {
    console.log('args.user', args.user);
    let result = await User.insertOne(args.user);
    return result.ops[0];
}

const addPost = async (parent, args, { Post }) => {
    args.post["date"] = new Date(Date.now()).toUTCString();
    let result = await Post.insertOne(args.post);
    pubsub.publish('NEW_POST', { newPost:result.ops[0]});
    return result.ops[0];
}

module.exports = {
    addUser,
    addPost
}