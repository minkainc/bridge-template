
# Adapters

The primary interface for the integration between ledger and external systems are adapters provided by the bridge SDK. In the template project we have two adapters which are necessary in order to implement a compliant integration using the two phase commit protocol. These are debits and credits adapters.

Each adapter has three functions: prepare, commit and abort. These functions are invoked when ledger calls two phase commit APIs on the bridge and they are responsible to make changes in the core systems of a participant. Each of these functions can call external systems and needs to return the final result of the operation. The bridge SDK validates incoming requests from ledger and formats responses based on the returned status.

## Asynchronous processing
All adapter handlers are processed as async operations using an internal job processor. This job processor allows users to delay or retry operations by retuning a special status called `Suspended`.

The return object also allows saving `state` when suspending a job, this state is going to be provided back to the handler when it is called again.

Jobs can be resumed manually by calling the `/jobs` REST API on the bridge. Alternatively, users can return an additional `suspendedUntil` property along with the status to instruct the scheduler to resume the job automatically.

## Prepare phase

The prepare function is used to implement the first phase of the protocol, the prepare phase. In prepare phase participants should validate the incoming operation and perform any actions needed to make sure that the operation can be successfully performed in their system. Participants can return errors in the first phase in case the operation cannot be performed.

After the operation is finished, we must notify the ledger using a proof. Proof is a signed object which contains a reference to the operation performed by the participant. This model allows us to have complete traceability of transaction processing, allows for automated reconciliation and makes the system very secure as well.

## Commit phase

After all participants have successfully prepared the operation, ledger contacts all participating bridges in order to commit the operation. Participants cannot fail in this phase, since they have already sent a proof that they are prepared to execute the operation.

In the commit phase the participant must finalize the operation and make sure that balances are correctly updated in their system.

## Abort phase

Similar to commit, abort is a final phase that can happen after an operation is prepared. Ledger aborts an operation in case there is an error in the prepare phase of transaction processing. Most common reason for aborting an operation is an error in one of the participants. This can happen for various reasons, for example insufficient user balance, fraud, technical errors, etc.

In the abort phase the operation must be completely rolled back. Any side-effects performed in the prepare phase must be reversed, for example if funds were reserved, they should be released here.

#
