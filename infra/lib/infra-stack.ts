import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as iam from "aws-cdk-lib/aws-iam";
import { aws_pipes as pipes } from "aws-cdk-lib";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "u7z08rl0rzar", {
      tableName: "u7z08rl0rzar",
      partitionKey: {
        name: "pk",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "sk",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const createReservationRoleQueue = new sqs.Queue(this, "ua8a68ndenk4", {
      queueName: "ua8a68ndenk4",
      deadLetterQueue: {
        maxReceiveCount: 3,
        queue: new sqs.Queue(this, "ua8a68ndenk5", {
          queueName: "ua8a68ndenk5",
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        }),
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const createReservationRole = new iam.Role(this, "amv49fm28do", {
      roleName: "amv49fm28do",
      assumedBy: new iam.ServicePrincipal("pipes.amazonaws.com"),
    });

    createReservationRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["sqs:SendMessage"],
        resources: [createReservationRoleQueue.queueArn],
      })
    );

    createReservationRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "dynamodb:DescribeStream",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListStreams",
        ],
        resources: [table.tableStreamArn as string],
      })
    );

    createReservationRole.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    const pipe = new pipes.CfnPipe(this, "pwv9tvc8g0ph", {
      name: "pwv9tvc8g0ph",
      roleArn: createReservationRole.roleArn,
      source: table.tableStreamArn as string,
      sourceParameters: {
        dynamoDbStreamParameters: {
          startingPosition: "TRIM_HORIZON",
        },
        filterCriteria: {
          filters: [
            {
              pattern: JSON.stringify({
                eventName: ["INSERT"],
                "dynamodb.NewImage.pk.S": [{ prefix: "RESERVATION#" }],
              }),
            },
          ],
        },
      },
      target: createReservationRoleQueue.queueArn,
    });

    pipe.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    const deleteReservationQueue = new sqs.Queue(this, "x38by3d3m09", {
      queueName: "x38by3d3m09",
      deadLetterQueue: {
        maxReceiveCount: 3,
        queue: new sqs.Queue(this, "x38by3d3m091", {
          queueName: "x38by3d3m091",
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        }),
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const deleteReservationRole = new iam.Role(this, "sis0e8t70o6", {
      roleName: "sis0e8t70o6",
      assumedBy: new iam.ServicePrincipal("pipes.amazonaws.com"),
    });

    deleteReservationRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["sqs:SendMessage"],
        resources: [deleteReservationQueue.queueArn],
      })
    );

    deleteReservationRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "dynamodb:DescribeStream",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListStreams",
        ],
        resources: [table.tableStreamArn as string],
      })
    );

    deleteReservationRole.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    const deleteReservationPipe = new pipes.CfnPipe(this, "pwv9tvc8g0p", {
      name: "pwv9tvc8g0p",
      roleArn: deleteReservationRole.roleArn,
      source: table.tableStreamArn as string,
      sourceParameters: {
        dynamoDbStreamParameters: {
          startingPosition: "TRIM_HORIZON",
        },
        filterCriteria: {
          filters: [
            {
              pattern: JSON.stringify({
                eventName: ["REMOVE"],
                "dynamodb.OldImage.pk.S": [{ prefix: "RESERVATION#" }],
              }),
            },
          ],
        },
      },
      target: deleteReservationQueue.queueArn,
    });

    deleteReservationPipe.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    const updateReservationRoleQueue = new sqs.Queue(this, "k4j54hr350h7", {
      queueName: "k4j54hr350h7",
      deadLetterQueue: {
        maxReceiveCount: 3,
        queue: new sqs.Queue(this, "x38by3d3m090", {
          queueName: "x38by3d3m090",
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        }),
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const updateReservationRole = new iam.Role(this, "sis0e8t70o6l", {
      roleName: "sis0e8t70o6l",
      assumedBy: new iam.ServicePrincipal("pipes.amazonaws.com"),
    });

    updateReservationRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["sqs:SendMessage"],
        resources: [updateReservationRoleQueue.queueArn],
      })
    );

    updateReservationRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "dynamodb:DescribeStream",
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:ListStreams",
        ],
        resources: [table.tableStreamArn as string],
      })
    );

    updateReservationRole.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    const updateReservationPipe = new pipes.CfnPipe(this, "a6zal1q56oe7", {
      name: "a6zal1q56oe7",
      roleArn: updateReservationRole.roleArn,
      source: table.tableStreamArn as string,
      sourceParameters: {
        dynamoDbStreamParameters: {
          startingPosition: "TRIM_HORIZON",
        },
        filterCriteria: {
          filters: [
            {
              pattern: JSON.stringify({
                eventName: ["MODIFY"],
                "dynamodb.NewImage.pk.S": [{ prefix: "RESERVATION#" }],
              }),
            },
          ],
        },
      },
      target: updateReservationRoleQueue.queueArn,
    });

    updateReservationPipe.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
  }
}
