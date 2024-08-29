import { PostModel } from "../models/post.model.js";
import ApiResponse from "../utils/ApiResponse.utils.js";
import AsyncHandler from "../utils/AsyncHandler.utils.js";
import uploadOnCloudinary from "../utils/Cloudinary.utils.js";
import { LikedPostModel } from '../models/likedpost.model.js'
import { CommentModel } from "../models/comment.model.js";

const addPost = AsyncHandler(async (req, res) => {
    const {caption, tags, location} = req.body;
    const userId = req.user._id;
    const photo = await uploadOnCloudinary(req.file.path);
    console.log(photo);
    
    const post = await PostModel.create({
        user: userId,
        caption,
        tags,
        location,
        photo: photo.url
    })
    if (!post){
        return res.status(500)
        .json(new ApiResponse(500, "Error in creating post", {}))
    }
    return res.status(200)
        .json(new ApiResponse(200, "Successfully created", post))
})

 const getAllPosts = AsyncHandler(async (req, res)=> {
    const {page=1, limit=5} = req.params
    const user = req.user._id
    console.log("All Posts Api hited");  // for debugging purposes
    const posts = await PostModel.find({})
        .populate('user', 'username')
        .sort({ createdAt: -1 }) // Sort by date in descending order
        .skip((page - 1) * limit) // Skip the documents for previous pages
        .limit(limit) // Limit the number of documents to 'limit'
        .lean()

    if(!posts){
        return res.status(404)
        .json(new ApiResponse(404, "No posts found", {}))
    }

    // posts.forEach(async (post) =>{
    //     console.log("inside post");
        
    //     const isLiked = await LikedPostModel.findOne({userId:user, postId: post._id});
    //     post.like = isLiked?true:false;
    // })

    const updatedPosts = await Promise.all(posts.map(async (post) => {   
        const totalLike = await LikedPostModel.find({postId: post._id})
        const isLiked = await LikedPostModel.findOne({ userId: user, postId: post._id });
        post.like = isLiked ? true : false;
        post.totalLikes = totalLike.length;
        return post; // Return the updated post
    }));

    return res.status(200)
       .json(new ApiResponse(200, "Posts fetched successfully", updatedPosts))    
 })

 const likePost = AsyncHandler(async (req, res)=>{    
    const {postId} = req.body
    const userId = req.user._id;
    
    const post = await PostModel.findById(postId);
    if(!post){
        return res.status(404)
       .json(new ApiResponse(404, "Post not found", {}))
    }

    const like = await LikedPostModel.findOne({ userId, postId });
    if(like){
        await LikedPostModel.deleteOne({userId, postId});
    } else {
        await LikedPostModel.create({ userId, postId });
    }

    return res.status(200)
       .json(new ApiResponse(200, "Post liked/unliked successfully", {}))
 })


 const postDetails = AsyncHandler(async (req, res)=> {
    console.log("In post details");
    
    const {postId} = req.query
    console.log(postId);
    
    const user = req.user._id
    const post = await PostModel.findById(postId)
       .populate('user', 'username')
       .lean()

    if(!post){
        return res.status(404)
       .json(new ApiResponse(404, "Post not found", {}))
    }

    const totalLike = await LikedPostModel.find({postId: post._id})
    const isLiked = await LikedPostModel.findOne({ userId: user, postId: post._id });
    post.like = isLiked?true:false;
    post.totalLikes = totalLike.length;

    // const totalComments = await CommentModel.find({postId: postId}).populate('userId username')
    // post.comments = totalComments

    return res.status(200)
       .json(new ApiResponse(200, "Post fetched successfully", post))
 })

 const getComments = AsyncHandler(async (req, res) => {
    
    const { postId, page=1, limit=10 } = req.query
    const comments = await CommentModel.find({ postId })
       .populate('userId', 'username profile.avatar')
       .skip((page - 1) * limit) // Skip the documents for previous pages
       .limit(limit) // Limit the number of documents to 'limit'       .lean()

    if (!comments) {
        return res.status(404)
           .json(new ApiResponse(404, "Comments not found", {}))
    }

    return res.status(200)
       .json(new ApiResponse(200, "Comments fetched successfully", comments))
 })

 const addComment = AsyncHandler(async (req, res)=> {
    const { comment } = req.body
    const { postId } = req.query
    const userId = req.user._id

    const newComment = await CommentModel.create({
        postId,
        userId,
        content:comment,
    })

    if (!newComment) {
        return res.status(500)
           .json(new ApiResponse(500, "Error in creating comment", {}))
    }

    return res.status(200)
       .json(new ApiResponse(200, "Comment added successfully", newComment))
 })

export {
    addPost,
    getAllPosts,
    likePost,
    postDetails,
    getComments,
    addComment
}