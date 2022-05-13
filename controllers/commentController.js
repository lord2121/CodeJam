const commentModel = require('../models/commentModel.js');
const productModel = require('../models/productModel.js');

module.exports.postComment = async (req, res) => {
    const product = await productModel.findById(req.params.id);
    const newComment = new commentModel({ text: req.body.comment });
    product.comments.push(newComment);
    await product.save();
    await newComment.save();
    res.redirect("/product/" + product._id);
};

module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    await productModel.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    res.redirect(`/product/${id}`);
};