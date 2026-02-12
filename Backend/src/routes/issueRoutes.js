const express = require("express");
const {
    createIssue,
    getIssues,
    getIssueById,
    updateIssue,
    deleteIssue,
    getIssueStats,
    exportIssues,
} = require("../controllers/issueController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/export", protect, exportIssues);
router.get("/stats", protect, getIssueStats);
router.get("/", protect, getIssues);
router.get("/:id", protect, getIssueById);
router.post("/", protect, createIssue);
router.put("/:id", protect, updateIssue);
router.delete("/:id", protect, deleteIssue);

module.exports = router;
