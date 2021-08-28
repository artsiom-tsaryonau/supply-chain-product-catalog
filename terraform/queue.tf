
resource "aws_sqs_queue" "supply_chain_commands" {
  name                        = "supply-chain-commands.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  delay_seconds               = 90
  max_message_size            = 2048
  message_retention_seconds   = 86400
  receive_wait_time_seconds   = 10
}

