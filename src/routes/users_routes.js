const { Router } = require("express");
const pool = require("../config/db");

const router = Router();

router.post("/", async (req, res) => {
    const { name, lastname, email } = req.body || {};
    if (!name || !lastname || !email) return res.status(400).json({ error: "Dados obrigatorios" });

    try {
        const [result] = await pool.execute(
            "INSERT INTO user (user_name, user_lastname, user_email) VALUES (?, ?, ?)",
            [name, lastname, email]
        );
        res.status(201).json({ id: result.insertId, name, lastname, email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao criar usuario" });
    }
});

router.get("/", async (_req, res) => {
    try {
        const [rows] = await pool.execute(
            "SELECT id, user_name AS name, user_lastname AS lastname, user_email AS email FROM user"
        );
        res.json(rows); // Retorna com chaves name/lastname/email
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao listar usuarios" });
    }
});

router.get("/:id", async (req, res) => {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: "Id invalido" });

    try {
        const [rows] = await pool.execute(
            "SELECT id, user_name AS name, user_lastname AS lastname, user_email AS email FROM user WHERE id = ?",
            [id]
        );
        if (!rows.length) return res.status(404).json({ error: "Nao encontrado" });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar usuario" });
    }
});

router.put("/:id", async (req, res) => {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: "Id invalido" });

    const { name, lastname, email } = req.body || {};
    if (!name || !lastname || !email) return res.status(400).json({ error: "Dados obrigatorios" });

    try {
        const [result] = await pool.execute(
            "UPDATE user SET user_name = ?, user_lastname = ?, user_email = ? WHERE id = ?",
            [name, lastname, email, id]
        );
        if (!result.affectedRows) return res.status(404).json({ error: "Nao encontrado" });
        res.json({ id, name, lastname, email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao atualizar usuario" });
    }
});

router.delete("/:id", async (req, res) => {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: "Id invalido" });

    try {
        const [result] = await pool.execute("DELETE FROM user WHERE id = ?", [id]);
        if (!result.affectedRows) return res.status(404).json({ error: "Nao encontrado" });
        res.json({ message: "Removido" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao remover usuario" });
    }
});

module.exports = router;
