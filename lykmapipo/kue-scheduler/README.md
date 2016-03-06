# kue-scheduler

[![Build Status](https://travis-ci.org/lykmapipo/kue-scheduler.svg?branch=master)](https://travis-ci.org/lykmapipo/kue-scheduler)

A job scheduler utility for [kue](https://github.com/Automattic/kue), backed by [redis](http://redis.io) and built for [node.js](http://nodejs.org)

Scheduling API is heavily inspired and borrowed from [agenda](https://github.com/rschmukler/agenda) and others.

*Note!: expiry key notification are now enabled by default, if provided kue options has a permission to do so*

## Requirements
- Redis 2.8.0 or higher.

- [kue 0.9.3+](https://github.com/Automattic/kue)

- If `kue-scheduler` failed to enable keyspace notification(s) automatic, then you have to enable them using `redis-cli` 
```sh
$ redis-cli config set notify-keyspace-events Ex
```


## Installation
```
$ npm install --save async lodash kue kue-scheduler
```

## Usage


### Schedule a non unique job to run every after specified time interval
Use this if you want to maintain different(multiple) job instances on every run

Example `schedule a job to run every two seconds from now`
```js
var kue = require('kue-scheduler');
var Queue = kue.createQueue();

//create a job instance
var job = Queue
            .createJob('every', data)
            .attempts(3)
            .backoff(backoff)
            .priority('normal');

//schedule it to run every 2 seconds
Queue.every('2 seconds', job);


//somewhere process your scheduled jobs
Queue.process('every', function(job, done) {
    ...
    done();
});
```

### Schedule a unique job to run every after specified time interval
Use this if you want to maintain a single job instance on every run.

Example `schedule a job to run every two seconds from now`
```js
var kue = require('kue-scheduler');
var Queue = kue.createQueue();

//create a job instance
var job = Queue
            .createJob('unique_every', data)
            .attempts(3)
            .backoff(backoff)
            .priority('normal')
            .unique('unique_every');

//schedule it to run every 2 seconds
Queue.every('2 seconds', job);


//somewhere process your scheduled jobs
Queue.process('unique_every', function(job, done) {
    ...
    done();
});
```

### Schedule a non unique job to run only once after specified interval elapsed
Use this if you want to maintain different(multiple) job instances on every run

Example `schedule a job to run only once two seconds from now`
```js
var kue = require('kue-scheduler');
var Queue = kue.createQueue();

//create a job instance
var job = Queue
            .createJob('schedule', data)
            .attempts(3)
            .backoff(backoff)
            .priority('normal');

//schedule it to run once 2 seconds from now
Queue.schedule('2 seconds from now', job);


//somewhere process your scheduled jobs
Queue.process('shedule', function(job, done) {
    ...
    done();
});
```

### Schedule a unique job to run only once after specified interval elapsed
Use this if you want to maintain a single job instance on every run.

Example `schedule a job to run only once two seconds from now`
```js
var kue = require('kue-scheduler');
var Queue = kue.createQueue();

//create a job instance
var job = Queue
            .createJob('unique_schedule', data)
            .attempts(3)
            .backoff(backoff)
            .priority('normal')
            .unique('unique_schedule');

//schedule it to run once 2 seconds from now
Queue.schedule('2 seconds from now', job);


//somewhere process your scheduled jobs
Queue.process('unique_shedule', function(job, done) {
    ...
    done();
});
```


### Schedule a job to run now
```js
var kue = require('kue-scheduler');
var Queue = kue.createQueue();

//create a job instance
var job = Queue
            .createJob('now', data)
            .attempts(3)
            .backoff(backoff)
            .priority('normal');

//schedule it to run now
Queue.now(job);


//somewhere process your scheduled jobs
Queue.process('now', function(job, done) {
    ...
    done();
});
```

## API

### `enableExpiryNotifications()`
Enable `redis key expiry notifications`.

Example
```js
var kue = require('kue-scheduler');
var Queue = kue.createQueue();

//enable expiry key notifications
Queue.enableExpiryNotifications();
```

### `every(interval, job)`
Runs a given `job instance` every after a given `interval`. If `unique key` is provided only single instance job will exists otherwise on every run new job istance will be used.

`interval` can either be a [human-interval](https://github.com/rschmukler/human-interval) `String` format or a [cron](https://github.com/ncb000gt/node-cron) `String` format.

```js
var kue = require('kue-scheduler');
var Queue = kue.createQueue();

//create a job instance
var job = Queue
            .createJob('every', data)
            .attempts(3)
            .backoff(backoff)
            .priority('normal');

//schedule it to run every 2 seconds
Queue.every('2 seconds', job);


//somewhere process your scheduled jobs
Queue.process('every', function(job, done) {
    ...
    done();
});
```


### `schedule(when, job)`
Schedules a given `job instance` to run once at a given time. `when` can either be a `Date instance` or a [date.js](https://github.com/matthewmueller/date) `String` such as `tomorrow at 5pm`. If `unique key` is provided only single instance job will exists otherwise on every run new job istance will be used.

```js
var kue = require('kue-scheduler');
var Queue = kue.createQueue();

//create a job instance
var job = Queue
            .createJob('schedule', data)
            .attempts(3)
            .backoff(backoff)
            .priority('normal');

//schedule it to run once 2 seconds from now
Queue.schedule('2 seconds from now', job);


//somewhere process your scheduled jobs
Queue.process('shedule', function(job, done) {
    ...
    done();
});
```

### `now(job)`
Schedules a given `job instance` to run once immediately.

```js
var kue = require('kue-scheduler');
var Queue = kue.createQueue();

//create a job instance
var job = Queue
            .createJob('now', data)
            .attempts(3)
            .backoff(backoff)
            .priority('normal');

//schedule it to run now
Queue.now(job);

//somewhere process your scheduled jobs
Queue.process('now', function(job, done) {
    ...
    done();
});
```

## Events
Currently the only way to interact with `kue-scheduler` is through its events. `kue-scheduler` fires `schedule error`, `schedule success`, `already scheduled` and `scheduler unknown job expiry key` events.

### `schedule error`
Use it to interact with `kue-scheduler` to get notified when an error occur.

```js
//listen on scheduler errors
Queue.on('schedule error', function(error) {
    ...
});

var job = Queue
    .createJob('now', data)
    .attempts(3)
    .backoff(backoff)
    .priority('normal');

Queue.now(job);
```

### `schedule success`
Use it to interact with `kue-scheduler` to obtained instance of current scheduled job. 

*Note: Use this event to attach instance level job events* 

```js
//listen on success scheduling
Queue.on('schedule success', function(job) {
    ...
});

var job = Queue
    .createJob('now', data)
    .attempts(3)
    .backoff(backoff)
    .priority('normal');

Queue.now(job);
```

### `already scheduled`
Use it to interact with `kue-scheduler` to be notified if the current instance of job is unique and already schedule to run.

*Note: Use this event to attach instance level job events* 

```js
//listen alrady scheduled jobs
Queue.on('already scheduled', function(job) {
    ...
});

var job = Queue
    .createJob('now', data)
    .attempts(3)
    .backoff(backoff)
    .priority('normal');

Queue.now(job);
```

### `scheduler unknown job expiry key`
Fired when `kue-scheduler` receive unknown key event from redis. Use it to be notified on unknown key(s) events.

```js
Queue
    .on('scheduler unknown job expiry key', function(message) {

        expect(Queue._isJobExpiryKey(message)).to.be.false;

    });
```


## Testing
* Clone this repository

* Install all development dependencies
```sh
$ npm install
```

* Then run test
```sh
$ npm test
```

## Contribute
It will be nice, if you open an issue first so that we can know what is going on, then, fork this repo and push in your ideas. Do not forget to add a bit of test(s) of what value you adding.


## TODO
- [x] Scheduler restart after shutdown
- [x] Reschedule/scan jobs on restart
- [ ] Test multi process scheduler
- [x] Support unique reccur jobs


## License 

(The MIT License)

Copyright (c) 2011 lykmapipo && Contributors

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.