import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { errorMiddleware } from "./middleware/errorMiddleware.js";
import {
  UserSinup,
  Userlogin,
  usergetbyid,
} from "./controller/usercontroller.js";
import {
  VendorSignup,
  VendorLogin,
  getAllVendors
} from "./controller/vendorcontroller.js";
import { 
  getUserProfile,
  updateUserProfile,
  saveVendor,
  unsaveVendor, 
  getSavedVendors,
  updateUserAvatar,
  deleteUserAvatar
} from "./controller/userProfileController.js";

import { getVendorProfile, updateVendorProfile } from "./controller/vendorProfileController.js";
import { createProduct, getVendorProducts, updateProduct, deleteProduct, getAllProducts } from "./controller/productcontroller.js";
import { isAuthenticatedUser, isAuthenticatedVendor, isAuthenticated } from "./middleware/auth.js";
import { getMessages, getChatThreads } from "./controller/messageController.js";
import { upload } from "./middleware/upload.js";
import { getRecommendations } from "./controller/mlController.js";
import { likeProduct, addComment, incrementView } from "./controller/productEngagementController.js";
import { getTrendingProducts, getVendorRecommendations, getVendorInsights } from "./controller/analyticsController.js";




const app = express();
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// CORS
const corOption = {
  origin:
    process.env.CORS_ORIGIN?.split(", ").map((origin) => origin.trim()) || [],
  methods: "GET,POST,PUT,PATCH,DELETE",
  credentials: true,
};

app.use(cors(corOption));

// middleware
app.use(express.json());
app.use(cookieParser());

// Request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// routes
app.route("/usersignup").post(UserSinup);
app.route("/userlogin").post(Userlogin);
app.route("/getuser").get(usergetbyid);

// User Profile Routes
app.route("/me").get(isAuthenticatedUser, getUserProfile);
app.route("/me/update").put(isAuthenticatedUser, updateUserProfile);
app.route("/me/avatar")
  .put(isAuthenticatedUser, upload.single("avatar"), updateUserAvatar)
  .delete(isAuthenticatedUser, deleteUserAvatar);
app.route("/save-vendor/:vendorId").post(isAuthenticatedUser, saveVendor);
app.route("/unsave-vendor/:vendorId").delete(isAuthenticatedUser, unsaveVendor);
app.route("/saved-vendors").get(isAuthenticatedUser, getSavedVendors);


// Vendor Auth Routes
app.route("/vendorsignup").post(VendorSignup);
app.route("/vendorlogin").post(VendorLogin);

// Vendor Profile Routes
app.route("/vendor/me").get(isAuthenticatedVendor, getVendorProfile);
app.route("/vendor/me/update").put(isAuthenticatedVendor, updateVendorProfile);
app.route("/vendors").get(getAllVendors);

// Product Routes
app.route("/product/upload").post(isAuthenticatedVendor, upload.single("file"), createProduct);
app.route("/vendor/posts").get(isAuthenticatedVendor, getVendorProducts);
app.route("/product/:id")
  .put(isAuthenticatedVendor, upload.single("file"), updateProduct)
  .delete(isAuthenticatedVendor, deleteProduct);
app.route("/products").get(getAllProducts);

// Product Engagement Routes
app.route("/product/like/:id").post(isAuthenticatedUser, likeProduct);
app.route("/product/comment/:id").post(isAuthenticatedUser, addComment);
app.route("/product/view/:id").patch(incrementView);

// Chat Routes
app.route("/chat/threads").get(isAuthenticated, getChatThreads);
app.route("/chat/messages/:otherId").get(isAuthenticated, getMessages);

// ML/Intelligence & Analytics Routes
app.route("/recommendations").get(getRecommendations);
app.route("/analytics/trending").get(getTrendingProducts);
app.route("/analytics/recommendations").get(isAuthenticatedVendor, getVendorRecommendations);
app.route("/analytics/insights").get(isAuthenticatedVendor, getVendorInsights);

// error middleware

app.use(errorMiddleware);

export default app;
