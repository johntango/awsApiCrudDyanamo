"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apigateway = require("@aws-cdk/aws-apigateway");
const dynamodb = require("@aws-cdk/aws-dynamodb");
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/cdk");
class ApiLambdaCrudDynamoDBStack extends cdk.Stack {
    constructor(app, id) {
        super(app, id);
        const dynamoTable = new dynamodb.Table(this, 'items', {
            partitionKey: {
                name: 'itemId',
                type: dynamodb.AttributeType.String
            },
            tableName: 'items'
        });
        const getOneLambda = new lambda.Function(this, 'getOneItemFunction', {
            code: new lambda.AssetCode('src'),
            handler: 'get-one.handler',
            runtime: lambda.Runtime.Nodejs810,
            environment: {
                TABLE_NAME: dynamoTable.tableName,
                PRIMARY_KEY: 'itemId'
            }
        });
        const getAllLambda = new lambda.Function(this, 'getAllItemsFunction', {
            code: new lambda.AssetCode('src'),
            handler: 'get-all.handler',
            runtime: lambda.Runtime.Nodejs810,
            environment: {
                TABLE_NAME: dynamoTable.tableName,
                PRIMARY_KEY: 'itemId'
            }
        });
        const createOne = new lambda.Function(this, 'createItemFunction', {
            code: new lambda.AssetCode('src'),
            handler: 'create.handler',
            runtime: lambda.Runtime.Nodejs810,
            environment: {
                TABLE_NAME: dynamoTable.tableName,
                PRIMARY_KEY: 'itemId'
            }
        });
        const updateOne = new lambda.Function(this, 'updateItemFunction', {
            code: new lambda.AssetCode('src'),
            handler: 'update-one.handler',
            runtime: lambda.Runtime.Nodejs810,
            environment: {
                TABLE_NAME: dynamoTable.tableName,
                PRIMARY_KEY: 'itemId'
            }
        });
        const deleteOne = new lambda.Function(this, 'deleteItemFunction', {
            code: new lambda.AssetCode('src'),
            handler: 'delete-one.handler',
            runtime: lambda.Runtime.Nodejs810,
            environment: {
                TABLE_NAME: dynamoTable.tableName,
                PRIMARY_KEY: 'itemId'
            }
        });
        dynamoTable.grantReadWriteData(getAllLambda);
        dynamoTable.grantReadWriteData(getOneLambda);
        dynamoTable.grantReadWriteData(createOne);
        dynamoTable.grantReadWriteData(updateOne);
        dynamoTable.grantReadWriteData(createOne);
        dynamoTable.grantReadWriteData(deleteOne);
        const api = new apigateway.RestApi(this, 'itemsApi', {
            restApiName: 'Items Service'
        });
        const items = api.root.addResource('items');
        const getAllIntegration = new apigateway.LambdaIntegration(getAllLambda);
        items.addMethod('GET', getAllIntegration);
        const createOneIntegration = new apigateway.LambdaIntegration(createOne);
        items.addMethod('POST', createOneIntegration);
        addCorsOptions(items);
        const singleItem = items.addResource('{id}');
        const getOneIntegration = new apigateway.LambdaIntegration(getOneLambda);
        singleItem.addMethod('GET', getOneIntegration);
        const updateOneIntegration = new apigateway.LambdaIntegration(updateOne);
        singleItem.addMethod('PATCH', updateOneIntegration);
        const deleteOneIntegration = new apigateway.LambdaIntegration(deleteOne);
        singleItem.addMethod('DELETE', deleteOneIntegration);
        addCorsOptions(singleItem);
    }
}
exports.ApiLambdaCrudDynamoDBStack = ApiLambdaCrudDynamoDBStack;
function addCorsOptions(apiResource) {
    apiResource.addMethod('OPTIONS', new apigateway.MockIntegration({
        integrationResponses: [{
                statusCode: '200',
                responseParameters: {
                    'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                    'method.response.header.Access-Control-Allow-Origin': "'*'",
                    'method.response.header.Access-Control-Allow-Credentials': "'false'",
                    'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
                },
            }],
        passthroughBehavior: apigateway.PassthroughBehavior.Never,
        requestTemplates: {
            "application/json": "{\"statusCode\": 200}"
        },
    }), {
        methodResponses: [{
                statusCode: '200',
                responseParameters: {
                    'method.response.header.Access-Control-Allow-Headers': true,
                    'method.response.header.Access-Control-Allow-Methods': true,
                    'method.response.header.Access-Control-Allow-Credentials': true,
                    'method.response.header.Access-Control-Allow-Origin': true,
                },
            }]
    });
}
exports.addCorsOptions = addCorsOptions;
const app = new cdk.App();
new ApiLambdaCrudDynamoDBStack(app, 'ApiLambdaCrudDynamoDBExample');
app.run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNEQUF1RDtBQUN2RCxrREFBbUQ7QUFDbkQsOENBQStDO0FBQy9DLG9DQUFxQztBQUVyQyxNQUFhLDBCQUEyQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3ZELFlBQVksR0FBWSxFQUFFLEVBQVU7UUFDbEMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVmLE1BQU0sV0FBVyxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQ3BELFlBQVksRUFBRTtnQkFDWixJQUFJLEVBQUUsUUFBUTtnQkFDZCxJQUFJLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNO2FBQ3BDO1lBQ0QsU0FBUyxFQUFFLE9BQU87U0FDbkIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxZQUFZLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRTtZQUNuRSxJQUFJLEVBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztZQUNqQyxPQUFPLEVBQUUsaUJBQWlCO1lBQzFCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVM7WUFDakMsV0FBVyxFQUFFO2dCQUNYLFVBQVUsRUFBRSxXQUFXLENBQUMsU0FBUztnQkFDakMsV0FBVyxFQUFFLFFBQVE7YUFDdEI7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLFlBQVksR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQ3BFLElBQUksRUFBRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQ2pDLE9BQU8sRUFBRSxpQkFBaUI7WUFDMUIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUztZQUNqQyxXQUFXLEVBQUU7Z0JBQ1gsVUFBVSxFQUFFLFdBQVcsQ0FBQyxTQUFTO2dCQUNqQyxXQUFXLEVBQUUsUUFBUTthQUN0QjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sU0FBUyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUU7WUFDaEUsSUFBSSxFQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7WUFDakMsT0FBTyxFQUFFLGdCQUFnQjtZQUN6QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTO1lBQ2pDLFdBQVcsRUFBRTtnQkFDWCxVQUFVLEVBQUUsV0FBVyxDQUFDLFNBQVM7Z0JBQ2pDLFdBQVcsRUFBRSxRQUFRO2FBQ3RCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxTQUFTLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRTtZQUNoRSxJQUFJLEVBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztZQUNqQyxPQUFPLEVBQUUsb0JBQW9CO1lBQzdCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVM7WUFDakMsV0FBVyxFQUFFO2dCQUNYLFVBQVUsRUFBRSxXQUFXLENBQUMsU0FBUztnQkFDakMsV0FBVyxFQUFFLFFBQVE7YUFDdEI7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLFNBQVMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQ2hFLElBQUksRUFBRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQ2pDLE9BQU8sRUFBRSxvQkFBb0I7WUFDN0IsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUztZQUNqQyxXQUFXLEVBQUU7Z0JBQ1gsVUFBVSxFQUFFLFdBQVcsQ0FBQyxTQUFTO2dCQUNqQyxXQUFXLEVBQUUsUUFBUTthQUN0QjtTQUNGLENBQUMsQ0FBQztRQUVILFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM3QyxXQUFXLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDN0MsV0FBVyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTFDLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ25ELFdBQVcsRUFBRSxlQUFlO1NBQzdCLENBQUMsQ0FBQztRQUVILE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzVDLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDekUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUUxQyxNQUFNLG9CQUFvQixHQUFHLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDOUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXRCLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0MsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN6RSxVQUFVLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBRS9DLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDekUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUVwRCxNQUFNLG9CQUFvQixHQUFHLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3pFLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDckQsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzdCLENBQUM7Q0FDRjtBQTVGRCxnRUE0RkM7QUFFRCxTQUFnQixjQUFjLENBQUMsV0FBaUM7SUFDOUQsV0FBVyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxVQUFVLENBQUMsZUFBZSxDQUFDO1FBQzlELG9CQUFvQixFQUFFLENBQUM7Z0JBQ3JCLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixrQkFBa0IsRUFBRTtvQkFDbEIscURBQXFELEVBQUUseUZBQXlGO29CQUNoSixvREFBb0QsRUFBRSxLQUFLO29CQUMzRCx5REFBeUQsRUFBRSxTQUFTO29CQUNwRSxxREFBcUQsRUFBRSwrQkFBK0I7aUJBQ3ZGO2FBQ0YsQ0FBQztRQUNGLG1CQUFtQixFQUFFLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLO1FBQ3pELGdCQUFnQixFQUFFO1lBQ2hCLGtCQUFrQixFQUFFLHVCQUF1QjtTQUM1QztLQUNGLENBQUMsRUFBRTtRQUNBLGVBQWUsRUFBRSxDQUFDO2dCQUNoQixVQUFVLEVBQUUsS0FBSztnQkFDakIsa0JBQWtCLEVBQUU7b0JBQ2xCLHFEQUFxRCxFQUFFLElBQUk7b0JBQzNELHFEQUFxRCxFQUFFLElBQUk7b0JBQzNELHlEQUF5RCxFQUFFLElBQUk7b0JBQy9ELG9EQUFvRCxFQUFFLElBQUk7aUJBQzNEO2FBQ0YsQ0FBQztLQUNILENBQUMsQ0FBQTtBQUNOLENBQUM7QUExQkQsd0NBMEJDO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsSUFBSSwwQkFBMEIsQ0FBQyxHQUFHLEVBQUUsOEJBQThCLENBQUMsQ0FBQztBQUNwRSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXBpZ2F0ZXdheSA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5Jyk7XG5pbXBvcnQgZHluYW1vZGIgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtZHluYW1vZGInKTtcbmltcG9ydCBsYW1iZGEgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtbGFtYmRhJyk7XG5pbXBvcnQgY2RrID0gcmVxdWlyZSgnQGF3cy1jZGsvY2RrJyk7XG5cbmV4cG9ydCBjbGFzcyBBcGlMYW1iZGFDcnVkRHluYW1vREJTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKGFwcDogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKGFwcCwgaWQpO1xuXG4gICAgY29uc3QgZHluYW1vVGFibGUgPSBuZXcgZHluYW1vZGIuVGFibGUodGhpcywgJ2l0ZW1zJywge1xuICAgICAgcGFydGl0aW9uS2V5OiB7XG4gICAgICAgIG5hbWU6ICdpdGVtSWQnLFxuICAgICAgICB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlN0cmluZ1xuICAgICAgfSxcbiAgICAgIHRhYmxlTmFtZTogJ2l0ZW1zJ1xuICAgIH0pO1xuXG4gICAgY29uc3QgZ2V0T25lTGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnZ2V0T25lSXRlbUZ1bmN0aW9uJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5Bc3NldENvZGUoJ3NyYycpLFxuICAgICAgaGFuZGxlcjogJ2dldC1vbmUuaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5Ob2RlanM4MTAsXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBUQUJMRV9OQU1FOiBkeW5hbW9UYWJsZS50YWJsZU5hbWUsXG4gICAgICAgIFBSSU1BUllfS0VZOiAnaXRlbUlkJ1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgZ2V0QWxsTGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnZ2V0QWxsSXRlbXNGdW5jdGlvbicsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuQXNzZXRDb2RlKCdzcmMnKSxcbiAgICAgIGhhbmRsZXI6ICdnZXQtYWxsLmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTm9kZWpzODEwLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgVEFCTEVfTkFNRTogZHluYW1vVGFibGUudGFibGVOYW1lLFxuICAgICAgICBQUklNQVJZX0tFWTogJ2l0ZW1JZCdcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IGNyZWF0ZU9uZSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ2NyZWF0ZUl0ZW1GdW5jdGlvbicsIHtcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuQXNzZXRDb2RlKCdzcmMnKSxcbiAgICAgIGhhbmRsZXI6ICdjcmVhdGUuaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5Ob2RlanM4MTAsXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBUQUJMRV9OQU1FOiBkeW5hbW9UYWJsZS50YWJsZU5hbWUsXG4gICAgICAgIFBSSU1BUllfS0VZOiAnaXRlbUlkJ1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgdXBkYXRlT25lID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAndXBkYXRlSXRlbUZ1bmN0aW9uJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5Bc3NldENvZGUoJ3NyYycpLFxuICAgICAgaGFuZGxlcjogJ3VwZGF0ZS1vbmUuaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5Ob2RlanM4MTAsXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBUQUJMRV9OQU1FOiBkeW5hbW9UYWJsZS50YWJsZU5hbWUsXG4gICAgICAgIFBSSU1BUllfS0VZOiAnaXRlbUlkJ1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgZGVsZXRlT25lID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnZGVsZXRlSXRlbUZ1bmN0aW9uJywge1xuICAgICAgY29kZTogbmV3IGxhbWJkYS5Bc3NldENvZGUoJ3NyYycpLFxuICAgICAgaGFuZGxlcjogJ2RlbGV0ZS1vbmUuaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5Ob2RlanM4MTAsXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBUQUJMRV9OQU1FOiBkeW5hbW9UYWJsZS50YWJsZU5hbWUsXG4gICAgICAgIFBSSU1BUllfS0VZOiAnaXRlbUlkJ1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZHluYW1vVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGdldEFsbExhbWJkYSk7XG4gICAgZHluYW1vVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGdldE9uZUxhbWJkYSk7XG4gICAgZHluYW1vVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGNyZWF0ZU9uZSk7XG4gICAgZHluYW1vVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKHVwZGF0ZU9uZSk7XG4gICAgZHluYW1vVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGNyZWF0ZU9uZSk7XG4gICAgZHluYW1vVGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKGRlbGV0ZU9uZSk7XG5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsICdpdGVtc0FwaScsIHtcbiAgICAgIHJlc3RBcGlOYW1lOiAnSXRlbXMgU2VydmljZSdcbiAgICB9KTtcblxuICAgIGNvbnN0IGl0ZW1zID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ2l0ZW1zJyk7XG4gICAgY29uc3QgZ2V0QWxsSW50ZWdyYXRpb24gPSBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihnZXRBbGxMYW1iZGEpO1xuICAgIGl0ZW1zLmFkZE1ldGhvZCgnR0VUJywgZ2V0QWxsSW50ZWdyYXRpb24pO1xuXG4gICAgY29uc3QgY3JlYXRlT25lSW50ZWdyYXRpb24gPSBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihjcmVhdGVPbmUpO1xuICAgIGl0ZW1zLmFkZE1ldGhvZCgnUE9TVCcsIGNyZWF0ZU9uZUludGVncmF0aW9uKTtcbiAgICBhZGRDb3JzT3B0aW9ucyhpdGVtcyk7XG5cbiAgICBjb25zdCBzaW5nbGVJdGVtID0gaXRlbXMuYWRkUmVzb3VyY2UoJ3tpZH0nKTtcbiAgICBjb25zdCBnZXRPbmVJbnRlZ3JhdGlvbiA9IG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGdldE9uZUxhbWJkYSk7XG4gICAgc2luZ2xlSXRlbS5hZGRNZXRob2QoJ0dFVCcsIGdldE9uZUludGVncmF0aW9uKTtcblxuICAgIGNvbnN0IHVwZGF0ZU9uZUludGVncmF0aW9uID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24odXBkYXRlT25lKTtcbiAgICBzaW5nbGVJdGVtLmFkZE1ldGhvZCgnUEFUQ0gnLCB1cGRhdGVPbmVJbnRlZ3JhdGlvbik7XG5cbiAgICBjb25zdCBkZWxldGVPbmVJbnRlZ3JhdGlvbiA9IG5ldyBhcGlnYXRld2F5LkxhbWJkYUludGVncmF0aW9uKGRlbGV0ZU9uZSk7XG4gICAgc2luZ2xlSXRlbS5hZGRNZXRob2QoJ0RFTEVURScsIGRlbGV0ZU9uZUludGVncmF0aW9uKTtcbiAgICBhZGRDb3JzT3B0aW9ucyhzaW5nbGVJdGVtKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkQ29yc09wdGlvbnMoYXBpUmVzb3VyY2U6IGFwaWdhdGV3YXkuSVJlc291cmNlKSB7XG4gIGFwaVJlc291cmNlLmFkZE1ldGhvZCgnT1BUSU9OUycsIG5ldyBhcGlnYXRld2F5Lk1vY2tJbnRlZ3JhdGlvbih7XG4gICAgaW50ZWdyYXRpb25SZXNwb25zZXM6IFt7XG4gICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcbiAgICAgIHJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogXCInQ29udGVudC1UeXBlLFgtQW16LURhdGUsQXV0aG9yaXphdGlvbixYLUFwaS1LZXksWC1BbXotU2VjdXJpdHktVG9rZW4sWC1BbXotVXNlci1BZ2VudCdcIixcbiAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogXCInKidcIixcbiAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHMnOiBcIidmYWxzZSdcIixcbiAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6IFwiJ09QVElPTlMsR0VULFBVVCxQT1NULERFTEVURSdcIixcbiAgICAgIH0sXG4gICAgfV0sXG4gICAgcGFzc3Rocm91Z2hCZWhhdmlvcjogYXBpZ2F0ZXdheS5QYXNzdGhyb3VnaEJlaGF2aW9yLk5ldmVyLFxuICAgIHJlcXVlc3RUZW1wbGF0ZXM6IHtcbiAgICAgIFwiYXBwbGljYXRpb24vanNvblwiOiBcIntcXFwic3RhdHVzQ29kZVxcXCI6IDIwMH1cIlxuICAgIH0sXG4gIH0pLCB7XG4gICAgICBtZXRob2RSZXNwb25zZXM6IFt7XG4gICAgICAgIHN0YXR1c0NvZGU6ICcyMDAnLFxuICAgICAgICByZXNwb25zZVBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogdHJ1ZSxcbiAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogdHJ1ZSxcbiAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFscyc6IHRydWUsXG4gICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH1dXG4gICAgfSlcbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbm5ldyBBcGlMYW1iZGFDcnVkRHluYW1vREJTdGFjayhhcHAsICdBcGlMYW1iZGFDcnVkRHluYW1vREJFeGFtcGxlJyk7XG5hcHAucnVuKCk7XG4iXX0=