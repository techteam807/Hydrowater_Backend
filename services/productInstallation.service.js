const { default: mongoose } = require("mongoose");
const ProductInstallation = require("../models/productInstallation.model");
const Dealer = require("../models/dealer.model");
const User = require("../models/user.model");
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
  technicianId,
  parentType,
  parentId,
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

    if (technicianId) {
      const tech = await User.findById(technicianId).lean();

      if (parentType && parentId) {
        if (
          !tech ||
          tech.userParentType !== parentType ||
          tech.userParentId.toString() !== parentId
        ) {
          query.technicianId = null; // or skip querying
        } else {
          query.technicianId = technicianId;
        }
      } else {
        query.technicianId = technicianId;
      }
    } else if (parentType && parentId) {
      const tech = await User.findOne({
        userParentType: parentType,
        userParentId: parentId,
      })
        .select("_id")
        .lean();
      if (tech) query.technicianId = tech._id;
      else query.technicianId = null;
    }

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

      // Default
      let type = UserRoleEnum.ADMIN;
      let name = tech?.name || "";
      let companyName = "Hydropod";

      if (tech) {
        const parentType = tech.userParentType;
        const parentId = tech.userParentId;

        if (parentType === UserRoleEnum.DISTRIBUTOR) {
          const distributor = await Distributor.findById(parentId)
            .select("company_name")
            .session(session);
          type = UserRoleEnum.DISTRIBUTOR;
          companyName = distributor?.company_name;
        } else if (parentType === UserRoleEnum.DEALER) {
          const dealer = await Dealer.findById(parentId)
            .select("company_name")
            .session(session);
          type = UserRoleEnum.DEALER;
          companyName = dealer?.company_name;
        }
      }
      item.installationBy = { type, name, companyName };
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
    console.log("err:", error);

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
