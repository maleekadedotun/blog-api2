const mongoose = require('mongoose');

// create Schema
const categorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
},
{
    timestamps: true,
}
);

//compile the category model
const Category = mongoose.model("Category", categorySchema);
// export the category model
module.exports = Category;