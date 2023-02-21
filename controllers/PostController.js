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
    const postId = req.params.id

    PostModel.findOneAndUpdate({
      _id: postId
    }, {
      $inc: { viewsCount: 1 },  //increase view counter
    }, {
      returnDocument: 'after'
    },
      (error, data) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: `Failed to get the post`,
            error
          })
        }

        if (!data) {
          return res.status(404).json({
            success: false,
            message: `The post not found`
          })
        }

        res.status(200).json(data)
      }
    )
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to get the post`,
      error
    })
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id

    PostModel.findOneAndDelete({
      _id: postId,
    },
      (error, data) => {

        if (error) {
          return res.status(500).json({
            success: false,
            message: 'Failed to remove the post.',
            error
          })
        }

        if (!data) {
          return res.status(404).json({
            success: false,
            message: 'The post not found.'
          })
        }

        res.status(200).json({
          success: true,
        })
      })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove post.',
      error
    })
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id

    await PostModel.updateOne({
      _id: postId,
    },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        author: req.userId,
      })

    res.status(200).json({
      success: true
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update post.',
      error
    })
  }
}

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate({ path: 'author', select: ['fullName', '_id'] }).exec()

    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to get posts.`,
      error
    })
  }
}
