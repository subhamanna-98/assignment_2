const httpStatusCode = require("../utlis/httpStatusCode");

class ProtectedController {
  // USER DASHBOARD
  async userDashboard(req, res) {
    try {
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Welcome User Dashboard",

        user: req.user,
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ADMIN DASHBOARD
  async adminDashboard(req, res) {
    try {
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Welcome Admin Dashboard",

        user: req.user,
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async profile(req, res) {
    try {
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "User Profile",
        data: req.user,
      });
    } catch (error) {
      return res.status(httpStatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ProtectedController();
