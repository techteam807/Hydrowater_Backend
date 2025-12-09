const { default: mongoose } = require("mongoose");
const ProductInstallation = require("../models/productInstallation.model");
const Dealer = require("../models/dealer.model");
const Distributor = require("../models/distributor.model");
const { getISTDate } = require("../utils/date");
const { UserRoleEnum } = require("../utils/global");

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

const listProductInstallations = async ({
  search = "",
  state,
  page = 1,
  limit = 10,
  isApproved,
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { mobile_number: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { productCode: { $regex: search, $options: "i" } },
        { "address.city": { $regex: search, $options: "i" } },
        { "address.pincode": { $regex: search, $options: "i" } },
      ];
    }

    if (state) query["address.state"] = { $in: state };

    if (isApproved) query.isApproved = isApproved;

    const skip = (page - 1) * limit;

    const installations = await ProductInstallation.find(query)
      .populate("technicianId", "name email userParentType  userParentId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .session(session);

    for (const item of installations) {
      const tech = item?.technicianId;

      if (!tech) {
        item.installationBy = { type: "Unknown Technician" };
        continue;
      }

      const parentType = tech.userParentType;
      const parentId = tech.userParentId;

      // Default Hydropod
      let type = "Hydropod Technician";
      let name = tech.name || "";
      let companyName = "Hydropod";

      // If DISTRIBUTOR
      if (parentType === UserRoleEnum.DISTRIBUTOR) {
        const distributor = await Distributor.findById(parentId)
          .select("name company_name")
          .session(session);

        type = "Distributor";
        companyName = distributor?.company_name || "Hydropod";
      }

      // If DEALER
      else if (parentType === UserRoleEnum.DEALER) {
        const dealer = await Dealer.findById(parentId)
          .select("name company_name")
          .session(session);

        type = "Dealer";
        companyName = dealer?.company_name || "Hydropod";
      }

      // If ADMIN → tech stays Hydropod
      else if (parentType === UserRoleEnum.ADMIN) {
        type = "Hydropod Technician";
        companyName = "Hydropod";
      }

      // Assign final output
      item.installationBy = {
        type,
        name,
        companyName,
      };
    }

    const total = await ProductInstallation.countDocuments(query).session(
      session
    );

    await session.commitTransaction();
    session.endSession();
    return {
      data: installations,
      pagination: {
        total,
        page: Number(page),
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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

    if (installation.isApproved) {
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