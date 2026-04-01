const Category = require("../../model/Category/category")
const { appErr } = require("../../utils/appErr")

// create
const createCategoryCtrl = async (req, res, next) => {
    const { title } = req.body
    try {
        const categoryExists = await Category.findOne({ title })
        if (categoryExists) {
            return next(appErr("Category already exists"))
        }
        const createCategory = await Category.create({ title, user: req.userAuth })
        res.json({
            status: "Success",
            data: createCategory
        })
    } catch (error) {
        next(appErr(error.message))
    }
}

// fetch all categories
const fetchCategoriesCtrl = async (req, res, next) => {
    try {
        const categories = await Category.find()
        res.json({
            status: "Success",
            data: categories,
        })
    } catch (error) {
        next(appErr(error.message))
    }
}

// single category
const fetchCategoryCtrl = async (req, res, next) => {
    console.log(req.userAuth, "Single");

    try {
        const category = await Category.findById(req.params.id)
        res.json({
            status: "Success",
            data: category,
        })
    } catch (error) {
        next(appErr(error.message))
    }
}
// update categories
const updateCategoriesCtrl = async (req, res, next) => {
    const { title } = req.body
    try {
        // const categories = await Category.find()
        const categoryExists = await Category.findOne({ title });
        if (categoryExists) {
            return next(appErr("Category already exists"));
        }
        // if (!categoryExists) {
        //     return next(appErr("Category not found"));
        // }
        const categoryUpdate = await Category.findByIdAndUpdate(req.params.id, {
            title
        },
            {
                new: true
            }
        )
        res.json({
            status: "Success",
            data: categoryUpdate,
        })
    } catch (error) {
        next(appErr(error.message))
    }
}
const deleteCategoryCtrl = async (req, res, next) => {
    try {
        const categoryDelete = await Category.findByIdAndDelete(req.params.id);
        res.json({
            status: "Success",
            data: "Category deleted successfully",
        })
    } catch (error) {
        return next(appErr(error.message))
    }
}


module.exports = {
    createCategoryCtrl,
    fetchCategoriesCtrl,
    fetchCategoryCtrl,
    updateCategoriesCtrl,
    deleteCategoryCtrl,
}