const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utlis/sendEmail");
const OTPModel = require("../models/otp");
const httpStatusCode = require("../utlis/httpStatusCode");

class AuthSubEmailController {
  async register(req, res) {
    try {
      const { name, email, phone, password, role } = req.body;
      if (!name || !email || !phone || !password) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "All fields are required",
        });
      }
      const existUser = await User.findOne({ email });
      if (existUser) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "User already exist",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const userdata = new User({
        name,
        email,
        phone,
        password: hashPassword,
        role,
      });
      const user = await userdata.save();
      await sendEmail(req, user);
      if (user) {
        return res.status(httpStatusCode.CREATED).json({
          success: true,
          message: "User created successfully and send Otp to your email",
          data: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async verify(req, res) {
    try {
      const { email, otp } = req.body;

      // validation
      if (!email || !otp) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({
          success: false,
          message: "All fields are required",
        });
      }

      // check user
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }

      // already verified
      if (existingUser.isVerified) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Email already verified",
        });
      }

      // check otp
      const emailVerification = await OTPModel.findOne({
        userId: existingUser._id,
        otp,
      });

      // invalid otp
      if (!emailVerification) {
        await sendEmail(req, existingUser);

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Invalid OTP, new OTP sent to your email",
        });
      }

      // otp expiry check
      const currentTime = new Date();

      const expirationTime = new Date(
        emailVerification.createdAt.getTime() + 15 * 60 * 1000
      );

      // expired otp
      if (currentTime > expirationTime) {
        await sendEmail(req, existingUser);

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "OTP expired, new OTP sent to your email",
        });
      }

      // verify user
      existingUser.isVerified = true;

      await existingUser.save();

      // delete otp
      await OTPModel.deleteMany({
        userId: existingUser._id,
      });

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: "Unable to verify email",
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // validation
      if (!email || !password) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "All fields are required",
        });
      }

      // user check
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "User not found",
        });
      }

      // compare password
      const isMatch = await bcrypt.compare(password, existingUser.password);

      if (!isMatch) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // verified check
      if (!existingUser.isVerified) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "User not verified",
        });
      }

      // generate token
      const token = jwt.sign(
        {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          phone: existingUser.phone,
          role: existingUser.role,
        },

        process.env.JWT_SECRECT,

        {
          expiresIn: "1d",
        }
      );

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "User logged in successfully",

        data: {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          phone: existingUser.phone,
          role: existingUser.role,
        },

        token,
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AuthSubEmailController();
