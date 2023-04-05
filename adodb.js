module.exports = function(RED) {
    "use strict";
    var reconnect = RED.settings.sqliteReconnectTime || 20000;
    // var sqlite3 = require('sqlite3');
    const ADODB = require('node-adodb');

    function AdodbNodeDB(n) {
        RED.nodes.createNode(this,n);

        this.dbname = n.db;

        var node = this;

        node.doConnect = function() {
            if (node.db) { return; }


            node.db = ADODB.open(node.dbname);

        }

        node.on('close', function (done) {

            done()
        });
    }
    RED.nodes.registerType("adodb_db",AdodbNodeDB);


    function AdodbNodeIn(n) {
        RED.nodes.createNode(this,n);
        this.mydb = n.mydb;
        this.sqlquery = n.sqlquery||"msg.topic";
        this.sql = n.sql;
        this.mydbConfig = RED.nodes.getNode(this.mydb);
        var node = this;
        node.status({});

        if (node.mydbConfig) {
            node.mydbConfig.doConnect();
            node.status({fill:"green",shape:"dot",text:this.mydbConfig.mod});
            var bind = [];

            var doQuery = function(msg) {
                bind = []
                if (node.sqlquery == "viaMsgTopicWithResponse") {
                    if (typeof msg.topic === 'string') {
                        if (msg.topic.length > 0) {

                            async function query() {
                                console.log(msg.topic)
                                try {
                                    const response = await node.mydbConfig.db.query(msg.topic);
                                    msg.payload = response;
                                    node.send(msg);
                                } catch (error) {
                                    node.error(error);
                                    node.error(error.process)
                                    console.error(error);
                                }
                            }

                            query();
                        }
                    }
                    else {
                        node.error("msg.topic : the query is not defined as a string",msg);
                        node.status({fill:"red",shape:"dot",text:"msg.topic error"});
                    }
                }


                if (node.sqlquery == "viaMsgTopicWithoutResponse") {
                    if (typeof msg.topic === 'string') {
                        if (msg.topic.length > 0) {

                            async function query() {
                                console.log(msg.topic)
                                try {
                                    const response = await node.mydbConfig.db.execute(msg.topic);
                                    msg.payload = response;
                                    node.send(msg);
                                } catch (error) {
                                    node.error(error);
                                    node.error(error.process)
                                    console.error(error);
                                }
                            }

                            query();
                        }
                    }
                    else {
                        node.error("msg.topic : the query is not defined as a string",msg);
                        node.status({fill:"red",shape:"dot",text:"msg.topic error"});
                    }
                }

                if (node.sqlquery == "queryWithResponse") {
                    if (typeof node.sql === 'string') {
                        if (node.sql.length > 0) {

                            // some removed

                            async function query() {
                                try {
                                    const response = await node.mydbConfig.db.query(node.sql);

                                    msg.payload = response;
                                    node.send(msg);
                                } catch (error) {
                                    node.error(error)
                                    node.error(error.process);
                                    console.error(error);
                                }
                            }

                            query();
                        }
                    }
                    else {
                        if (node.sql === null || node.sql == "") {
                            node.error("SQL statement config not set up",msg);
                            node.status({fill:"red",shape:"dot",text:"SQL config not set up"});
                        }
                    }
                }


                if (node.sqlquery == "queryWithoutResponse") {
                    if (typeof node.sql === 'string') {
                        if (node.sql.length > 0) {

                            // some removed

                            async function query() {
                                try {
                                    const response = await node.mydbConfig.db.execute(node.sql);

                                    // msg.payload = response;
                                    node.send(msg);
                                } catch (error) {
                                    node.error(error)
                                    node.error(error.process);
                                    console.error(error);
                                }
                            }

                            query();
                        }
                    }
                    else {
                        if (node.sql === null || node.sql == "") {
                            node.error("SQL statement config not set up",msg);
                            node.status({fill:"red",shape:"dot",text:"SQL config not set up"});
                        }
                    }
                }
               
            }

            node.on("input", function(msg) {
                if (msg.hasOwnProperty("extension")) {
                    node.mydbConfig.db.loadExtension(msg.extension, function(err) {
                        if (err) { node.error(err,msg); }
                        else { doQuery(msg); }
                    });
                }
                else { doQuery(msg); }
            });
        }
        else {
            node.error("Sqlite database not configured");
        }
    }
    RED.nodes.registerType("adodb",AdodbNodeIn);
}
