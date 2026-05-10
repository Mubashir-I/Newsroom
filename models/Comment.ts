import { Schema, models, model } from 'mongoose';

const CommentSchema = new Schema({
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: [true, "Comment content cannot be empty"],
        trim: true
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    }
}, { timestamps: true });

const Comment = models.Comment || model("Comment", CommentSchema);
export default Comment;
