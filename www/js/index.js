/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        var writeButton = document.getElementsByClassName("write-file")[0];
        writeButton.addEventListener('touchend', this.writeFile, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    // Use File plugin to create/overwrite a file
    writeFile: function() {
        console.log('Begin file writing...');
        var cssFileEntry;

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

        function gotFS(fileSystem) {
            console.log("Got fileSystem:", fileSystem.name);
            fileSystem.root.getFile("css-update.css", {create: true, exclusive: false}, gotFileEntry, fail);
        }

        function gotFileEntry(fileEntry) {
            console.log("Got file:", fileEntry.name, fileEntry.fullPath);
            cssFileEntry = fileEntry;
            fileEntry.createWriter(gotFileWriter, fail);
        }

        function gotFileWriter(writer) {
            // writer.seek(writer.length); // to append
            console.log("Writing...");
            writer.onwrite = function(evt) {
                console.log("write successful, now lets see what we wrote...");
                cssFileEntry.file(readAsText, fail);
                writer.truncate(writer.position); // clear any leftovers
                writer.onwriteend = function(evt) {
                    console.log("Trunicated");
                    cssFileEntry.file(readAsText, fail);
                };
            };
            text = window.prompt("What should we write?");
            writer.write(text || "some sample text");
        }
        function readAsText(file) {
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                console.log("Read as text:",'"'+evt.target.result+'"');
            };
            reader.readAsText(file);
        }

        function fail(error) {
            console.log(error.code);
        }
    }
};
