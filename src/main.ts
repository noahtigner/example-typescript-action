import * as core from '@actions/core'
import { exec } from 'child_process'
import { wait } from './wait'

const getBranchName = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec('git branch --show-current --no-color', (err, stdout, stderr) => {
      if (err) {
        core.info(err.message)
        reject(err)
      }
      core.info(`stdout: ${stdout}`)
      core.info(`stderr: ${stderr}`)
      resolve(stdout.trim())
    })
  })
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')

    core.info(`Current branch is ${await getBranchName()}`)

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
