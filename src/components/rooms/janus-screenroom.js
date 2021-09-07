import Janus from "../../janus-2021.js";
import React, { Component } from "react";
import $ from "jquery";
import { socket } from "../../socket.js";

export function scSessionCreate(room) {
  var self = this;
  Janus.init({
    debug: "none",
    callback: function () {
      // Create session
      var janus = new Janus({
        server: self.state.server,
        iceServers: [
          { url: "stun:stun.l.google.com:19302" },
          {
            url: "turn:sync1.ut.ac.ir:3478",
            username: "shafiei",
            credential: "12345678",
          },
        ],
        success: function () {
          console.log("sucess");
          // Attach to VideoRoom plugin
          janus.attach({
            plugin: "janus.plugin.videoroom",
            opaqueId: self.state.opaqueId,
            success: function (pluginHandle) {
              console.log("pluginHandle", pluginHandle);
              //scSfutest = pluginHandle;
              self.setState({ scJanus: janus });
              self.setState({ scSfutest: pluginHandle });
              Janus.log(
                "Plugin attached! (" +
                  self.state.scSfutest.getPlugin() +
                  ", id=" +
                  self.state.scSfutest.getId() +
                  ")"
              );
              Janus.log("  -- This is a publisher/manager");
              self.scRegisterUsername(room);
              // Prepare the username registration
            },
            error: function (error) {
              Janus.error("  -- Error attaching plugin...", error);
              console.log(error);
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
                    myScRoomId: msg["id"],
                    scJoined: true,
                  });
                  console.log(">>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<", msg);
                  Janus.log(
                    "Successfully joined room " +
                      msg["room"] +
                      " with ID " +
                      msg["id"]
                  );
                  //self.addParticipant(
                  //  msg["id"],
                  //  self.state.fullname + "§" + self.state.userUUID
                  //);
                  //if (
                  //  self.state.reloadParams &&
                  //  self.state.reloadParams["cam"]
                  //) {
                  //  self.ionRequestRoom();
                  //}
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
                      self.scAddParticipant(list[f]["id"], list[f]["display"]);
                      self.scNewRemoteFeed(id, "", display, audio, video);
                    }
                  }
                } else if (event === "destroyed") {
                  // The room has been destroyed
                  Janus.warn("The room has been destroyed!");
                } else if (event === "event") {
                  // Any new feed to attach to?
                  if (msg["publishers"]) {
                    var list = msg["publishers"];
                    console.debug(
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
                      self.scAddParticipant(list[f]["id"], list[f]["display"]);
                      self.scNewRemoteFeed(id, "", display, audio, video);
                    }
                  } else if (msg["leaving"]) {
                    // One of the publishers has gone away?
                    var leaving = msg["leaving"];
                    console.log("Publisher leaving: " + leaving);
                    self.setState(
                      {
                        scFeeds: self.state.scFeeds.filter(
                          (item) => item.rfid != leaving
                        ),
                      },
                      () => console.log("feeds: >>>>", self.state.scFeeds)
                    );
                    var unPublishedFeed = self.state.scFeeds.filter(
                      (item) => item.rfid === leaving
                    );
                    var remoteFeed = unPublishedFeed.shift();
                    if (remoteFeed != null) {
                      remoteFeed.detach();
                    }
                    self.scRemoveParticipant(leaving);
                  } else if (msg["unpublished"]) {
                    // One of the publishers has unpublished?
                    var unpublished = msg["unpublished"];
                    console.log("Publisher left: " + unpublished);
                    if (unpublished === "ok") {
                      self.state.scSfutest.hangup();
                      self.scStreamDettacher(self.state.scSfutest);
                      return;
                    }
                    var unPublishedFeed = self.state.scFeeds.filter(
                      (item) => item.rfid === unpublished
                    );
                    var remoteFeed = unPublishedFeed.shift();
                    if (remoteFeed != null) {
                      remoteFeed.detach();
                      self.scStreamDettacher(remoteFeed);
                    }
                    self.scRemoveParticipant(unpublished);

                    self.setState({
                      scFeeds: self.state.scFeeds.filter(
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
                self.state.scSfutest.handleRemoteJsep({ jsep: jsep });
              }
            },
            onlocalstream: function (stream) {
              Janus.debug(" ::: Got a local stream :::", stream);
              //console.log(" ::: Got a local stream :::", stream);
              var exisiting = self.state.scFeeds.filter(
                (item) => item.id === self.state.scSfutest.id
              );
              if (exisiting.length === 0) {
                self.state.scSfutest.rfid = self.state.myVroomId;
                self.setState({
                  scFeeds: self.state.scFeeds.concat(self.state.scSfutest),
                });
              }

              var videoTracks = stream.getVideoTracks();
              if (!videoTracks || videoTracks.length === 0) {
                self.scStreamDettacher(self.state.scSfutest);
              } else {
                self.scStreamAttacher(self.state.scSfutest, self.state.name);
              }

              stream.getVideoTracks()[0].onended = function () {
                self.toggleScreen();
              };
            },
            onremotestream: function (stream) {
              // The publisher stream is sendonly, we don't expect anything here
            },
            oncleanup: function () {
              self.scStreamDettacher(self.state.scSfutest);
              Janus.log(
                " ::: Got a cleanup notification: we are unpublished now :::"
              );
            },
          });
        },
        error: function (error) {
          Janus.error(error);
          //console.log(error)
          //bootbox.alert(error, function() {
        },
        destroyed: function () {
          window.location.reload();
        },
      });
    },
  });
}

export function scNewRemoteFeed(id, feeds, display, audio, video) {
  var self = this;
  var name = display.split("§")[0];
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
        room: parseInt(self.state.scRoomId),
        ptype: "subscriber",
        //pin: self.state.vpin,
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
          self.setState(
            { scFeeds: self.state.scFeeds.concat(remoteFeed) },
            () => console.log("@@@@", self.state.scFeeds)
          );

          if (!video) {
            self.scStreamDettacher(remoteFeed);
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
        self.scRemoveParticipant(remoteFeed.rfid);
      }
    },
    onlocalstream: function (stream) {
      console.log(">>>>>>>>>>>", stream);
    },
    onremotestream: function (stream) {
      console.log(">>>>>>>>>>>", stream);
      self.scStreamAttacher(remoteFeed, name);
    },
    ondata: function (data) {},
    oncleanup: function () {
      Janus.log(" ::: Got a cleanup notification (remote feed " + id + ") :::");
    },
  });
}

export function scRegisterUsername(room) {
  var self = this;
  console.log(parseInt(room));
  var register = {
    request: "join",
    room: parseInt(room),
    ptype: "publisher",
    //pin: self.state.vpin,
    display:
      self.state.fullname +
      " §" +
      self.state.userUUID +
      "§" +
      self.state.userColor +
      "§" +
      self.state.slot,
  };
  self.state.scSfutest.send({ message: register });
  //self.setState({ myVroomId: self.state.mixertest.id });
}

export function scStreamAttacher(feed, display = "") {
  var self = this;
  console.log("Attaching " + feed);
  console.log($("#screen-" + feed.id));
  if ($("#screen-" + feed.id).length == 0) {
    var localVideo = document.createElement("video");
    localVideo.autoplay = true;
    localVideo.muted = true;
    localVideo.width = 800;
    localVideo.id = "screen-" + feed.id;
    $("#screen").append(
      "<div id='s-" +
        feed.id +
        "' class='Screen' data-content='" +
        display +
        "'></div>"
    );
  }

  if (localVideo) $("#s-" + feed.id).append(localVideo);
  if (feed.id && feed.webrtcStuff && feed.webrtcStuff.remoteStream) {
    //self.setState({ vActive: true });
    //if (localVideo) $("#remoteVideos").append(localVideo);
    Janus.attachMediaStream(
      document.getElementById("screen-" + feed.id),
      feed.webrtcStuff.remoteStream
    );
    //self.disher();
  }
  if (feed.id && feed.webrtcStuff && feed.webrtcStuff.myStream) {
    Janus.attachMediaStream(
      document.getElementById("screen-" + feed.id),
      feed.webrtcStuff.myStream
    );
    //self.disher();
  }
  $("#screen-" + feed.id).css("width", "-webkit-fill-available");
}

export function scStreamDettacher(feed) {
  if (feed.id) {
    //console.log("Dettaching " + feed.id);
    $("#screen-" + feed.id).remove();
    $("#s-" + feed.id).remove();
    //this.disher();
  }
}

export function scRemoveParticipant(id) {
  var self = this;
  self.setState({
    scParticipants: self.state.scParticipants.filter((item) => item.id !== id),
  });
}

export function scAddParticipant(id, p) {
  var self = this;
  var participant = p.split("§");
  if (this.exisitingParticipant(participant[1])) {
    self.setState({
      scParticipants: self.state.scParticipants.concat({
        id: id,
        display: participant[0],
        uuid: participant[1],
        userColor: participant[2],
        role: "listener",
        current: "stopped-talking",
      }),
    });
  }
}

export function publishScreen(bitrate = 16, deviceId = null, stream = null) {
  var self = this;

  self.state.scSfutest.createOffer({
    media: {
      audioRecv: false,
      videoRecv: false,
      data: false,
      videoSend: true,
      video: "screen",
      screenshareFrameRate: 7,
      screenshareWidth: 1440,
      audioSend: false,
    },

    success: function (jsep) {
      Janus.debug("********* Got publisher SDP!", jsep);
      console.log("switching to " + bitrate);
      if (jsep) {
        var publish = {
          request: "configure",
          audio: false,
          video: true,
          data: false,
          bitrate: 5000000,
          publishers: 1,
        };
        self.state.scSfutest.send({ message: publish, jsep: jsep });
      }
      self.setState({ publishedScreen: true });
      $("#screen-spinner").hide();
      $("#screen-off").show();
      $("#screen-off").css("color", "black");
    },
    error: function (error) {
      Janus.error("***** WebRTC error:", error);
    },
  });
}

export function unPublishScreen() {
  var self = this;
  console.log("unPublishing ..");
  var unpublish = { request: "unpublish" };
  self.state.scSfutest.send({ message: unpublish });
  self.scStreamDettacher(self.state.scSfutest);
  $("#screen-spinner").hide();
  $("#screen-on").show();
  $("#screen-off").css("color", "initial");
  self.setState({ publishedScreen: false, videoState: "initial", slot: null });
}

export function scExisitingParticipant(participantId) {
  var self = this;
  var exisiting = self.state.scParticipants.filter(
    (item) => item.uuid === participantId
  );
  if (exisiting.length === 0) {
    return true;
  } else {
    return false;
  }
}

export function scParticipantDisplay(participantId) {
  var self = this;
  var exisiting = self.state.scParticipants.filter(
    (item) => item.uuid === participantId
  );
  if (exisiting.length === 0) {
    return "";
  } else {
    return exisiting[0].display;
  }
}

export function scParticipantChangeStatus(participantId, status) {
  this.setState((prevState) => ({
    talking: {
      ...prevState.talking,
      [participantId]: status,
    },
  }));
}

export function scParticipantChangeRoom(participantId, room) {
  this.setState((prevState) => ({
    participantRoom: {
      ...prevState.participantRoom,
      [participantId]: room,
    },
  }));
}

export function exitScreenRoom() {
  var self = this;
  if (this.state.scSfutest) {
    self.unPublishScreen();
    // this.state.scSfutest.send({ message: { request: "unpublish" } });
    this.state.scSfutest.send({ message: { request: "leave" } });
  }
}

export function toggleScreen() {
  var self = this;
  $("#screen-spinner").show();
  $("#screen-off").hide();
  $("#screen-on").hide();
  if (!self.state.publishedScreen) {
    self.publishScreen();
  } else {
    self.unPublishScreen();
  }
}

