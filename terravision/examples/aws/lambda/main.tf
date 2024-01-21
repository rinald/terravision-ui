terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  access_key = "test"
  secret_key = "test"
  region     = "us-east-1"

  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

// create an archive of the lambda function code
data "archive_file" "lambda_function_payload" {
  type = "zip"
  source {
    filename = "main.js"
    content  = <<EOF
      exports.handler = async (event) => {
        const response = {
          statusCode: 200,
          body: JSON.stringify('Hello from Lambda!'),
        };
        return response;
      };
    EOF
  }
  output_path = "${path.module}/builds/lambda.zip"
}

// create a lambda function
resource "aws_lambda_function" "example" {
  filename      = "builds/lambda.zip"
  function_name = "example"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "index.handler"

  source_code_hash = data.archive_file.lambda_function_payload.output_base64sha256
  runtime          = "nodejs18.x"
}
