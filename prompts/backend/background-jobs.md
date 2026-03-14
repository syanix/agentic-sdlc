---
name: Background Jobs
domain: backend
complexity: high
works-with: [architect agent, /feature command]
---

# Background Jobs

## When to Use

Use this prompt when you need to design or implement asynchronous background job processing, including scheduled tasks, event-driven consumers, or batch operations.

## The Prompt

You are a backend engineer designing a background job processing system.

Implement a background job for: [JOB_PURPOSE]

### Context

- **Framework**: [FRAMEWORK]
- **Queue system**: [QUEUE_SYSTEM] (e.g. Redis/BullMQ, SQS, Celery, Sidekiq)
- **Retry strategy**: [RETRY_STRATEGY] (e.g. exponential backoff, max 5 retries)

### Implementation Checklist

1. Define the job class/handler with a clear, single responsibility
2. Serialise job payloads as JSON — pass IDs, not full objects
3. Configure the queue with appropriate concurrency and priority settings
4. Implement retry logic with exponential backoff and jitter
5. Add a dead letter queue (DLQ) for jobs that exhaust all retries
6. Instrument with structured logging: job ID, attempt number, duration, outcome
7. Add monitoring dashboards and alerts for queue depth and failure rates
8. Write tests that exercise the job handler in isolation (without the queue)

### Job Structure

```
Job Name:        [JOB_PURPOSE]
Queue:           default | priority | low-priority
Max Retries:     [RETRY_COUNT]
Backoff:         exponential (base 2, jitter 0-1s)
Timeout:         30 seconds (adjust per job)
Idempotency Key: [UNIQUE_IDENTIFIER]
```

### Idempotency Pattern

```
1. Receive job with idempotency key
2. Check if key exists in the processed-jobs store
3. If found → skip (log as duplicate)
4. If not found → process, then record the key with a TTL
```

## Variations

### Scheduled / Cron Jobs
Define recurring jobs using cron expressions (e.g. `0 2 * * *` for 2 AM daily).
Use a distributed lock (e.g. Redis SETNX) to prevent duplicate execution across nodes.
Store the schedule in configuration, not hard-coded in the application.

### Event-Driven Processing
Consume events from a message broker (Kafka, RabbitMQ, SNS/SQS).
Implement consumer groups for horizontal scaling.
Handle out-of-order delivery and ensure at-least-once processing.

### Batch Processing
Process large datasets in configurable batch sizes (e.g. 500 records per batch).
Use cursor-based pagination to avoid loading entire datasets into memory.
Implement checkpointing so interrupted batches can resume from where they stopped.

## Tips

- **Idempotency is mandatory**: Jobs will be delivered at least once. Design every handler to be safe for re-execution.
- **Dead letter queues**: Monitor the DLQ actively. Set up alerts when items land there. Include enough context in the job payload to diagnose failures.
- **Timeouts**: Set per-job timeouts shorter than the queue visibility timeout to prevent phantom processing.
- **Observability**: Track job duration percentiles (p50, p95, p99). Alert on queue depth exceeding a threshold.
- **Graceful shutdown**: Handle SIGTERM by finishing the current job before the process exits. Do not accept new jobs during shutdown.
- **Poison pill protection**: If a job fails immediately on every attempt, circuit-break the queue to protect downstream services.
- Keep job payloads small — store large data externally and reference it by ID.
- Never perform side effects (emails, webhooks) in a database transaction — defer them to a job.
