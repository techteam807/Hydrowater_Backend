const { default: mongoose } = require("mongoose");
const ProductInstallation = require("../models/productInstallation.model");
const { getISTDate } = require("../utils/date");

const registerProductInstallation = async (data) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const installation = new ProductInstallation(data);
    installation.installation_date = getISTDate();
    await installation.save({ session });

    await session.commitTransaction();
    session.endSession();

    return installation;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const listProductInstallations = async (filter = {}) => {
  return ProductInstallation.find(filter)
    .populate("technicianId", "name email")
    .sort({ createdAt: -1 })
    .lean();
};

const approveInstallation = async (installationId, approvalData) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const installation = await ProductInstallation.findById(
      installationId
    ).session(session);
    if (!installation) {
      throw new Error("Installation not found");
    }

    if(installation.isApproved){
      throw new Error("Installation is already approved");
    }

    installation.isApproved = true;
    installation.approval_date = getISTDate();
    installation.approval_notes = approvalData.approval_notes || "";
    await installation.save({ session });

    await session.commitTransaction();
    session.endSession();
    return installation;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = {
  registerProductInstallation,
  listProductInstallations,
  approveInstallation,
};
