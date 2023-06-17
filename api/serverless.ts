import type { AWS } from "@serverless/typescript";

import * as functions from "@functions/index";

const serverlessConfiguration: AWS = {
  service: "api",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    deploymentMethod: "direct",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      APP_TABLE: {
        Ref: "u7z08rl0rzarE621B87F",
      },
      SES_SOURCE: "hnguyen110.akc@gmail.com",
      APIGW_URL: {
        "Fn::Join": [
          "",
          [
            "https://",
            {
              Ref: "ApiGatewayRestApi",
            },
            ".execute-api.",
            {
              Ref: "AWS::Region",
            },
            ".",
            {
              Ref: "AWS::URLSuffix",
            },
            "/${opt:stage, 'dev'}",
          ],
        ],
      },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["dynamodb:*"],
            Resource: {
              "Fn::GetAtt": ["u7z08rl0rzarE621B87F", "Arn"],
            },
          },
          {
            Effect: "Allow",
            Action: ["sqs:*"],
            Resource: {
              "Fn::GetAtt": ["ua8a68ndenk498B34503", "Arn"],
            },
          },
          {
            Effect: "Allow",
            Action: ["ses:*"],
            Resource: "*",
          },
        ],
      },
    },
  },
  functions: functions,
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      u7z08rl0rzarE621B87F: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          KeySchema: [
            {
              AttributeName: "pk",
              KeyType: "HASH",
            },
            {
              AttributeName: "sk",
              KeyType: "RANGE",
            },
          ],
          AttributeDefinitions: [
            {
              AttributeName: "pk",
              AttributeType: "S",
            },
            {
              AttributeName: "sk",
              AttributeType: "S",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          StreamSpecification: {
            StreamViewType: "NEW_AND_OLD_IMAGES",
          },
          TableName: "u7z08rl0rzar",
        },
        UpdateReplacePolicy: "Delete",
        DeletionPolicy: "Delete",
        Metadata: {
          "aws:cdk:path": "InfraStack/u7z08rl0rzar/Resource",
        },
      },
      ua8a68ndenk5AA90C1DE: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "ua8a68ndenk5",
        },
        UpdateReplacePolicy: "Delete",
        DeletionPolicy: "Delete",
        Metadata: {
          "aws:cdk:path": "InfraStack/ua8a68ndenk5/Resource",
        },
      },
      ua8a68ndenk498B34503: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "ua8a68ndenk4",
          RedrivePolicy: {
            deadLetterTargetArn: {
              "Fn::GetAtt": ["ua8a68ndenk5AA90C1DE", "Arn"],
            },
            maxReceiveCount: 3,
          },
        },
        UpdateReplacePolicy: "Delete",
        DeletionPolicy: "Delete",
        Metadata: {
          "aws:cdk:path": "InfraStack/ua8a68ndenk4/Resource",
        },
      },
      amv49fm28do7A9F67AF: {
        Type: "AWS::IAM::Role",
        Properties: {
          AssumeRolePolicyDocument: {
            Statement: [
              {
                Action: "sts:AssumeRole",
                Effect: "Allow",
                Principal: {
                  Service: "pipes.amazonaws.com",
                },
              },
            ],
            Version: "2012-10-17",
          },
          RoleName: "amv49fm28do",
        },
        UpdateReplacePolicy: "Delete",
        DeletionPolicy: "Delete",
        Metadata: {
          "aws:cdk:path": "InfraStack/amv49fm28do/Resource",
        },
      },
      amv49fm28doDefaultPolicy81643B0C: {
        Type: "AWS::IAM::Policy",
        Properties: {
          PolicyDocument: {
            Statement: [
              {
                Action: "sqs:SendMessage",
                Effect: "Allow",
                Resource: {
                  "Fn::GetAtt": ["ua8a68ndenk498B34503", "Arn"],
                },
              },
              {
                Action: [
                  "dynamodb:DescribeStream",
                  "dynamodb:GetRecords",
                  "dynamodb:GetShardIterator",
                  "dynamodb:ListStreams",
                ],
                Effect: "Allow",
                Resource: {
                  "Fn::GetAtt": ["u7z08rl0rzarE621B87F", "StreamArn"],
                },
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "amv49fm28doDefaultPolicy81643B0C",
          Roles: [
            {
              Ref: "amv49fm28do7A9F67AF",
            },
          ],
        },
        Metadata: {
          "aws:cdk:path": "InfraStack/amv49fm28do/DefaultPolicy/Resource",
        },
      },
      pwv9tvc8g0ph: {
        Type: "AWS::Pipes::Pipe",
        Properties: {
          RoleArn: {
            "Fn::GetAtt": ["amv49fm28do7A9F67AF", "Arn"],
          },
          Source: {
            "Fn::GetAtt": ["u7z08rl0rzarE621B87F", "StreamArn"],
          },
          Target: {
            "Fn::GetAtt": ["ua8a68ndenk498B34503", "Arn"],
          },
          Name: "pwv9tvc8g0ph",
          SourceParameters: {
            DynamoDBStreamParameters: {
              StartingPosition: "TRIM_HORIZON",
            },
            FilterCriteria: {
              Filters: [
                {
                  Pattern:
                    '{"eventName":["INSERT"],"dynamodb.NewImage.pk.S":[{"prefix":"RESERVATION#"}]}',
                },
              ],
            },
          },
        },
        UpdateReplacePolicy: "Delete",
        DeletionPolicy: "Delete",
        Metadata: {
          "aws:cdk:path": "InfraStack/pwv9tvc8g0ph",
        },
      },
      x38by3d3m091633951CC: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "x38by3d3m091",
        },
        UpdateReplacePolicy: "Delete",
        DeletionPolicy: "Delete",
        Metadata: {
          "aws:cdk:path": "InfraStack/x38by3d3m091/Resource",
        },
      },
      x38by3d3m09BD0F1A48: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "x38by3d3m09",
          RedrivePolicy: {
            deadLetterTargetArn: {
              "Fn::GetAtt": ["x38by3d3m091633951CC", "Arn"],
            },
            maxReceiveCount: 3,
          },
        },
        UpdateReplacePolicy: "Delete",
        DeletionPolicy: "Delete",
        Metadata: {
          "aws:cdk:path": "InfraStack/x38by3d3m09/Resource",
        },
      },
      sis0e8t70o6A57505B5: {
        Type: "AWS::IAM::Role",
        Properties: {
          AssumeRolePolicyDocument: {
            Statement: [
              {
                Action: "sts:AssumeRole",
                Effect: "Allow",
                Principal: {
                  Service: "pipes.amazonaws.com",
                },
              },
            ],
            Version: "2012-10-17",
          },
          RoleName: "sis0e8t70o6",
        },
        UpdateReplacePolicy: "Delete",
        DeletionPolicy: "Delete",
        Metadata: {
          "aws:cdk:path": "InfraStack/sis0e8t70o6/Resource",
        },
      },
      sis0e8t70o6DefaultPolicyCD3C6766: {
        Type: "AWS::IAM::Policy",
        Properties: {
          PolicyDocument: {
            Statement: [
              {
                Action: "sqs:SendMessage",
                Effect: "Allow",
                Resource: {
                  "Fn::GetAtt": ["x38by3d3m09BD0F1A48", "Arn"],
                },
              },
              {
                Action: [
                  "dynamodb:DescribeStream",
                  "dynamodb:GetRecords",
                  "dynamodb:GetShardIterator",
                  "dynamodb:ListStreams",
                ],
                Effect: "Allow",
                Resource: {
                  "Fn::GetAtt": ["u7z08rl0rzarE621B87F", "StreamArn"],
                },
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "sis0e8t70o6DefaultPolicyCD3C6766",
          Roles: [
            {
              Ref: "sis0e8t70o6A57505B5",
            },
          ],
        },
        Metadata: {
          "aws:cdk:path": "InfraStack/sis0e8t70o6/DefaultPolicy/Resource",
        },
      },
      pwv9tvc8g0p: {
        Type: "AWS::Pipes::Pipe",
        Properties: {
          RoleArn: {
            "Fn::GetAtt": ["sis0e8t70o6A57505B5", "Arn"],
          },
          Source: {
            "Fn::GetAtt": ["u7z08rl0rzarE621B87F", "StreamArn"],
          },
          Target: {
            "Fn::GetAtt": ["x38by3d3m09BD0F1A48", "Arn"],
          },
          Name: "pwv9tvc8g0p",
          SourceParameters: {
            DynamoDBStreamParameters: {
              StartingPosition: "TRIM_HORIZON",
            },
            FilterCriteria: {
              Filters: [
                {
                  Pattern:
                    '{"eventName":["REMOVE"],"dynamodb.OldImage.pk.S":[{"prefix":"RESERVATION#"}]}',
                },
              ],
            },
          },
        },
        UpdateReplacePolicy: "Delete",
        DeletionPolicy: "Delete",
        Metadata: {
          "aws:cdk:path": "InfraStack/pwv9tvc8g0p",
        },
      },
      x38by3d3m090D56335B3: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "x38by3d3m090",
        },
        UpdateReplacePolicy: "Delete",
        DeletionPolicy: "Delete",
        Metadata: {
          "aws:cdk:path": "InfraStack/x38by3d3m090/Resource",
        },
      },
      k4j54hr350h71819A6B5: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "k4j54hr350h7",
          RedrivePolicy: {
            deadLetterTargetArn: {
              "Fn::GetAtt": ["x38by3d3m090D56335B3", "Arn"],
            },
            maxReceiveCount: 3,
          },
        },
        UpdateReplacePolicy: "Delete",
        DeletionPolicy: "Delete",
        Metadata: {
          "aws:cdk:path": "InfraStack/k4j54hr350h7/Resource",
        },
      },
      sis0e8t70o6l9FB35D4F: {
        Type: "AWS::IAM::Role",
        Properties: {
          AssumeRolePolicyDocument: {
            Statement: [
              {
                Action: "sts:AssumeRole",
                Effect: "Allow",
                Principal: {
                  Service: "pipes.amazonaws.com",
                },
              },
            ],
            Version: "2012-10-17",
          },
          RoleName: "sis0e8t70o6l",
        },
        UpdateReplacePolicy: "Delete",
        DeletionPolicy: "Delete",
        Metadata: {
          "aws:cdk:path": "InfraStack/sis0e8t70o6l/Resource",
        },
      },
      sis0e8t70o6lDefaultPolicyD3C1EE77: {
        Type: "AWS::IAM::Policy",
        Properties: {
          PolicyDocument: {
            Statement: [
              {
                Action: "sqs:SendMessage",
                Effect: "Allow",
                Resource: {
                  "Fn::GetAtt": ["k4j54hr350h71819A6B5", "Arn"],
                },
              },
              {
                Action: [
                  "dynamodb:DescribeStream",
                  "dynamodb:GetRecords",
                  "dynamodb:GetShardIterator",
                  "dynamodb:ListStreams",
                ],
                Effect: "Allow",
                Resource: {
                  "Fn::GetAtt": ["u7z08rl0rzarE621B87F", "StreamArn"],
                },
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "sis0e8t70o6lDefaultPolicyD3C1EE77",
          Roles: [
            {
              Ref: "sis0e8t70o6l9FB35D4F",
            },
          ],
        },
        Metadata: {
          "aws:cdk:path": "InfraStack/sis0e8t70o6l/DefaultPolicy/Resource",
        },
      },
      a6zal1q56oe7: {
        Type: "AWS::Pipes::Pipe",
        Properties: {
          RoleArn: {
            "Fn::GetAtt": ["sis0e8t70o6l9FB35D4F", "Arn"],
          },
          Source: {
            "Fn::GetAtt": ["u7z08rl0rzarE621B87F", "StreamArn"],
          },
          Target: {
            "Fn::GetAtt": ["k4j54hr350h71819A6B5", "Arn"],
          },
          Name: "a6zal1q56oe7",
          SourceParameters: {
            DynamoDBStreamParameters: {
              StartingPosition: "TRIM_HORIZON",
            },
            FilterCriteria: {
              Filters: [
                {
                  Pattern:
                    '{"eventName":["MODIFY"],"dynamodb.NewImage.pk.S":[{"prefix":"RESERVATION#"}]}',
                },
              ],
            },
          },
        },
        UpdateReplacePolicy: "Delete",
        DeletionPolicy: "Delete",
        Metadata: {
          "aws:cdk:path": "InfraStack/a6zal1q56oe7",
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
