---
name: Deployment Checklist
domain: devops
complexity: low
works-with: [task-orchestrator agent, /deploy command]
---

# Deployment Checklist Prompt

## When to Use

Use this prompt when you need a pre-deployment checklist to ensure all verification steps are covered before, during, and after deploying a service.

## The Prompt

```
Generate a comprehensive pre-deployment checklist for [SERVICE_NAME].

## Target Environment
[ENVIRONMENT]

## Dependencies
[DEPENDENCIES]

## Rollback Plan
[ROLLBACK_PLAN]

Create a checklist organised into these phases:

### Pre-Deployment
- [ ] All CI checks passing on the release branch
- [ ] Code reviewed and approved by required reviewers
- [ ] Database migrations tested against a copy of production data
- [ ] Environment variables and secrets configured for target environment
- [ ] Dependency versions pinned and vulnerability scan passing
- [ ] Release notes drafted with user-facing changes summarised
- [ ] Stakeholders notified of deployment window

### Deployment Execution
- [ ] Confirm deployment window with on-call engineer
- [ ] Enable maintenance mode or feature flags as needed
- [ ] Execute database migrations before application deployment
- [ ] Deploy application using the defined deployment strategy
- [ ] Monitor deployment progress and error rates in real time
- [ ] Verify health check endpoints are responding

### Post-Deployment Verification
- [ ] Run smoke tests against the deployed environment
- [ ] Verify key user journeys end-to-end
- [ ] Check application logs for unexpected errors or warnings
- [ ] Confirm metrics and dashboards reflect normal behaviour
- [ ] Validate external integrations are functioning
- [ ] Remove maintenance mode or update feature flags

### Rollback Criteria
- [ ] Error rate exceeds [X]% threshold within 15 minutes
- [ ] P0 or P1 incident raised within the deployment window
- [ ] Health checks failing for more than 5 minutes
- [ ] Data integrity issues detected
```

## Variations

### First Deployment
Append to the base prompt:
```
This is the first deployment of a new service. Additionally include:
- [ ] DNS records created and propagated
- [ ] TLS certificates provisioned and validated
- [ ] Load balancer and reverse proxy configuration verified
- [ ] Monitoring and alerting configured and tested
- [ ] Logging pipeline confirmed to be receiving events
- [ ] Access controls and IAM roles verified
- [ ] Runbooks created for common operational tasks
- [ ] On-call rotation updated to include the new service
```

### Database Migration Deployment
Append to the base prompt:
```
This deployment includes database schema changes. Additionally include:
- [ ] Migration tested on a production-size dataset for performance
- [ ] Backward-compatible migration confirmed (old code works with new schema)
- [ ] Migration rollback script tested and ready
- [ ] Database backup taken immediately before migration
- [ ] Query performance verified after migration with EXPLAIN plans
- [ ] Connection pool sized for migration load
- [ ] Lock duration estimated and communicated to stakeholders
```

### Hotfix Deployment
Append to the base prompt:
```
This is an urgent hotfix deployment. Adjust the checklist for speed:
- [ ] Root cause identified and fix verified in isolation
- [ ] Abbreviated review completed (minimum one reviewer)
- [ ] Fix cherry-picked to release branch (not merged from main)
- [ ] Regression test focused on the affected area
- [ ] Incident timeline updated with fix details
- [ ] Follow-up ticket created for comprehensive fix if this is a patch
- [ ] Post-incident review scheduled within 48 hours
```

## Tips

- Customise thresholds and timing to match your team's risk tolerance
- Automate as many checklist items as possible — manual checks drift over time
- Include rollback procedures as a first-class part of every deployment plan
- Run smoke tests that exercise real user flows, not just health endpoints
- Pair with the /deploy command to automate checklist verification steps
- Keep the checklist in version control alongside the service it describes
- Review and update the checklist after every incident caused by a deployment
