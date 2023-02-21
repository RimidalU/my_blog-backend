import PostModel from '../models/Post.js'

export const create = async (req, res) => {
  try {
    const newPost = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      author: req.userId,
    })

    const post = await newPost.save()
    res.status(200).json(post)

  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to create post.`,
      error
    })
  }
}

export const getOne = async (req, res) => {
  try {

  } catch (error) {

  }
}

export const remove = async (req, res) => {
  try {

  } catch (error) {

  }
}

export const update = async (req, res) => {
  try {

  } catch (error) {

  }
}

export const getAll = async (req, res) => {
  try {

  } catch (error) {

  }
}
