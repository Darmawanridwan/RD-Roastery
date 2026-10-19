const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;


// ==================================================
// MIDDLEWARE
// ==================================================


const path = require("path");

// ==================================================
// MIDDLEWARE
// ==================================================

app.use(cors());
app.use(express.json());

// Melayani file dari folder Public
app.use(express.static(path.join(__dirname, "Public")));


// ==================================================
// DATABASE
// ==================================================
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


// ==================================================
// HOME
// ==================================================

app.get("/", (req, res) => {

    res.json({
        message: "RD Roastery API is running!",
        status: "OK"
    });

});


// ==================================================
// TEST DATABASE
// ==================================================

app.get("/test-db", async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT 1 AS result"
        );

        res.json({
            message: "Database connected!",
            data: rows
        });

    } catch (error) {

        console.error(
            "Database Error:",
            error.message
        );

        res.status(500).json({
            message: "Database connection failed",
            error: error.message
        });

    }

});


// ==================================================
// GET ALL PRODUCTS
// ==================================================

app.get("/api/products", async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT * FROM products ORDER BY id DESC"
        );

        res.json({
            message: "Products retrieved successfully",
            data: rows
        });

    } catch (error) {

        console.error(
            "Products Error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to retrieve products",
            error: error.message
        });

    }

});


// ==================================================
// GET PRODUCT BY ID
// ==================================================

app.get("/api/products/:id", async (req, res) => {

    try {

        const id = req.params.id;

        const [rows] = await db.query(
            "SELECT * FROM products WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                message: "Product not found"
            });

        }

        res.json({
            message: "Product retrieved successfully",
            data: rows[0]
        });

    } catch (error) {

        console.error(
            "Product Detail Error:",
            error.message
        );

        res.status(500).json({
            message: "Failed to retrieve product",
            error: error.message
        });

    }

});


// ==================================================
// CREATE PRODUCT
// ==================================================

app.post("/api/products", async (req, res) => {

    try {

        const {
            name,
            category,
            origin,
            region,
            processing,
            roast_level,
            brewing_method,
            tasting_notes,
            acidity,
            body,
            sweetness,
            weight,
            price,
            availability,
            image
        } = req.body;


        if (!name) {

            return res.status(400).json({
                message: "Product name is required."
            });

        }


        const [result] = await db.query(

            `INSERT INTO products
            (
                name,
                category,
                origin,
                region,
                processing,
                roast_level,
                brewing_method,
                tasting_notes,
                acidity,
                body,
                sweetness,
                weight,
                price,
                availability,
                image
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

            ,

            [
                name,
                category || null,
                origin || null,
                region || null,
                processing || null,
                roast_level || null,
                brewing_method || null,
                tasting_notes || null,
                acidity || null,
                body || null,
                sweetness || null,
                weight || null,
                price || null,
                availability !== undefined
                    ? availability
                    : true,
                image || null
            ]

        );


        res.status(201).json({

            message:
                "Product created successfully.",

            product_id:
                result.insertId

        });


    } catch (error) {

        console.error(
            "Create Product Error:",
            error.message
        );

        res.status(500).json({

            message:
                "Failed to create product.",

            error:
                error.message

        });

    }

});


// ==================================================
// UPDATE PRODUCT
// ==================================================

app.put("/api/products/:id", async (req, res) => {

    try {

        const id = req.params.id;

        const {
            name,
            category,
            origin,
            region,
            processing,
            roast_level,
            brewing_method,
            tasting_notes,
            acidity,
            body,
            sweetness,
            weight,
            price,
            availability,
            image
        } = req.body;


        if (!name) {

            return res.status(400).json({

                message:
                    "Product name is required."

            });

        }


        const [result] = await db.query(

            `UPDATE products
             SET
                name = ?,
                category = ?,
                origin = ?,
                region = ?,
                processing = ?,
                roast_level = ?,
                brewing_method = ?,
                tasting_notes = ?,
                acidity = ?,
                body = ?,
                sweetness = ?,
                weight = ?,
                price = ?,
                availability = ?,
                image = ?
             WHERE id = ?`

            ,

            [
                name,
                category || null,
                origin || null,
                region || null,
                processing || null,
                roast_level || null,
                brewing_method || null,
                tasting_notes || null,
                acidity || null,
                body || null,
                sweetness || null,
                weight || null,
                price || null,
                availability !== undefined
                    ? availability
                    : true,
                image || null,
                id
            ]

        );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                message:
                    "Product not found."

            });

        }


        res.json({

            message:
                "Product updated successfully.",

            product_id:
                id

        });


    } catch (error) {

        console.error(
            "Update Product Error:",
            error.message
        );

        res.status(500).json({

            message:
                "Failed to update product.",

            error:
                error.message

        });

    }

});


// ==================================================
// DELETE PRODUCT
// ==================================================

app.delete("/api/products/:id", async (req, res) => {

    try {

        const id = req.params.id;


        const [result] = await db.query(

            "DELETE FROM products WHERE id = ?",

            [id]

        );


        if (result.affectedRows === 0) {

            return res.status(404).json({

                message:
                    "Product not found."

            });

        }


        res.json({

            message:
                "Product deleted successfully.",

            product_id:
                id

        });


    } catch (error) {

        console.error(
            "Delete Product Error:",
            error.message
        );

        res.status(500).json({

            message:
                "Failed to delete product.",

            error:
                error.message

        });

    }

});


// ==================================================
// CREATE CUSTOM PROFILE REQUEST
// ==================================================

app.post("/api/custom-requests", async (req, res) => {

    let connection;

    try {

        const {
            business_name,
            business_type,
            pic_name,
            whatsapp,
            email,
            bean_preference,
            brewing_method,
            roast_level,
            taste_profile,
            acidity,
            body,
            sweetness,
            estimated_quantity,
            additional_notes
        } = req.body;


        // ------------------------------------------
        // VALIDASI
        // ------------------------------------------

        if (
            !business_name ||
            !pic_name ||
            !whatsapp
        ) {

            return res.status(400).json({

                message:
                    "Business name, PIC name, and WhatsApp are required."

            });

        }


        if (
            estimated_quantity !== null &&
            estimated_quantity !== undefined &&
            estimated_quantity !== "" &&
            Number(estimated_quantity) < 1
        ) {

            return res.status(400).json({

                message:
                    "Estimated monthly requirement must be at least 1 Kg."

            });

        }


        // ------------------------------------------
        // GET CONNECTION
        // ------------------------------------------

        connection =
            await db.getConnection();


        // ------------------------------------------
        // START TRANSACTION
        // ------------------------------------------

        await connection.beginTransaction();


        // ------------------------------------------
        // INSERT BUSINESS
        // ------------------------------------------

        const [businessResult] =
            await connection.query(

                `INSERT INTO business
                (
                    business_name,
                    business_type,
                    pic_name,
                    whatsapp,
                    email
                )
                VALUES (?, ?, ?, ?, ?)`

                ,

                [
                    business_name.trim(),
                    business_type || null,
                    pic_name.trim(),
                    whatsapp.trim(),
                    email
                        ? email.trim()
                        : null
                ]

            );


        const businessId =
            businessResult.insertId;


        // ------------------------------------------
        // INSERT CUSTOM REQUEST
        // ------------------------------------------

        const [requestResult] =
            await connection.query(

                `INSERT INTO custom_request
                (
                    business_id,
                    bean_preference,
                    brewing_method,
                    roast_level,
                    taste_profile,
                    acidity,
                    body,
                    sweetness,
                    estimated_quantity,
                    additional_notes,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

                ,

                [
                    businessId,
                    bean_preference || null,
                    brewing_method || null,
                    roast_level || null,
                    taste_profile || null,
                    acidity || null,
                    body || null,
                    sweetness || null,
                    estimated_quantity
                        ? Number(estimated_quantity)
                        : null,
                    additional_notes || null,
                    "New"
                ]

            );


        // ------------------------------------------
        // COMMIT
        // ------------------------------------------

        await connection.commit();


        // ------------------------------------------
        // SUCCESS RESPONSE
        // ------------------------------------------

        res.status(201).json({

            message:
                "Custom profile request submitted successfully.",

            request_id:
                requestResult.insertId,

            business_id:
                businessId

        });


    } catch (error) {

        // ------------------------------------------
        // ROLLBACK
        // ------------------------------------------

        if (connection) {

            try {

                await connection.rollback();

            } catch (rollbackError) {

                console.error(
                    "Rollback Error:",
                    rollbackError.message
                );

            }

        }


        console.error(
            "Custom Request Error:",
            error.message
        );


        res.status(500).json({

            message:
                "Failed to submit custom profile request.",

            error:
                error.message

        });


    } finally {

        if (connection) {

            connection.release();

        }

    }

});


// ==================================================
// ADMIN LOGIN
// ==================================================

app.post("/api/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        if (!email || !password) {

            return res.status(400).json({

                message:
                    "Email dan password wajib diisi."

            });

        }


        const [rows] = await db.query(

            `SELECT
                admin_id,
                name,
                email
             FROM admin_user
             WHERE email = ?
             AND password = ?`

            ,

            [
                email,
                password
            ]

        );


        if (rows.length === 0) {

            return res.status(401).json({

                message:
                    "Email atau password salah."

            });

        }


        res.json({

            message:
                "Login berhasil",

            admin:
                rows[0]

        });


    } catch (error) {

        console.error(
            "Login Error:",
            error.message
        );

        res.status(500).json({

            message:
                "Login gagal",

            error:
                error.message

        });

    }

});


// ==================================================
// GET ALL CUSTOM REQUESTS
// ==================================================

app.get("/api/custom-requests", async (req, res) => {

    try {

        const [rows] = await db.query(`

            SELECT

                cr.request_id,

                cr.bean_preference,

                cr.brewing_method,

                cr.roast_level,

                cr.taste_profile,

                cr.acidity,

                cr.body,

                cr.sweetness,

                cr.estimated_quantity,

                cr.additional_notes,

                cr.status,

                cr.created_at,

                b.business_name,

                b.business_type,

                b.pic_name,

                b.whatsapp,

                b.email

            FROM custom_request cr

            INNER JOIN business b
                ON cr.business_id = b.business_id

            ORDER BY cr.request_id DESC

        `);


        res.json({

            message:
                "Custom requests retrieved successfully",

            data:
                rows

        });


    } catch (error) {

        console.error(
            "Custom Requests Error:",
            error.message
        );

        res.status(500).json({

            message:
                "Failed to retrieve custom requests",

            error:
                error.message

        });

    }

});


// ==================================================
// UPDATE CUSTOM REQUEST STATUS
// ==================================================

app.put(
    "/api/custom-requests/:id/status",
    async (req, res) => {

        try {

            const id =
                req.params.id;

            const {
                status
            } = req.body;


            const allowedStatuses = [

                "New",

                "In Progress",

                "Sample Roasting",

                "Completed",

                "Cancelled"

            ];


            if (
                !status ||
                !allowedStatuses.includes(status)
            ) {

                return res.status(400).json({

                    message:
                        "Invalid status."

                });

            }


            const [result] =
                await db.query(

                    `UPDATE custom_request
                     SET status = ?
                     WHERE request_id = ?`,

                    [
                        status,
                        id
                    ]

                );


            if (
                result.affectedRows === 0
            ) {

                return res.status(404).json({

                    message:
                        "Custom request not found."

                });

            }


            res.json({

                message:
                    "Status updated successfully.",

                request_id:
                    id,

                status:
                    status

            });


        } catch (error) {

            console.error(
                "Update Status Error:",
                error.message
            );

            res.status(500).json({

                message:
                    "Failed to update status.",

                error:
                    error.message

            });

        }

    }
);


// ==================================================
// 404 HANDLER
// ==================================================

app.use((req, res) => {

    res.status(404).json({

        message:
            "Endpoint not found",

        path:
            req.originalUrl

    });

});


// ==================================================
// START SERVER
// ==================================================

app.listen(PORT, "0.0.0.0", () => {
    console.log(`RD Roastery API running on port ${PORT}`);
});

    console.log(
        `RD Roastery API running at http://localhost:${PORT}`
    );