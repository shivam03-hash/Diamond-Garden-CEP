const express = require("express");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------------
// Middleware
// -------------------------
app.use(cors());
app.use(express.json());

// -------------------------
// PostgreSQL Connection
// -------------------------
const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
});

// -------------------------
// JWT helper
// -------------------------
function createToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

// -------------------------
// Authentication middleware
// -------------------------
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentication required."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired login session."
        });
    }
}

function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            message: "Administrator access required."
        });
    }

    next();
}

// -------------------------
// Serve website files
// -------------------------
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/style.css", (req, res) => {
    res.sendFile(path.join(__dirname, "style.css"));
});

app.get("/script.js", (req, res) => {
    res.sendFile(path.join(__dirname, "script.js"));
});

app.use(
    "/assets",
    express.static(path.join(__dirname, "assets"))
);

// -------------------------
// Health check
// -------------------------
app.get("/api/health", async (req, res) => {
    try {
        await pool.query("SELECT NOW()");

        res.json({
            status: "ok",
            message: "Diamond Garden backend and database are connected."
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: "error",
            message: "Database connection failed."
        });
    }
});

// -------------------------
// USER REGISTER
// -------------------------
app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required."
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters."
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE LOWER(email) = LOWER($1)",
            [cleanEmail]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "This email is already registered."
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const result = await pool.query(
            `INSERT INTO users
            (name, email, password_hash, role)
            VALUES ($1, $2, $3, 'user')
            RETURNING id, name, email, role`,
            [name.trim(), cleanEmail, passwordHash]
        );

        res.status(201).json({
            message: "Registration successful.",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);

        res.status(500).json({
            message: "Registration failed."
        });
    }
});

// -------------------------
// USER LOGIN
// -------------------------
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const result = await pool.query(
            `SELECT id, name, email, password_hash, role
             FROM users
             WHERE LOWER(email) = LOWER($1)
             LIMIT 1`,
            [cleanEmail]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        if (user.role !== "admin") {

    await pool.query(`
        CREATE TABLE IF NOT EXISTS visitor_logs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER,
            user_name VARCHAR(255) NOT NULL,
            user_email VARCHAR(255) NOT NULL,
            visited_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await pool.query(
        `INSERT INTO visitor_logs
         (user_id, user_name, user_email)
         VALUES ($1, $2, $3)`,
        [
            user.id,
            user.name,
            user.email
        ]
    );
}
        
        

        const token = createToken(user);

        res.json({
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("USER LOGIN ERROR:", error);

        res.status(500).json({
            message: "Login failed."
        });
    }
});

// -------------------------
// ADMIN LOGIN
// -------------------------
app.post("/api/auth/admin-login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Admin email and password are required."
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const result = await pool.query(
            `SELECT id, name, email, password_hash, role
             FROM users
             WHERE LOWER(email) = LOWER($1)
             AND role = 'admin'
             LIMIT 1`,
            [cleanEmail]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid administrator credentials."
            });
        }

        const admin = result.rows[0];

        const passwordMatch = await bcrypt.compare(
            password,
            admin.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid administrator credentials."
            });
        }

                // -------------------------
        // RECORD WEBSITE VISIT
        // -------------------------

        const token = createToken(admin);

        res.json({
            message: "Administrator login successful.",
            token,
            user: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.error("ADMIN LOGIN ERROR:", error);

        res.status(500).json({
            message: "Administrator login failed."
        });
    }
});

// -------------------------
// CHECK CURRENT USER
// -------------------------
app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, role
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.json({
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to fetch user information."
        });
    }
});

// -------------------------
// GARDEN TIMINGS - PUBLIC
// -------------------------
app.get("/api/timings", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                morning_open,
                morning_close,
                evening_open,
                evening_close
             FROM site_settings
             WHERE id = 1`
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Garden timings not found."
            });
        }

        res.json({
            timings: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to fetch garden timings."
        });
    }
});

// -------------------------
// GARDEN TIMINGS - ADMIN ONLY
// -------------------------
app.put(
    "/api/timings",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const {
                morning_open,
                morning_close,
                evening_open,
                evening_close
            } = req.body;

            if (
                !morning_open ||
                !morning_close ||
                !evening_open ||
                !evening_close
            ) {
                return res.status(400).json({
                    message: "All timing fields are required."
                });
            }

            const result = await pool.query(
                `UPDATE site_settings
                 SET
                    morning_open = $1::time,
                    morning_close = $2::time,
                    evening_open = $3::time,
                    evening_close = $4::time
                 WHERE id = 1
                 RETURNING
                    morning_open,
                    morning_close,
                    evening_open,
                    evening_close`,
                [
                    morning_open,
                    morning_close,
                    evening_open,
                    evening_close
                ]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: "Garden timing record was not found."
                });
            }

            return res.json({
                message: "Garden timings updated successfully.",
                timings: result.rows[0]
            });

        } catch (error) {
            console.error("TIMING UPDATE ERROR:", error);

            return res.status(500).json({
                message: "Unable to update garden timings.",
                error: error.message
            });
        }
    }
);

// -------------------------
// FACILITIES - PUBLIC
// -------------------------
app.get("/api/facilities", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                name,
                category,
                description,
                image,
                status,
                research_basis,
                what_to_observe,
                field_survey
             FROM facilities
             ORDER BY id`
        );

        res.json({
            facilities: result.rows
        });

    } catch (error) {
        console.error("FACILITIES FETCH ERROR:", error);

        res.status(500).json({
            message: "Unable to fetch facilities."
        });
    }
});


// -------------------------
// FACILITIES - ADMIN UPDATE
// -------------------------
app.put(
    "/api/facilities/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const facilityId = Number(req.params.id);

            if (!Number.isInteger(facilityId)) {
                return res.status(400).json({
                    message: "Invalid facility ID."
                });
            }

            const {
                name,
                category,
                description,
                image,
                status,
                research_basis,
                what_to_observe,
                field_survey
            } = req.body;

            if (
                !name ||
                !category ||
                !description ||
                !image ||
                !status ||
                !research_basis ||
                !what_to_observe ||
                !field_survey
            ) {
                return res.status(400).json({
                    message: "All facility fields are required."
                });
            }

            const result = await pool.query(
                `UPDATE facilities
                 SET
                    name = $1,
                    category = $2,
                    description = $3,
                    image = $4,
                    status = $5,
                    research_basis = $6,
                    what_to_observe = $7,
                    field_survey = $8,
                    updated_at = CURRENT_TIMESTAMP
                 WHERE id = $9
                 RETURNING
                    id,
                    name,
                    category,
                    description,
                    image,
                    status,
                    research_basis,
                    what_to_observe,
                    field_survey`,
                [
                    name.trim(),
                    category.trim(),
                    description.trim(),
                    image.trim(),
                    status.trim(),
                    research_basis.trim(),
                    what_to_observe.trim(),
                    field_survey.trim(),
                    facilityId
                ]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: "Facility not found."
                });
            }

            res.json({
                message: "Facility updated successfully.",
                facility: result.rows[0]
            });

        } catch (error) {
            console.error("FACILITY UPDATE ERROR:", error);

            res.status(500).json({
                message: "Unable to update facility.",
                error: error.message
            });
        }
    }
);

// -------------------------
// ISSUES - PUBLIC
// -------------------------
app.get("/api/issues", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                title,
                description,
                status,
                created_at,
                updated_at
             FROM issues
             ORDER BY id`
        );

        res.json({
            issues: result.rows
        });

    } catch (error) {
        console.error("ISSUES FETCH ERROR:", error);

        res.status(500).json({
            message: "Unable to fetch issues."
        });
    }
});


// -------------------------
// ISSUES - ADMIN UPDATE
// -------------------------
app.put(
    "/api/issues/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const issueId = Number(req.params.id);

            if (!Number.isInteger(issueId)) {
                return res.status(400).json({
                    message: "Invalid issue ID."
                });
            }

            const {
                title,
                description,
                status
            } = req.body;

            if (
                !title ||
                !description ||
                !status
            ) {
                return res.status(400).json({
                    message: "All issue fields are required."
                });
            }

            const result = await pool.query(
                `UPDATE issues
                 SET
                    title = $1,
                    description = $2,
                    status = $3,
                    updated_at = CURRENT_TIMESTAMP
                 WHERE id = $4
                 RETURNING
                    id,
                    title,
                    description,
                    status,
                    updated_at`,
                [
                    title.trim(),
                    description.trim(),
                    status.trim(),
                    issueId
                ]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: "Issue not found."
                });
            }

            res.json({
                message: "Issue updated successfully.",
                issue: result.rows[0]
            });

        } catch (error) {
            console.error("ISSUE UPDATE ERROR:", error);

            res.status(500).json({
                message: "Unable to update issue.",
                error: error.message
            });
        }
    }
);

// -------------------------
// VISITORS - ADMIN ONLY
// -------------------------
app.get(
    "/api/admin/visitors",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {

            // Total unique people
            const totalVisitorsResult = await pool.query(`
                SELECT COUNT(DISTINCT user_id)::int AS total_visitors
                FROM visitor_logs
                WHERE user_id IS NOT NULL
            `);

            // Total number of recorded visits
            const totalVisitsResult = await pool.query(`
                SELECT COUNT(*)::int AS total_visits
                FROM visitor_logs
            `);

            // Visitor summary
            const visitorsResult = await pool.query(`
                SELECT
                    user_id,
                    user_name,
                    user_email,
                    COUNT(*)::int AS total_visits,
                    MAX(visited_at) AS last_visit
                FROM visitor_logs
                WHERE user_id IS NOT NULL
                GROUP BY
                    user_id,
                    user_name,
                    user_email
                ORDER BY last_visit DESC
            `);

            return res.json({
                totalVisitors:
                    totalVisitorsResult.rows[0].total_visitors,

                totalVisits:
                    totalVisitsResult.rows[0].total_visits,

                visitors: visitorsResult.rows
            });

        } catch (error) {

            console.error(
                "VISITOR FETCH ERROR:",
                error
            );

            return res.status(500).json({
                message: "Unable to fetch visitor data.",
                error: error.message
            });
        }
    }
);

// -------------------------
// ADMIN TEST ROUTE
// -------------------------
app.get(
    "/api/admin/dashboard",
    authenticateToken,
    requireAdmin,
    (req, res) => {
        res.json({
            message: "Welcome to the Administrator Dashboard.",
            admin: req.user
        });
    }
);

// -------------------------
// Create default admin
// -------------------------
async function createDefaultAdmin() {
    try {
        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminName = process.env.ADMIN_NAME || "Website Administrator";

        if (!adminEmail || !adminPassword) {
            console.log(
                "ADMIN_EMAIL / ADMIN_PASSWORD not set. Default admin was not created."
            );
            return;
        }

        const existingAdmin = await pool.query(
            `SELECT id
             FROM users
             WHERE role = 'admin'
             LIMIT 1`
        );

        if (existingAdmin.rows.length > 0) {
            console.log("Administrator account already exists.");
            return;
        }

        const passwordHash = await bcrypt.hash(adminPassword, 12);

        await pool.query(
            `INSERT INTO users
            (name, email, password_hash, role)
            VALUES ($1, $2, $3, 'admin')`,
            [
                adminName,
                adminEmail,
                passwordHash
            ]
        );

        console.log("Default administrator account created.");
    } catch (error) {
        console.error("ADMIN CREATION ERROR:", error);
    }
}

// -------------------------
// Start server
// -------------------------
async function startServer() {
    try {
        await pool.query("SELECT NOW()");
        console.log("PostgreSQL connection successful.");

        await createDefaultAdmin();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Diamond Garden server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("SERVER START ERROR:", error);
        process.exit(1);
    }
}

startServer();