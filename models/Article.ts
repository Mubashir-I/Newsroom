import { Schema, models, model } from 'mongoose';

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        required: true
    },
    content: {
        type: String,
        required: [true, "Content is required"]
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    coverImage: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        index: true
    },
    tags: {
        type: [String],
        default: []
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Generate slug from title before saving
ArticleSchema.pre('validate', function() {
    if (this.title && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }
});

const Article = models.Article || model("Article", ArticleSchema);
export default Article;
