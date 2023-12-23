const {
  Permission,
  AdminGroup,
} = require("../../modules/user/schema/sqlModels");

const isAllowedToAccess = async (admin_group_id, endPointName) => {
  const permissions = await Permission.findAll({
    include: [
      {
        model: AdminGroup,
        where: { id: admin_group_id },
        attributes: [], // to exclude AdminGroup fields from the result, leave the array empty
        through: { attributes: [] }, // to exclude join table fields from the result
      },
    ],
    attributes: ["name"],
    raw: true,
  });

  return permissions.find((ele) => ele.name == endPointName);
};

module.exports = isAllowedToAccess;
