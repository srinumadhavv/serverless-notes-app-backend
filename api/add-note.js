/*
Route : post / note
 */

const AWS = require('aws-sdk');
AWS.config.update({region: 'ap-southeast-1'});
const util = require('./util.js');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tablename = process.env.NOTES_TABLE;
const moment = require('moment');
const { v4: uuidv4 } = require("uuid");

module.exports.handler = async(event)=>{
    try{
        let item = JSON.parse(event.body).Item;
        item.user_id = util.getUserId(event.headers);
        item.user_name = util.getUserName(event.headers);
        item.note_id = item.user_id+":"+uuidv4();
        item.timestamp = moment().unix();
        item.expires = moment().add(90,'days').unix();

        let data = await dynamodb.put({
            TableName: tablename,
            Item: item
        }).promise();
        return {
            statusCode:200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(item)
        }
    }catch(err){
        console.log("error",err);
        return{
            statusCode: err.statusCode ? err.statusCode :500,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                error:err.name ? err.name:"Exception",
                message: err.message ? err.message : "Unkown Error"
            })
        };
    }
}