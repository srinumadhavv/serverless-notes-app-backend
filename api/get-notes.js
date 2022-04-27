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
        let query = event.queryStringParameters;
        let limit = query && query.limit ? parseInt(query.limit) : 5;
        let user_id = util.getUserId(event.headers);

        let params ={
            TableName: tablename,
            KeyConditionExpression: "user_id = :uid",
            ExpressionAttributeValues:{
                ":uid":user_id
            },
            Limit: limit,
            ScanIndexForward: false
        };
        let startTimestamp = query && query.start ? parseInt(query.start):0;

        if( startTimestamp > 0){
            params.ExclusiveStartKey ={
                user_id: user_id,
                timestamp: startTimestamp
            }
        }

        let data = await dynamodb.query(params).promise();

        return {
            statusCode:200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(data)
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