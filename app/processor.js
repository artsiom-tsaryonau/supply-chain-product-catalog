const superagent = require('superagent');
const cron = require('node-cron');

let queue = [];
cron.schedule('*/2 * * * * *', function () {
    if (queue.length > 0) {
        worker(queue.shift());
    }
});

function worker(task) {
    console.log('Processing task:', task.type);
    switch (task.type) {
        case 'PUT': {
            superagent
                .post(task.endpoint)
                .send(task.payload)
                .then(res => {
                    console.log(`Updated ${task.payload.id}`);
                })
                .catch(err => {
                    console.log(`Failed to update ${task.payload.id}`);
                    queue.push(task);
                });
            break;
        }
        case 'POST': {
            superagent
                .post(task.endpoint)
                .send(task.payload)
                .then(res => {
                    console.log(`Created ${task.payload.id}`);
                })
                .catch(err => {
                    console.log(`Failed to create ${task.payload.id}`);
                    queue.push(task);
                });
            break;
        }
        case 'DELETE': {
            superagent
                .delete(task.endpoint)
                .then(res => {
                    console.log(`Removed ${task.endpoint.substring(task.endpoint.length - 36)}`);
                })
                .catch(err => {
                    if (err.response.status == 404) {
                        console.log(`Not found ${task.endpoint.substring(task.endpoint.length - 36)}`);
                    } else {
                        console.log(`Removed ${task.endpoint.substring(task.endpoint.length - 36)}`);
                        queue.push(task);
                    }
                });
            break;
        }
    }
}

module.exports = { queue };