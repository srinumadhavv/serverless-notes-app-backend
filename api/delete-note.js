/*
Route : post / note
 */

const AWS = require('aws-sdk');
AWS.config.update({region: 'ap-southeast-1'});
const util = require('./util.js');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tablename = process.env.NOTES_TABLE;

module.exports.handler = async(event)=>{
    try{
        let timestamp = parseInt(event.pathParameters.timestamp);
        let params ={
            TableName:tablename,
            Key:{
                user_id: util.getUserId(event.headers),
                timestamp:timestamp
            }
        };
        await dynamodb.delete(params).promise();

        return {
            statusCode:200,
            headers: util.getResponseHeaders()
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