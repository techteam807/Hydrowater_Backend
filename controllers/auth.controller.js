const { successResponse, errorResponse } = require("../utils/response");
const authService = require("../services/auth.service");

const adminLogin = async (req, res) => {
    try {
        const {email, password } = req.body;
        const user = await authService.loginAdmin(email, password);
        return successResponse(res, user, "Admin Login successfully", 200);
    } catch (error) {
        return errorResponse(res, error.message || "Error While Login As Admin", 500);
    }
};

const technicianLogin = async (req, res) => {
    try {
        const { mobile_number, name } = req.body;
        const user = await authService.loginTechnician(mobile_number, name);
        return successResponse(res, null, "OTP sent to your mobile", 200);
    } catch (error) {
        return errorResponse(res, error.message || "Error While Login As Technician", 500);
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { name, mobile_number, otp } = req.body;
        const user = await authService.verifyOtp(name, mobile_number, otp);
        return successResponse(res, user, "Technician Login successfully", 200);
    } catch (error) {
        return errorResponse(res, error.message || "Error While Login As Technician", 500);
    }
};

module.exports = {adminLogin, technicianLogin, verifyOtp}