const AWS = require('aws-sdk');
const fs = require('fs');
require("dotenv").config();

const s3 = new AWS.S3({
    accessKeyId: process.env.id,
    secretAccessKey: process.env.key_secret
});

var parametrosGetObjet ={
    Bucket: process.env.Bucket,
    Key: process.env.Key

}

s3.getObject(parametrosGetObjet, (err, data) => {
    if (err) console.log(err);
    console.log(data);
    fs.writeFile("db.json", data.Body, 'binary', (err) => {
        if (err) console.log(err);
        console.log("DB actualizada")
    })
})