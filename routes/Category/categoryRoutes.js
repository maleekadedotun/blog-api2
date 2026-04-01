const express = require("express");
const {createCategoryCtrl, fetchCategoriesCtrl, fetchCategoryCtrl, 
    updateCategoriesCtrl, deleteCategoryCtrl
} = require("../../controllers/category/categoriesCtrl");
const isLoggedIn = require("../../middlewares/isLoggedIn");

const categoryRouter = express.Router()

categoryRouter.post("/", isLoggedIn, createCategoryCtrl)
categoryRouter.get("/", fetchCategoriesCtrl)
categoryRouter.get("/single-category/:id",isLoggedIn, fetchCategoryCtrl)
categoryRouter.put("/update-category/:id",isLoggedIn, updateCategoriesCtrl)
categoryRouter.delete("/delete-category/:id",isLoggedIn, deleteCategoryCtrl)

module.exports = categoryRouter;