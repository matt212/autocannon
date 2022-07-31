'use strict'

const http = require('http')
const autocannon = require('../autocannon')

const server = http.createServer(serverhandler)

server.listen(0, startBench)
const customResponse = { rows: [{ employeesid: 20667909, first_name: 'joi', last_name: 'baker', gender: 'M', birth_date: '2020-01-02T00:00:00.000Z', recordstate: true, created_date: '2020-12-06T09:17:39.413Z', updated_date: '2020-12-06T09:17:39.413Z' }] }
function serverhandler (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.writeHead(200)
  res.end(customResponse)
}
const customRequest = { rows: 'no data' }

// let customResponse=`{"message": "This is a JSON response"}`
function startBench () {
  const url = 'http://localhost:' + server.address().port

  const instance = autocannon({
    url,
    amount: 10,
    connections: 10,
    pipelining: 1,
    // duration: 60,
    method: 'POST',
    debug: true,
    expectBody: customResponse,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customRequest)

  }, (err, result) => {
    console.log(err)
    if (err != null) return // or do some error handling
    handleResults(result)
  })
  instance.on('done', handleResults)
  autocannon.track(instance, { renderResultsTable: true, renderLatencyTable: true, renderProgressBar: true })
}

function handleResults (data) {
  // console.log("--------------------------")

  // console.log(data.url)
  console.log('errors :' + data.errors)
  console.log('timeouts : ' + data.timeouts)
  console.log('non2xx :' + data.non2xx)
  console.log('resets :' + data.resets)
  console.log('3xx :' + data['3xx'])
  console.log('4xx :' + data['4xx'])
  console.log('2xx :' + data['2xx'])
  console.log('5xx :' + data['5xx'])
}
