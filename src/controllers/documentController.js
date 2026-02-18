const Document = require("../models/Document");
const { logAction } = require("../services/auditService"); // ✅ NEW

// upload
exports.uploadDoc = async (req, res) => {
  try {
    const { type } = req.body;

    const doc = await Document.create({
      user: req.user._id,
      type,
      fileUrl: req.file.path,
    });

    // ✅ audit log
    await logAction({
      user: req.user._id,
      action: "UPLOAD_DOCUMENT",
      entity: "Document",
      entityId: doc._id,
      branch: req.user.branch,
    });

    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// manager verification
exports.verifyDoc = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    doc.status = "verified";
    doc.reviewedBy = req.user._id;

    await doc.save();

    // ✅ audit log
    await logAction({
      user: req.user._id,
      action: "VERIFY_DOCUMENT",
      entity: "Document",
      entityId: doc._id,
      branch: req.user.branch,
    });

    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// admin reject
exports.rejectDoc = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    doc.status = "rejected";
    doc.reviewedBy = req.user._id;

    await doc.save();

    // ✅ audit log
    await logAction({
      user: req.user._id,
      action: "REJECT_DOCUMENT",
      entity: "Document",
      entityId: doc._id,
      branch: req.user.branch,
    });

    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get user docs
exports.getDocs = async (req, res) => {
  try {
    const docs = await Document.find({ user: req.user._id });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
