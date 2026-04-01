const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./routes/User/userRoute");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const isAdmin = require("./middlewares/isAdmin");
const postRouter = require("./routes/Post/postRoute");
const categoryRouter = require("./routes/Category/categoryRoutes");
dotenv.config()
require("./config/dbConnect");

const app = express();
app.use(express.json());

// middleware
// const auth = {
//     isLoggedIn: true,
//     isFinite: false
// }
// app.use((req, res, next) => {
//     if(auth.isLoggedIn){
//      next()
//     }
//     else{
//         res.json({
//             status: "Failed",
//             message: "Invalid login credentials"
//         })
//     }
// });
// app.use(isAdmin)
// routes
// user routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/categories", categoryRouter);

// Error Handler middleware
app.use(globalErrorHandler);

// 404 error
app.use((req, res) => {
    // console.log(req.originalUrl);
    
    res.status(404).json({
        status: "Failed",
        message: `${req.originalUrl} - Route not found`
    });     
});

app.delete("/api/v1/users/delete/:id", async(req, res) => {
    try {
        res.json({
            status: "Success",
            data: "User delete route"
        })
    } catch (error) {
        res.json(error.message);
        
    }
});

// PUT/api/v1/users/update
app.put("/api/v1/users/update/:id", async(req, res) => {
    try {
        res.json({
            status: "Success",
            data: "User Updated route"
        })
    } catch (error) {
        res.json(error.message);
        
    }
})
// post routes
// comment routes
// category routes
// Error handler middleware
// listen to server
const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`)
)