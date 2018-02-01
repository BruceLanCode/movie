const Comment = require('../models/comment');

exports.save = async (ctx, next) => {
    let _comment = ctx.request.body.comment;
    let movieId = _comment.movie;

    if (_comment.cid) {
        try {
            let comment = await Comment.findById(_comment.cid);
            let reply = {
                from: _comment.from,
                to: _comment.tid,
                content: _comment.content
            }

            comment.reply.push(reply);

            await comment.save();
            ctx.redirect('/movie/' + movieId);
        } catch (err) {
            console.log(err)
        }
    }
    else {
        let comment = new Comment(_comment);

        try {
            await comment.save();
            ctx.redirect('/movie/' + movieId);
        }catch (err) {
            console.log(err);
        }
    }
}