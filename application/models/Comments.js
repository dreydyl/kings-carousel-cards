var db = require('../config/database');
const CommentModel = {};

CommentModel.create = (userId, postId, comment) => {
    let baseSql = `INSERT INTO comments (comment, authorid, postid) VALUES (?, ?, ?);`;
    return db.query(baseSql, [comment, userId, postId])
        .then(([results, fields]) => {
            if (results && results.affectedRows) {
                return Promise.resolve(results.insertId);
            } else {
                return Promise.resolve(-1);
            }
        })
        .catch((err) => Promise.reject(err));
}

CommentModel.getCommentsForPostId = (postId) => {
    let baseSql = `SELECT u.username, c.comment, c.id, c.created
    FROM comments c
    JOIN users u
    ON u.id=authorid
    WHERE c.postid=?
    ORDER BY c.created DESC`;

    return db.query(baseSql, [postId])
    .then(([results, fields]) => {
        return Promise.resolve(results);
    })
    .catch((err) => Promise.reject(err));
}

module.exports = CommentModel;