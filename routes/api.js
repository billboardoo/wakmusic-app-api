const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./src/database/static.db');
const fs = require('fs');


// 뉴스 목록
router.get('/news', async (req, res) => {
    let start = parseInt(req.query.start);
    if (!start) start = 0;

    await db.all(`SELECT * FROM news ORDER BY time DESC`, (err, rows) => {
        return res.json(rows.slice(start, start + 30));
    });
});

// 아티스트 목록
router.get('/artist/list', async (req, res) => {
    await db.all('SELECT * FROM artists', (err, rows) => {
        return res.json(rows);
    });
});

// 팀 정보
router.get('/teams', async (req, res) => {
    let teams = ['website', 'weekly', 'ios', 'android', 'project_w', 'special', 'news'];
    await db.all('SELECT * FROM teams', (err, rows) => {
        return res.json(rows);
    });
});

router.get('/check-lyrics/:id', (req, res) => {
    fs.readFile(`./src/lyrics/${req.params.id}.vtt`, 'utf8', (err, data) => {
        if (err) return res.json({status: 404});
        return res.json({status: 200});
    });
});

module.exports = router;
