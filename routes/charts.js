const express = require('express');
const router = express.Router();
const qs = require('querystring');
const SQL = require('../modules/SQL')
const fs = require("fs");
const db = new SQL();
const subtitle = require('node-webvtt');


async function gather(raw) {
    let data = [];
    for (const d of raw) {
        await db.get(`SELECT * FROM total WHERE id = "${d.id}"`).then((resolve) => {
            if (resolve) {
                let result = {
                    "id": resolve.id,
                    "title": resolve.title,
                    "artist": resolve.artist,
                    "remix": resolve.remix,
                    "reaction": resolve.reaction,
                    "date": resolve.date,
                    "views": d.increase,
                    "last": d.last
                }
                data.push(result)
            }
        })
    }
    return data;
}

function convertDate(day) {
    let month = day.getMonth() + 1;
    let date = day.getDate();
    return `${day.getFullYear()}${month < 10 ? '0' + month : month}${date < 10 ? '0' + date : date}`.slice(2)
}

router.get('/lyrics-all', (req, res) => {
    fs.readdir('./src/lyrics', async (err, files) => {
        await db.all('SELECT id, title, artist, date FROM total ORDER BY date DESC').then((resolve) => {
            let data = [];
            for (let i = 0; i < resolve.length; i++) {
                if (!files.includes(resolve[i].id + '.vtt')) {
                    data.push(resolve[i])
                }
            }
            return res.json(data);
        });
    });
});

router.get('/lyrics/:id', (req, res) => {
    fs.readFile(`./src/lyrics/${req.params.id}.vtt`, 'utf8', (err, data) => {
        if (err) return res.json({status: 404});
        const parsed = subtitle.parse(data, {strict: false});
        return res.json(parsed.cues);
    });
});

// 누적차트
router.get('/charts/total', async (req, res) => {
    let limit = parseInt(req.query.limit);
    if (!limit) limit = 10;

    try {
        await db.all('SELECT * FROM total ORDER BY views DESC').then((resolve) => {
            return res.json(resolve.slice(0, limit));
        })
    } catch (err) {
        return res.sendStatus(404);
    }
});

// 차트(누적 제외)
router.get('/charts/:type', async (req, res) => {
    let allowed = ["monthly", "weekly", "daily", "hourly"];
    let type = allowed.includes(req.params.type) ? req.params.type : allowed[0];
    let limit = parseInt(req.query.limit);
    if (!limit) limit = 10;

    try {
        let raw;
        await db.all(`SELECT * FROM ${type} ORDER BY increase DESC`).then(async (resolve) => {
            raw = resolve.slice(0, limit);
            return res.json(await gather(raw));
        })
    } catch (err) {
        return res.sendStatus(404);
    }
});

// 업데이트 시간
router.get('/updated', async (req, res) => {
    try {
        await db.get(`SELECT * FROM updated`).then((resolve) => {
            return res.json(resolve.time);
        })
    } catch (err) {
        return res.sendStatus(404);
    }
});

// 검색
router.get('/search', async (req, res) => {
    let allowed = ["title", "artist", "remix", "ids"];
    let type = allowed.includes(req.query.type) ? req.query.type : allowed[0];
    let keyword = qs.unescape(req.query.keyword);

    let sort = req.query.sort;
    if (sort === "new") sort = 'date DESC';
    else if (sort === "old") sort = 'date ASC';
    else sort = 'views DESC';

    try {
        if (type !== "ids") {
            await db.all(`SELECT * FROM total WHERE ${type} LIKE "%${keyword}%" ORDER BY ${sort}`).then((resolve) => {
                return res.json(resolve)
            });
        } else {
            let ids = keyword.split(',');
            let result = [];
            for (const id of ids) {
                await db.get(`SELECT * FROM total WHERE id = ?`, [id]).then((resolve) => {
                    if (resolve) result.push(resolve);
                })
            }
            return res.json(result);
        }
    } catch (err) {
        return res.sendStatus(404);
    }
});

// 이달의 신곡(웹에서 안씀, 모바일 전용)
router.get('/new/monthly', async (req, res) => {
    let now = new Date();
    let month = now.getMonth() + 1;
    let startStr = `${now.getFullYear()}${month < 10 ? '0' + month : month}00`.slice(2);
    let todayStr = convertDate(now);

    try {
        await db.all(`SELECT * FROM total WHERE date >= "${startStr}" AND date <= "${todayStr}"`).then((resolve) => {
            return res.json(resolve)
        });
    } catch (err) {
        return res.sendStatus(404);
    }
})

// 월별, 연도별 신곡
router.get('/list/:type', async (req, res) => {
    let type = req.params.type;

    let sql;
    if (type === "month") {
        let month = parseInt(req.query.period) ? req.query.period.slice(2) : "2201";
        sql = `date >= "${month}00" AND date <= "${month}32"`;
    } else {
        let year = parseInt(req.query.period) ? req.query.period.slice(2) : "22";
        sql = `date >= "${year}0100" AND date <= "${year}1232"`;
    }

    let start = parseInt(req.query.start);
    if (!start) start = 0;

    try {
        await db.all(`SELECT * FROM total WHERE ${sql} ORDER BY date DESC`).then((resolve) => {
            return res.json(resolve.slice(start, start + 30))
        });
    } catch (err) {
        return res.sendStatus(404);
    }
})

// 아티스트 노래 목록
router.get('/artist/albums/:artist', async (req, res) => {
    let artist = req.params.artist;

    let start = parseInt(req.query.start);
    if (!start) start = 0;

    let sort = req.query.sort;
    if (sort === "new") sort = 'date DESC';
    else if (sort === "old") sort = 'date ASC';
    else sort = 'views DESC';

    try {
        let data;
        await db.get(`SELECT * FROM artists WHERE artist = ?`, [artist]).then((resolve) => {
            data = resolve["ids"].split(",");
        });

        await db.all(`SELECT * FROM total WHERE id IN ("${data.join('","')}") ORDER BY ${sort}`).then((resolve) => {
            return res.json(resolve.slice(start, start + 30))
        });
    } catch (err) {
        return res.sendStatus(404);
    }
})

module.exports = router;