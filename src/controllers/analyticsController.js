const Loan = require("../models/Loan");

// overall stats
exports.getStats = async (req, res) => {
  const totalLoans = await Loan.countDocuments();

  const approved = await Loan.countDocuments({ status: "approved" });
  const rejected = await Loan.countDocuments({ status: "rejected" });

  const fraud = await Loan.countDocuments({ fraudFlag: true });

  res.json({
    totalLoans,
    approved,
    rejected,
    fraud,
  });
};

// loan distribution
exports.loanDistribution = async (req, res) => {
  const result = await Loan.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  res.json(result);
};

// branch analytics
exports.branchStats = async (req, res) => {
  const result = await Loan.aggregate([
    {
      $group: {
        _id: "$branch",
        total: { $sum: 1 },
        fraud: {
          $sum: {
            $cond: ["$fraudFlag", 1, 0],
          },
        },
      },
    },
  ]);

  res.json(result);
};
