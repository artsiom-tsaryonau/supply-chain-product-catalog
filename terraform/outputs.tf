output "supply_chain_command_queue_url" {
  description = "Supply chain SQS url"
  value       = aws_sqs_queue.supply_chain_commands.url
}

output "supply_chain_command_queue_arn" {
  description = "Supply chain SQS arn"
  value       = aws_sqs_queue.supply_chain_commands.arn
}

output "supply_chain_command_lambda_arn" {
  description = "Supply chain command Lambda arn"
  value       = aws_lambda_function.command_lambda.arn
}
