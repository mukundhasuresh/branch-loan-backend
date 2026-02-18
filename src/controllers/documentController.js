const Document = require("../models/Document");

// upload
exports.uploadDoc = async (req, res) => {
  const { type } = req.body;

  const doc = await Document.create({
    user: req.user._id,
    type,
    fileUrl: req.file.path,
  });

  res.json(doc);
};

// manager verification
exports.verifyDoc = async (req, res) => {
  const doc = await Document.findById(req.params.id);

  doc.status = "verified";
  doc.reviewedBy = req.user._id;

  await doc.save();

  res.json(doc);
};

// admin reject
exports.rejectDoc = async (req, res) => {
  const doc = await Document.findById(req.params.id);

  doc.status = "rejected";
  doc.reviewedBy = req.user._id;

  await doc.save();

  res.json(doc);
};

// get user docs
exports.getDocs = async (req, res) => {
  const docs = await Document.find({ user: req.user._id });
  res.json(docs);
};
