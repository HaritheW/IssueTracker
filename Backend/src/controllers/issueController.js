const mongoose = require("mongoose");
const Issue = require("../models/Issue");

const createIssue = async (req, res) => {
    try {
        const { title, description, priority, severity, status } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required." });
        }

        const issue = await Issue.create({
            title,
            description,
            priority,
            severity,
            status,
            createdBy: req.user?.id,
        });

        return res.status(201).json({ issue });
    } catch (error) {
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

const getIssues = async (req, res) => {
    try {
        const { q, status, priority, severity, page = 1, limit = 10 } = req.query;

        const filters = {};
        if (status) filters.status = status;
        if (priority) filters.priority = priority;
        if (severity) filters.severity = severity;
        if (q) {
            filters.$or = [
                { title: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } },
            ];
        }

        const pageNum = Math.max(parseInt(page, 10), 1);
        const limitNum = Math.min(Math.max(parseInt(limit, 10), 1), 100);
        const skip = (pageNum - 1) * limitNum;

        const [issues, total] = await Promise.all([
            Issue.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
            Issue.countDocuments(filters),
        ]);

        return res.status(200).json({
            data: issues,
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

const getIssueById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid issue id." });
        }

        const issue = await Issue.findById(id).populate('createdBy', 'name email');
        if (!issue) {
            return res.status(404).json({ message: "Issue not found." });
        }

        return res.status(200).json({ issue });
    } catch (error) {
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

const updateIssue = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid issue id." });
        }

        const updates = req.body;
        const issue = await Issue.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!issue) {
            return res.status(404).json({ message: "Issue not found." });
        }

        return res.status(200).json({ issue });
    } catch (error) {
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

const deleteIssue = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid issue id." });
        }

        const issue = await Issue.findByIdAndDelete(id);
        if (!issue) {
            return res.status(404).json({ message: "Issue not found." });
        }

        return res.status(200).json({ message: "Issue deleted." });
    } catch (error) {
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

const getIssueStats = async (req, res) => {
    try {
        const stats = await Issue.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const counts = stats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        return res.status(200).json({ counts });
    } catch (error) {
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

const exportIssues = async (req, res) => {
    try {
        const { q, status, priority, severity, format = "json" } = req.query;

        const filters = {};
        if (status) filters.status = status;
        if (priority) filters.priority = priority;
        if (severity) filters.severity = severity;
        if (q) {
            filters.$or = [
                { title: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } },
            ];
        }

        const issues = await Issue.find(filters)
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        if (format.toLowerCase() === "csv") {
            const headers = [
                "title",
                "description",
                "status",
                "priority",
                "severity",
                "createdByName",
                "createdByEmail",
                "createdAt",
                "updatedAt",
            ];

            const escapeCsv = (value) => {
                if (value === null || value === undefined) return "";
                const stringValue = String(value).replace(/"/g, '""');
                return /[",\n]/.test(stringValue) ? `"${stringValue}"` : stringValue;
            };

            const getCreatorName = (createdBy) => {
                if (!createdBy) return "";
                if (typeof createdBy === "object") return createdBy.name || createdBy.email || "";
                return "";
            };
            const getCreatorEmail = (createdBy) => {
                if (!createdBy || typeof createdBy !== "object") return "";
                return createdBy.email || "";
            };

            const rows = issues.map((issue) =>
                [
                    issue.title,
                    issue.description,
                    issue.status,
                    issue.priority,
                    issue.severity,
                    getCreatorName(issue.createdBy),
                    getCreatorEmail(issue.createdBy),
                    issue.createdAt ? issue.createdAt.toISOString() : "",
                    issue.updatedAt ? issue.updatedAt.toISOString() : "",
                ]
                    .map(escapeCsv)
                    .join(",")
            );

            const csv = [headers.join(","), ...rows].join("\n");
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=issues.csv");
            return res.status(200).send(csv);
        }

        return res.status(200).json({ data: issues });
    } catch (error) {
        return res.status(500).json({ message: "Server error.", error: error.message });
    }
};

module.exports = {
    createIssue,
    getIssues,
    getIssueById,
    updateIssue,
    deleteIssue,
    getIssueStats,
    exportIssues,
};
