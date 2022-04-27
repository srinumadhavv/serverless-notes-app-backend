/*
Route : post / note
 */

const AWS = require('aws-sdk');
AWS.config.update({region: 'ap-southeast-1'});
const util = require('./util.js');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tablename = process.env.NOTES_TABLE;
const _ = require('underscore')
module.exports.handler = async(event)=>{
    try{
        let note_id = decodeURIComponent(event.pathParameters.note_id);

        let params ={
            TableName: tablename,
            IndexName: "note_id-index",
            KeyConditionExpression: "note_id = :note_id",
            ExpressionAttributeValues: {
                ":note_id":note_id
            },
            Limit: 1,
        }
        let data = await dynamodb.query(params).promise();
        if(!_.isEmpty(data.Items)){
            return {
                statusCode:200,
                headers: util.getResponseHeaders(),
                body: JSON.stringify(data.Items[0])
            } 
        }else{
            return {
                statusCode:200,
                headers: util.getResponseHeaders(),
                body: JSON.stringify("none")
            }
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