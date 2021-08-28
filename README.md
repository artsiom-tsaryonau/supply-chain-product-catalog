# supply-chain-product-catalog
Product catalog with supply chain API. !!! DOES NOT REPRESENT THE CURRENT STATE !!!

# run
To run tests

```npm test```

To run app

```npm start```

# Overview
According to the specification supply chain provides GET/POST/DELETE endpoints. GET allows to retrieve all the products from the chain and a single product by id. POST allows to create a new product in the chain. DELETE allows to delete the product by the id. Aside that, the supply chain throws errors on random basis.

According to the requirements we need to list products, add products, update products and remove products. Essentially those are GET/POST/PUT/DELETE methods in REST. Current implementation of the supply chain provides us with the ability to list (GET), add (POST) and remove (DELETE) the products. In addition to that POST method behaves like PUT one - it updates the existing object if the provided id is the same as the existing one. So API requirements can be fullfilled by mapping GET to GET, POST to POST, PUT to POST and DELETE to DELETE. 

Accoding to the requirements multiple clients can simultaneously perform operations on the products. Considering that GET operation does not alter the internal state of the application we can separate that operation into a simple flow where GET performs direct retrievals upon the request. Operations that alter the internal state - PUT, POST, DELETE - will be enqueued as small tasks or events and executed one after another by the scheduler. The client receives the response that the request is enqueued without further clarifications.

As the supply chain API throws errors on random basis, then all GET requests will provide the immediate information to the client that some issue happened on the backend. PUT, POST, DELETE operations are enqueued so in a case of any failure the failed tasks are simply moved to the end of the queue. Processor will attempt to execute the task again later. Due to usage of the queue, the server is not blocked so it can enqueue the incoming PUT, POST, DELETE requests even if the underlining service is down. 

# Consideration
- The application has the foundation for the scalability and fault tolerancy, but it doesn't implement it fully
    - Application uses in-memory queue based on the array. For the better scalability it should be decoupled - ideally - by using the real message broker
    - Processing of the messages can be moved into a separate application so the running application would not waste cycles on processing the messages and will only send the messages to the broker
    - Existing COMMAND and QUERY segregation can be further split into separate  applications under the single API gateway, so it would make the application modules smaller
    - Currently application returns error message for QUERY requests, but ideally it might be better to fallback to a cached version or some snapshot of the last state of the product list
    - It can further split into a set of independent small applications
# Notes
- Supply chain API fully replaces the object if it contains the id. I do not provide the mechanism for merging the objects so the partial objects - that doesn't contain all the fields - will be fully replaced
- Tests rely on the real backend thus they sometimes fail due to unpredictable behavior of the underline API
- I hardcoded existing product id in the config.json file so it needs to be checked before execution of the tests
# API

<h2>Default behavior</h2>
<table>
    <tr>
        <th>Type</th>
        <th>Endpoint</th>
        <th>Payload</th>
        <th>Code</th>
        <th>Response</th>
    </tr>
    <tr>
        <td>GET</td>
        <td><i>/api/product</i></td>
        <td></td>
        <td>200</td>
        <td><pre>
{
    "code": "Done",
    "content": {
        "bundle": [
            {
                "quantity": 1,
                "id": "1234",
                "price": 0,
                "name": "OHDGYevAiE"
            }
        ]
    }
}`
        </pre></td>
    </tr>
    <tr>
        <td>GET</td>
        <td><i>/api/product/12345</i></td>
        <td></td>
        <td>200</td>
        <td><pre>
{ 
    "code": "Done", 
    "content": {
        "quantity": 1, 
        "id": "12345", 
        "price": 0,  
        "name": "OHDGYevAiE" 
    } 
}
        </pre></td>
    </tr>
    <tr>
        <td>POST</td>
        <td><i>/api/product</i></td>
        <td><pre>
{
    "quantity": 1,
    "price": 100,
    "name": "mqmSrgBKbv00002"
}
        </pre></td>
        <td>201</td>
        <td><pre>
{
    "code": "Enqueued",
    "content": {
        "id": "12345",
        "quantity": 1,
        "price": 100,
        "name": "mqmSrgBKbv00002"
    }
}
        </pre></td>
    </tr>
    <tr>
        <td>PUT</td>
        <td><i>/api/product/{id}</i></td>
        <td><pre>
{
    "id": "12345",
    "quantity": 1,
    "price": 100,
    "name": "mqmSrgBKbv00002"
}
        </pre></td>
        <td>200</td>
        <td><pre>
{
    "code": "Enqueued",
    "content": {
        "id": "12345",
        "quantity": 1,
        "price": 100,
        "name": "mqmSrgBKbv00002"
    }
}
        </pre></td>
    </tr>
        <tr>
        <td>DELETE</td>
        <td><i>/api/product/{id}</i></td>
        <td></td>
        <td>204</td>
        <td></td>
    </tr>
</table>

<h2>Errors</h2>
<table>
    <tr>
        <th>Code</th>
        <th>Response</th>
    </tr>
    <tr>
        <td>404</td>
        <td><pre>{
    "code": "Done",
    "message": "Resource not found"
}</pre></td>
    </tr>
    <tr>
        <td>500</td>
        <td><pre>{
    "code": "Error",
    "message": "Failed to process request. Try again later."
}</rep></td>
    </tr>
</table>

# Improvements
- introduce authentication
- introduce caching for the products
- introduce object merge for partial updates
- introduce external messaging processing systems 
- introduce dead letter queue to store the messages that failed to be processed
- introduce logging
- introduce domain model instead of adhoc JSON conversions
- introduce pagination for product lists
- introduce unit testing rather than relying on real server for API testing
- introduce code documentation rather than comments
- introduce fallbacks in case of API failures if needed

# Note
!!!! ./aws/credentials file doesn't work! You have to set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY !!!!