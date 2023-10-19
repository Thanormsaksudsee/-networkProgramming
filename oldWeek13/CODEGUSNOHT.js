const express = require('express');
const snmp = require('net-snmp');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <div>
            <input type="number" id="port" placeholder="port" value="1">
            <p id="output"></p>
            <button onclick="javascript:on()">On</button>
            <button onclick="javascript:off()">Off</button>
        </div>
        <div>
            <input type="number" id="port_bulk" placeholder="port_bulk" value="1">
            <p id="output_bluk"></p>
            <button onclick="javascript:bluk()">Sumit</button>
        </div>
        <script>
            function on() {
                const port = parseInt(document.getElementById("port").value);
                fetch("http://localhost:3000/set/" + port + "/1")
                .then(res => res.text()) // Parse the response as text
                .then(responseText => {
                    document.getElementById("output").innerText = responseText; // Update the output element with the response text
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
    
            function off() {
                const port = parseInt(document.getElementById("port").value);
                fetch("http://localhost:3000/set/" + port + "/2")
                .then(res => res.text()) // Parse the response as text
                .then(responseText => {
                    document.getElementById("output").innerText = responseText; // Update the output element with the response text
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }

            function bluk() {
                const port_bulk = parseInt(document.getElementById("port_bulk").value);
                fetch("http://localhost:3000/set/" + port_bulk)
                .then(res => res.text()) // Parse the response as text
                .then(responseText => {
                    document.getElementById("output_bluk").innerText = responseText; // Update the output element with the response text
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        </script>
    </body>
    </html>
    `)
})

app.get('/set/:port/:status', (req, res) => {
    const target = '192.168.1.100';
    const community = 'private';

    const oid = `1.3.6.1.2.1.2.2.1.7.${req.params.port}`;  // '1.3.6.1.2.1.2.2.1.7.1'; เปิด port 

    const ciscoContactInfoOid = `1.3.6.1.2.1.2.2.1.2.${req.params.port}`;

    const value = parseInt(req.params.status);

    const session = snmp.createSession(target, community, { timeout: 5000 });

    const varbinds = [
        { oid, type: snmp.ObjectType.Integer, value }
    ];

    session.set(varbinds, (error, varbinds) => {
        if (error) {
            console.error('Error setting SNMP values:', error);
        } else {
            console.log('SNMP set request successful');
            varbinds.forEach((vb) => {
                console.log(`${ vb.oid } = ${ vb.value }`);

            });
        }

    });

    const oids = [ciscoContactInfoOid];

    session.get(oids, (error, varbinds) => {
        if (error) {
            console.error(error);
        } else {
            varbinds.forEach((vb) => {
                if (value == 1){
                    res.send(`${vb.value} ON !!`);
                }else{
                    res.send(`${vb.value} OFF !!`);
                }
            });
        }
        session.close();
    });
    })

    app.get('/set/:port_bulk', (req, res) => {
        const target = '192.168.1.100';
        const community = 'public';
        const interfaceInfoOid = '1.3.6.1.2.1.2.2.1.2.';
        const numInterfaces = parseInt(req.params.port_bulk);
        const session = snmp.createSession(target, community);
    
        const getInterfaceInfo = (index) => {
            const interfaceOid = interfaceInfoOid + index;
    
            return new Promise((resolve, reject) => {
                session.get([interfaceOid], (error, varbinds) => {
                    if (error) {
                        reject(`Error querying interface ${index}: ${error}`);
                    } else {
                        const interfaceName = varbinds[0].value.toString();
                        console.log(`Interface ${index}: ${interfaceName}`);
                        resolve({ index, name: interfaceName });
                    }
                });
            });
        };
    
        const interfaceInfoPromises = Array.from({ length: numInterfaces }, (_, index) =>
            getInterfaceInfo(index + 1)
        );
    
        Promise.all(interfaceInfoPromises)
            .then((interfaceInfoList) => {
                const interfaceNames = interfaceInfoList.map(info => `Interface ${info.index}: ${info.name}`);
                console.log('All interfaces queried successfully.');
                res.send(interfaceNames.join('\n')); // Send all interface names in a single response
            })
            .catch((error) => {
                console.error(`Error querying interfaces: ${error}`);
                res.status(500).send('Error querying interfaces');
            })
            .finally(() => {
                session.close();
            });
    });
    

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});