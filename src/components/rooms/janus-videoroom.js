import Janus from "../../janus-2021.js";
import React, { Component } from "react";
import $ from "jquery";
import { socket } from "../../socket.js";

export function vsessionCreate(room) {
  var self = this;
  Janus.init({
    debug: "none",
    callback: function () {
      // Create session
      var janus = new Janus({
        server: self.state.server,
        success: function () {
          // Attach to VideoRoom plugin
          janus.attach({
            plugin: "janus.plugin.videoroom",
            opaqueId: self.state.opaqueId,
            success: function (pluginHandle) {
              //sfutest = pluginHandle;
              self.setState({ janus: janus });
              self.setState({ sfutest: pluginHandle });
              Janus.log(
                "Plugin attached! (" +
                  self.state.sfutest.getPlugin() +
                  ", id=" +
                  self.state.sfutest.getId() +
                  ")"
              );
              Janus.log("  -- This is a publisher/manager");
              self.vregisterUsername(room);
              initDevices()
              // Prepare the username registration
            },
            error: function (error) {
              Janus.error("  -- Error attaching plugin...", error);
            },
            consentDialog: function (on) {
              Janus.debug(
                "Consent dialog should be " + (on ? "on" : "off") + " now"
              );
            },
            iceState: function (state) {
              Janus.log("ICE state changed to " + state);
            },
            mediaState: function (medium, on) {
              Janus.log(
                "Janus " +
                  (on ? "started" : "stopped") +
                  " receiving our " +
                  medium
              );
            },
            webrtcState: function (on) {
              Janus.log(
                "Janus says our WebRTC PeerConnection is " +
                  (on ? "up" : "down") +
                  " now"
              );
            },
            onmessage: function (msg, jsep) {
              Janus.debug(" ::: Got a message (publisher) :::", msg);
              var event = msg["videoroom"];
              Janus.debug("Event: " + event);
              if (event) {
                if (event === "joined") {
                  // Publisher/manager created, negotiate WebRTC and attach to existing feeds, if any
                  //myid = msg["id"];
                  //mypvtid = msg["private_id"];
                  self.setState({
                    myVroomId: msg["id"],
                    vJoined: true,
                  });
                  Janus.log(
                    "Successfully joined room " +
                      msg["room"] +
                      " with ID " +
                      msg["id"]
                  );
                  self.addParticipant(
                    msg["id"],
                    self.state.fullname + "§" + self.state.userUUID
                  );
                  if (
                    self.state.reloadParams &&
                    self.state.reloadParams["cam"]
                  ) {
                    self.ionRequestRoom();
                  }
                  //publishOwnFeed(true);
                  //}
                  // Any new feed to attach to?
                  if (msg["publishers"]) {
                    var list = msg["publishers"];
                    Janus.debug(
                      "Got a list of available publishers/feeds:",
                      list
                    );
                    for (var f in list) {
                      console.log("List >>", list);
                      var id = list[f]["id"];
                      var display = list[f]["display"];
                      var audio = list[f]["audio_codec"];
                      var video = list[f]["video_codec"];
                      Janus.debug(
                        "  >> [" +
                          id +
                          "] " +
                          display +
                          " (audio: " +
                          audio +
                          ", video: " +
                          video +
                          ")"
                      );
                      self.vAddParticipant(list[f]["id"], list[f]["display"]);
                      self.vNewRemoteFeed(id, display, audio, video);
                    }
                  }
                } else if (event === "destroyed") {
                  // The room has been destroyed
                  Janus.warn("The room has been destroyed!");
                } else if (event === "event") {
                  // Any new feed to attach to?
                  if (msg["publishers"]) {
                    var list = msg["publishers"];
                    Janus.debug(
                      "Got a list of available publishers/feeds:",
                      list
                    );
                    for (var f in list) {
                      var id = list[f]["id"];
                      var display = list[f]["display"];
                      var audio = list[f]["audio_codec"];
                      var video = list[f]["video_codec"];
                      console.log(list);
                      Janus.debug(
                        "  >> [" +
                          id +
                          "] " +
                          display +
                          " (audio: " +
                          audio +
                          ", video: " +
                          video +
                          ")"
                      );
                      self.vAddParticipant(list[f]["id"], list[f]["display"]);
                      self.vNewRemoteFeed(id, display, audio, video);
                    }
                  } else if (msg["leaving"]) {
                    // One of the publishers has gone away?
                    var leaving = msg["leaving"];
                    console.log("Publisher leaving: " + leaving);
                    self.setState(
                      {
                        feeds: self.state.feeds.filter(
                          (item) => item.rfid != leaving
                        ),
                      },
                      () => console.log("feeds: >>>>", self.state.feeds)
                    );
                    var unPublishedFeed = self.state.feeds.filter(
                      (item) => item.rfid === leaving
                    );
                    var remoteFeed = unPublishedFeed.shift();
                    if (remoteFeed != null) {
                      remoteFeed.detach();
                    }
                    self.removeParticipant(leaving);
                  } else if (msg["unpublished"]) {
                    // One of the publishers has unpublished?
                    var unpublished = msg["unpublished"];
                    console.log("Publisher left: " + unpublished);
                    if (unpublished === "ok") {
                      self.state.sfutest.hangup();
                      self.vStreamDettacher(self.state.sfutest);
                      return;
                    }
                    var unPublishedFeed = self.state.feeds.filter(
                      (item) => item.rfid === unpublished
                    );
                    var remoteFeed = unPublishedFeed.shift();
                    if (remoteFeed != null) {
                      remoteFeed.detach();
                      self.vStreamDettacher(remoteFeed);
                    }
                    self.removeParticipant(unpublished);

                    self.setState({
                      feeds: self.state.feeds.filter(
                        (item) => item.rfid != unpublished
                      ),
                    });
                  } else if (msg["error"]) {
                    if (msg["error_code"] === 426) {
                      // This is a "no such room" error: give a more meaningful description
                    } else {
                    }
                  }
                }
              }
              if (jsep) {
                Janus.debug("Handling SDP as well...", jsep);
                self.state.sfutest.handleRemoteJsep({ jsep: jsep });
              }
            },
            onlocalstream: function (stream) {
              Janus.debug(" ::: Got a local stream :::", stream);
              console.log(" ::: Got a local stream :::", stream);
              console.log(self.state.sfutest.id);
              var exisiting = self.state.feeds.filter(
                (item) => item.id === self.state.sfutest.id
              );
              if (exisiting.length === 0) {
                self.state.sfutest.rfid = self.state.myVroomId;
                self.setState({
                  feeds: self.state.feeds.concat(self.state.sfutest),
                });
              }

              var videoTracks = stream.getVideoTracks();
              console.log('onlocalstream', videoTracks)
              if (!videoTracks || videoTracks.length === 0) {
                self.vStreamDettacher(self.state.sfutest);
              } else {
                console.log(self.state.vparticipants);
                self.vStreamAttacher(self.state.sfutest);
              }
            },
            onremotestream: function (stream) {
              // The publisher stream is sendonly, we don't expect anything here
            },
            oncleanup: function () {
              Janus.log(
                " ::: Got a cleanup notification: we are unpublished now :::"
              );
            },
          });
        },
        error: function (error) {
          Janus.error(error);
          //bootbox.alert(error, function() {
          var params = "";
          if (self.state.publishedCamera) {
            params = params + "?cam=true&roomId=" + self.state.slot;
          }
          if (!self.state.muted) {
            params = params + "&mic=true";
          }
          if (params === "") {
            var bar = self.getJsonFromUrl(self.$f7.view[0].history[0]);
            params = params + "?cam=" + bar["cam"] + "&mic=" + bar["mic"];
          }
          //console.log('%%%%%%%%%%%%%%%', params)
          window.location.replace("http://localhost:3000/" + params);
          //});
        },
        destroyed: function () {
          window.location.reload();
        },
      });
    },
  });
}

export function vNewRemoteFeed(id, feeds, display, audio, video) {
  var self = this;
  // A new feed has been published, create a new plugin handle and attach to it as a subscriber
  var remoteFeed = null;
  self.state.janus.attach({
    plugin: "janus.plugin.videoroom",
    opaqueId: this.state.opaqueId,
    success: function (pluginHandle) {
      remoteFeed = pluginHandle;
      remoteFeed.simulcastStarted = false;
      Janus.log(
        "Plugin attached! (" +
          remoteFeed.getPlugin() +
          ", id=" +
          remoteFeed.getId() +
          ")"
      );
      Janus.log("  -- This is a subscriber");
      // We wait for the plugin to send us an offer
      var subscribe = {
        request: "join",
        room: 1234,
        ptype: "subscriber",
        pin: self.state.pin,
        feed: id,
        private_id: self.state.mypvtid,
      };
      // In case you don't want to receive audio, video or data, even if the
      // publisher is sending them, set the 'offer_audio', 'offer_video' or
      // 'offer_data' properties to false (they're true by default), e.g.:
      // 		subscribe["offer_video"] = false;
      // For example, if the publisher is VP8 and this is Safari, let's avoid video
      if (
        Janus.webRTCAdapter.browserDetails.browser === "safari" &&
        (video === "vp9" || (video === "vp8" && !Janus.safariVp8))
      ) {
        if (video) video = video.toUpperCase();
        console.log(
          "Publisher is using " +
            video +
            ", but Safari doesn't support it: disabling video"
        );
        subscribe["offer_video"] = false;
      }
      //subscribe["offer_video"] = false;
      remoteFeed.videoCodec = video;
      remoteFeed.send({ message: subscribe });
    },
    error: function (error) {
      Janus.error("  -- Error attaching plugin...", error);
      window.alert("Error attaching plugin... " + error);
    },
    onmessage: function (msg, jsep) {
      Janus.debug(" ::: Got a message (subscriber) :::", msg);
      var event = msg["videoroom"];
      Janus.log("Event: " + event);

      if (msg["error"]) {
        window.alert(msg["error"]);
      } else if (event) {
        if (event === "attached") {
          remoteFeed.rfid = msg["id"];
          remoteFeed.rfdisplay = msg["display"];
          self.setState({ feeds: self.state.feeds.concat(remoteFeed) }, () =>
            console.log("@@@@", self.state.feeds)
          );

          if (!video) {
            self.vStreamDettacher(remoteFeed);
          }

          Janus.log(
            "Successfully attached to feed " +
              remoteFeed.rfid +
              " (" +
              remoteFeed.rfdisplay +
              ") in room " +
              msg["room"]
          );
        } else if (event === "event") {
        } else {
          // What has just happened?
        }
      }
      if (jsep) {
        Janus.log("Handling SDP as well...", jsep);
        remoteFeed.createAnswer({
          jsep: jsep,
          // Add data:true here if you want to subscribe to datachannels as well
          // (obviously only works if the publisher offered them in the first place)
          media: { audioSend: false, videoSend: false, data: false }, // We want recvonly audio/video
          success: function (jsep) {
            Janus.log("Got SDP!", jsep);
            var body = { request: "start", room: self.state.roomId };
            remoteFeed.send({ message: body, jsep: jsep });
          },
          error: function (error) {
            Janus.log("WebRTC error:", error);
            window.alert("WebRTC error... " + error.message);
          },
        });
      }
    },
    iceState: function (state) {
      Janus.log(
        "ICE state of this WebRTC PeerConnection (feed #" +
          remoteFeed.rfid +
          ") changed to " +
          state
      );
    },
    webrtcState: function (on) {
      Janus.log(
        "Janus says this WebRTC PeerConnection (feed #" +
          remoteFeed.rfid +
          ") is " +
          (on ? "up" : "down") +
          " now"
      );
      if (on === "down") {
        self.vremoveParticipant(remoteFeed.rfid);
      }
    },
    onlocalstream: function (stream) {
      console.log(">>>>>>>>>>>", stream);
    },
    onremotestream: function (stream) {
      console.log(">>>>>>>>>>>", stream);
      self.vStreamAttacher(remoteFeed);
    },
    ondata: function (data) {},
    oncleanup: function () {
      Janus.log(" ::: Got a cleanup notification (remote feed " + id + ") :::");
    },
  });
}

export function vregisterUsername(room) {
  var self = this;
  var register = {
    request: "join",
    room: 1234,
    ptype: "publisher",
    //pin: self.state.pin,
    display:
      self.state.fullname +
      " §" +
      self.state.userUUID +
      "§" +
      self.state.userColor +
      "§" +
      self.state.slot,
  };
  self.state.sfutest.send({ message: register });
  //self.setState({ myVroomId: self.state.mixertest.id });
}

export function vChangeUsername(room) {
  var self = this;
  var register = {
    request: "configure",
    room: 1234,
    ptype: "publisher",
    //pin: self.state.pin,
    display:
      self.state.fullname +
      " §" +
      self.state.userUUID +
      "§" +
      self.state.userColor +
      "§" +
      self.state.slot,
  };
  self.state.sfutest.send({ message: register });
  //self.setState({ myVroomId: self.state.mixertest.id });
}

export function vStreamAttacher(feed) {
  var self = this;
  console.log("Attaching " + feed.id);
  console.log($("#video-" + feed.id));
  if ($("#video-" + feed.id).length == 0) {
    var localVideo = document.createElement("video");
    localVideo.autoplay = true;
    localVideo.muted = true;
    //localVideo.width = "initial";
    localVideo.id = "video-" + feed.id;
    $('#Dish').append("<div id='d-"+ feed.id +"' class='Camera'></div>");  
     
  }
  
  
  //$("#video-" + feed.id).show();
  if (localVideo) $("#d-"+ feed.id).append(localVideo);
  if (feed.id && feed.webrtcStuff && feed.webrtcStuff.remoteStream) {
    self.setState({ vActive: true });
    //if (localVideo) $("#remoteVideos").append(localVideo);
    Janus.attachMediaStream(
      document.getElementById("video-" + feed.id),
      feed.webrtcStuff.remoteStream
    );
    self.disher();
  }
  if (feed.id && feed.webrtcStuff && feed.webrtcStuff.myStream) {
    //if (localVideo) $("#selfVideos").append(localVideo);
    $("#videoLoaderIcon").hide();
    $("#videoLoaderIcon2").hide();
    
    $("#disableVideo").show();
    Janus.attachMediaStream(
      document.getElementById("video-" + feed.id),
      feed.webrtcStuff.myStream
    );
    self.disher();
    
  }
  $("#video-" + feed.id).css('width', 'inherit'); 
}

export function vStreamDettacher(feed) {
  if (feed.id) {
    //console.log("Dettaching " + feed.id);
    $("#video-" + feed.id).remove();
    $("#d-" + feed.id).remove();
    this.disher();
  }
}

export function vremoveParticipant(id) {
  var self = this;
  self.setState({
    vparticipants: self.state.vparticipants.filter((item) => item.id !== id),
  });
}

export function vAddParticipant(id, p) {
  //console.log("Adding Participants ...", id, p);
  var self = this;
  var participant = p.split("§");
  if (this.exisitingParticipant(participant[1])) {
    self.setState({
      vparticipants: self.state.vparticipants.concat({
        id: id,
        display: participant[0],
        uuid: participant[1],
        userColor: participant[2],
        role: "listener",
        current: "stopped-talking",
      }),
    });
  }
  //console.log("participant added:", participant[1]);
}

export function publishCamera(bitrate = 16, deviceId = null) {
  var self = this;
  var video = true;
  var device = true;
  if (!self.state.isAdmin) {
    video = { width: 180, height: 151 };
    
  } 
  if (self.state.slot === '0') {
    video = "hires-16:9"
  }
  if(deviceId){
    device = {deviceId: { exact: deviceId}}
  }
  self.state.sfutest.createOffer({
    media: {
      audioRecv: false,
      videoRecv: false,
      data: false,
      videoSend: true,
      audioSend: false,
      video: video,
      video: device,
    },

    success: function (jsep) {
      Janus.debug("********* Got publisher SDP!", jsep);
      console.log("switching to " + bitrate);
      if (jsep) {
        var publish = {
          request: "configure",
          audio: false,
          video: true,
          //video:{width: 180, height: 180},
          data: false,
          bitrate: bitrate * 8000,
          bitrate_cap: true,
          //videocodec: "vp8",
        };
        self.state.sfutest.send({ message: publish, jsep: jsep });
      }
      self.setState({ publishedCamera: true });
      $("#camera-spinner").hide();
      $("#camera-off").show();
      $("#camera-off").css('color', 'black');
      console.log("ID: >>>", self.state.sfutest.id);
      socket.emit("ionSetSlot", {
        slot: self.state.slot,
        stream: self.state.sfutest.id,
      });
      var tracks = self.state.sfutest.webrtcStuff.myStream.getTracks();
      console.log(tracks);
    },
    error: function (error) {
      Janus.error("***** WebRTC error:", error);
    },
  });
}

export function unPublishCamera() {
  var self = this;
  console.log("unPublishing ..");
  var unpublish = { request: "unpublish" };
  self.state.sfutest.send({ message: unpublish });
  self.vStreamDettacher(self.state.sfutest);
  $("#camera-spinner").hide();
  $("#camera-on").show();
  $("#camera-off").css('color', 'initial');
  self.setState({ publishedCamera: false, videoState: "initial", slot: null });
}

export function toggleVideoDevice(deviceId){
  var self = this;
  if (self.state.publishedCamera) {
    self.unPublishCamera();
  }
  self.publishCamera(16, deviceId)
}

export function vexisitingParticipant(participantId) {
  var self = this;
  var exisiting = self.state.vparticipants.filter(
    (item) => item.uuid === participantId
  );
  if (exisiting.length === 0) {
    return true;
  } else {
    return false;
  }
}

export function vparticipantDisplay(participantId) {
  var self = this;
  var exisiting = self.state.vparticipants.filter(
    (item) => item.uuid === participantId
  );
  if (exisiting.length === 0) {
    return "";
  } else {
    return exisiting[0].display;
  }
}

export function vparticipantChangeStatus(participantId, status) {
  this.setState((prevState) => ({
    talking: {
      ...prevState.talking,
      [participantId]: status,
    },
  }));
}

export function vparticipantChangeRoom(participantId, room) {
  this.setState((prevState) => ({
    participantRoom: {
      ...prevState.participantRoom,
      [participantId]: room,
    },
  }));
}

export function vexitAudioRoom() {
  var self = this;
  if (this.state.mixertest) {
    this.state.mixertest.send({ message: { request: "unpublish" } });
  }
}


export function toggleCamera() {
  var self = this;
  $("#camera-spinner").show();
  $("#camera-off").hide();
  $("#camera-on").hide();
  if (!self.state.publishedCamera) {
    self.publishCamera();
  } else {
    self.unPublishCamera();
  }
}

function initDevices(devices) {
  var self = this;
  navigator.mediaDevices.enumerateDevices()
  .then(function(devices) {
    devices.forEach(function(device) {
      console.log(device.kind)
      if(device.kind === 'audiooutput') {
        $('#speakerSelect').append("<option value='"+device.deviceId+"'>"+device.label+"</option>")
       }
       if(device.kind === 'audioinput') {
        $('#audioSourceSelect').append("<option value='"+device.deviceId+"'>"+device.label+"</option>")
       }
       if(device.kind === 'videoinput') {
        $('#videoSourceSelect').append("<option value='"+device.deviceId+"'>"+device.label+"</option>")
       }
    });
  })
  .catch(function(err) {
    console.log(err.name + ": " + err.message);
  });
}
