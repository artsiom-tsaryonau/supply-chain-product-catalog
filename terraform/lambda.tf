
resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

data "archive_file" "command_lambda_zip" {
    type          = "zip"
    source_file   = "../lambda/command_index.js"
    output_path   = "command_lambda.zip"
}

resource "aws_lambda_function" "command_lambda" {
  filename         = "command_lambda.zip"
  function_name    = "command_lambda"
  role             = "${aws_iam_role.iam_for_lambda.arn}"
  handler          = "command_index.handler"
  source_code_hash = "${data.archive_file.command_lambda_zip.output_base64sha256}"
  runtime          = "nodejs14.x"
}