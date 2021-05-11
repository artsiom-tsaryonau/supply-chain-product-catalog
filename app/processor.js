const q = require('fastq')
const superagent = require('superagent');
const uuid = require('uuid');

const queue = q(worker, 1);

function worker(task, callback) {
    console.log('Processing task:', task.type, 'Task endpoint:', task.endpoint);
    switch (task.type) {
        case 'PUT': {
            superagent
                .post(task.end)
                .send(task.payload)
                .then(res => {
                    console.log('Task successfully done');
                })
                .catch(err => {
                    console.log('Failed to process task');
                });
            break;
        }
        case 'POST': {
            superagent
                .post(task.endpoint)
                .send(task.payload)
                .then(res => {
                    console.log('Task successfully done');
                })
                .catch(err => {
                    console.log('Failed to process task');
                });
            break;
        }
        case 'DELETE': {
            superagent
                .delete(task.endpoint)
                .then(res => {
                    console.log('Task successfully done');
                })
                .catch(err => {
                    console.log('Failed to process task');
                });
            break;
        }
    }
    console.log('Tasks in queue: ', queue.length());
}

module.exports = { queue };