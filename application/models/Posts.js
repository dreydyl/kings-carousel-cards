var db = require('../config/database');
const PostModel = {};

PostModel.create = (title, description, photoPath, thumbnail, userId) => {
    let baseSql = 'INSERT INTO posts (title, description, photopath, thumbnail, created, userid) \
    VALUE (?, ?, ?, ?, now(), ?);';
    return db.execute(baseSql, [title, description, photoPath, thumbnail, userId])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch((err) => Promise.reject(err));
};

PostModel.search = (searchTerm) => {
    let baseSql = "SELECT id, title, description, thumbnail, concat_ws(' ', title, description) AS haystack \
    FROM posts \
    HAVING haystack like ?;";

    let sqlReadySearchTerm = "%" + searchTerm + "%";

    return db.execute(baseSql, [sqlReadySearchTerm])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch((err) => Promise.reject(err));
};

PostModel.getNRecentPosts = (numberOfPosts) => {
    let baseSql = `SELECT id, title, description, thumbnail, created \
    FROM posts ORDER BY created DESC LIMIT ${numberOfPosts}`;
    return db.execute(baseSql, [])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch((err) => Promise.reject(err));
};

PostModel.getPostById = (postId) => {
    let baseSql = `SELECT u.username, p.title, p.description, p.photopath, p.created
    FROM users u
    JOIN posts p
    ON u.id=userid
    WHERE p.id=?;`;

    return db.execute(baseSql, [postId])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch((err) => Promise.reject(err));
}

module.exports = PostModel;