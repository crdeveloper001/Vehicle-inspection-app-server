import User from "../models/Users.js";
import bcrypt from "bcrypt";

// Create a new profile
export const createProfile = async (req, res) => {
  try {
    const { name, lastName, phone, userType, email, password, IsProfileNew, IsPasswordChanged } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required fields",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create new user
    const newUser = new User({
      name,
      lastName,
      phone,
      userType,
      email,
      password,
      IsProfileNew,
      IsPasswordChanged,
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    newUser.password = hashedPassword;

    const savedUser = await newUser.save();

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating profile",
      error: error.message,
    });
  }
};

// Get all profiles
export const getAllProfiles = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      message: "Profiles retrieved successfully",
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving profiles",
      error: error.message,
    });
  }
};

// Get profile by ID
export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving profile",
      error: error.message,
    });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lastName, phone, userType, email, password, IsProfileNew, IsPasswordChanged } = req.body;

    // Validate MongoDB ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Build update object and validate each field
    const updateData = {};

    if (!name || name === "") {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    updateData.name = name;

    if (!lastName || lastName === "") {
      return res.status(400).json({
        success: false,
        message: "Last name is required",
      });
    }
    updateData.lastName = lastName;

    if (!phone || phone === "") {
      return res.status(400).json({
        success: false,
        message: "Phone is required",
      });
    }
    updateData.phone = phone;

    if (!userType || userType === "") {
      return res.status(400).json({
        success: false,
        message: "User type is required",
      });
    }
    updateData.userType = userType;

    if (!email || email === "") {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    updateData.email = email;

    if (!password || password === "") {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }
    updateData.password = password;

    if (IsProfileNew === undefined) {
      return res.status(400).json({
        success: false,
        message: "IsProfileNew is required",
      });
    }
    updateData.IsProfileNew = IsProfileNew;

    if (IsPasswordChanged === undefined) {
      return res.status(400).json({
        success: false,
        message: "IsPasswordChanged is required",
      });
    }
    updateData.IsPasswordChanged = IsPasswordChanged;

    const hashedPassword = await bcrypt.hash(password, 10);
    updateData.password = hashedPassword;


    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Check if new email already exists (if email is being updated)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use",
        });
      }
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

// Delete profile
export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting profile",
      error: error.message,
    });
  }
};

// Search profiles by name or email
export const searchProfiles = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const results = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Search results retrieved successfully",
      count: results.length,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching profiles",
      error: error.message,
    });
  }
};
