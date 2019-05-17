const fetch = require("node-fetch");
const path = require('path');
const fs = require('fs');

const _BASE_URL_USERS = "https://reqres.in/api/users/";
const _IMAGE_STORAGE_PATH = "./cache/images";

function handleUserById(id) {
    let promise = new Promise((resolve, reject) => {
        fetch(_BASE_URL_USERS + id).then(res => res.json()).then(json => resolve(json)).catch(e => {
            console.error(e);
            reject();
        });
    });
    return promise;
}

function handleImageRequest(id) {
    let promise = new Promise((resolve, reject) => {
        let filePath = path.join(_IMAGE_STORAGE_PATH, id) + ".jpg";
        if (fs.existsSync(filePath)) {
            resolve(filePath);
        }
        fetch(_BASE_URL_USERS + id).then(res => res.json()).then(json => {
            let avatarUrl = json.data.avatar;
            fetch(avatarUrl).then(res => res.buffer())
                .then(buffer => {
                    let stream = fs.createWriteStream(filePath);
                    stream.write(buffer);
                    stream.end();
                    resolve(filePath)
                })
        }).catch(e => {
            console.error(e);
            reject();
        });
    });
    return promise;
}

function handleDeleteImage(id) {
    let promise = new Promise((resolve, reject) => {
        let filePath = path.join(_IMAGE_STORAGE_PATH, id) + ".jpg";
        if (!fs.existsSync(filePath)) {
            resolve();
        }
        fs.unlink(filePath, (err) => {
            if (err) reject();
            resolve();
        });
    });
    return promise;

}

module.exports = { handleUserById, handleImageRequest, handleDeleteImage };