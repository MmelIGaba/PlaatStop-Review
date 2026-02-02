# infrastructure/secrets.tf

# 1. Create AWS Secrets Manager Secret for Database Password
resource "aws_secretsmanager_secret" "db_password" {
  name        = "plaatstop-db-password"
  description = "Database password for PlaatStop application"
}

# 2. Store the initial password value
resource "aws_secretsmanager_secret_version" "db_password_version" {
  secret_id = aws_secretsmanager_secret.db_password.id
  secret_string = jsonencode({
    password = "mysecretpassword" # Replace with a strong password
  })
}

# 3. Enable automatic password rotation (optional)
resource "aws_secretsmanager_secret_rotation" "db_password_rotation" {
  secret_id           = aws_secretsmanager_secret.db_password.id
  rotation_lambda_arn = aws_lambda_function.db_password_rotator.arn

  rotation_rules {
    automatically_after_days = 30
  }
}

# 4. Lambda function for password rotation (simplified example)
resource "aws_lambda_function" "db_password_rotator" {
  filename      = "lambda_rotation.zip" # You'll need to create this
  function_name = "plaatstop-db-password-rotator"
  role          = aws_iam_role.lambda_rotation_role.arn
  handler       = "index.handler"
  runtime       = "python3.9"
  timeout       = 30

  # This is a placeholder - you'll need to implement the actual rotation logic
  # For now, this is just the resource definition
}

# 5. IAM Role for Lambda rotation
resource "aws_iam_role" "lambda_rotation_role" {
  name = "plaatstop-lambda-rotation-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# 6. IAM Policy for Lambda rotation
resource "aws_iam_role_policy" "lambda_rotation_policy" {
  name = "plaatstop-lambda-rotation-policy"
  role = aws_iam_role.lambda_rotation_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret",
          "secretsmanager:PutSecretValue",
          "secretsmanager:UpdateSecretVersionStage"
        ]
        Resource = aws_secretsmanager_secret.db_password.arn
      },
      {
        Effect = "Allow"
        Action = [
          "rds:ModifyDBInstance"
        ]
        Resource = aws_db_instance.default.arn
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# 7. Output the secret ARN for use in other resources
output "db_password_secret_arn" {
  value       = aws_secretsmanager_secret.db_password.arn
  description = "ARN of the database password secret"
}
